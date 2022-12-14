package my_auth

import (
	"context"
	"errors"
	"fmt"

	"github.com/TinTinWinata/gqlgen/database"
	"github.com/TinTinWinata/gqlgen/graph/model"
	"github.com/TinTinWinata/gqlgen/mail"
	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"gorm.io/gorm"
)

func UserRegister(ctx context.Context, newUser model.NewUser) (interface{}, error) {

	_, err := UserGetByEmail(ctx, newUser.Email)
	// Register

	if err == nil {
		if err != gorm.ErrRecordNotFound {
			return nil, errors.New("Email has been used by another user")
		}
	}

	var exists = CheckNameAlreadyExists(ctx, newUser.Name)

	if exists {
		return nil, errors.New("Name has been used by another user")
	}

	createdUser, err := UserCreate(ctx, newUser)

	if err != nil {
		return nil, err
	}
	token, err := GenerateJWT(ctx, createdUser.ID)
	if err != nil {
		return nil, err
	}

	newId := uuid.New().String()

	verification := &model.UserValidation{
		ID:     newId,
		Link:   "http://localhost:3030/verification/" + newId,
		UserID: createdUser.ID,
	}

	db := database.GetDB()
	err = db.Create(verification).Error

	if err != nil {
		return nil, err
	}

	mail.SendVerification(verification.Link, createdUser.Email)

	return map[string]interface{}{
		"token": token,
		"id":    createdUser.ID,
	}, nil
}

func UserLogin(ctx context.Context, email string, password string) (interface{}, error) {
	user, err := UserGetByEmail(ctx, email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &gqlerror.Error{
				Message: "Email Not Found",
			}
		}
		return nil, err
	}
	if user.Validate == false {
		return nil, errors.New("Your account is not authenticated!")
	}
	if err := ComparePassword(user.Password, password); err != nil {
		return nil, err
	}
	token, err := GenerateJWT(ctx, user.ID)
	if err != nil {
		return nil, err
	}
	fmt.Println(user.BgPhotoProfile)
	return map[string]interface{}{
		"id":                user.ID,
		"token":             token,
		"name":              user.Name,
		"email":             user.Email,
		"PhotoProfile":      user.PhotoProfile,
		"FollowedUser":      user.FollowedUser,
		"RequestConnect":    user.RequestConnect,
		"BgPhotoProfile":    user.BgPhotoProfile,
		"RequestConnectTxt": user.RequestConnectTxt,
		"Headline":          user.Headline,
		"FirstName":         user.FirstName,
		"LastName":          user.LastName,
		"AdditionalName":    user.AdditionalName,
		"Gender":            user.Gender,
		"BlockedUser":       user.BlockedUser,
	}, nil
}

func UserLoginWithoutPassword(ctx context.Context, email string) (interface{}, error) {
	fmt.Println("disini login!")
	user, err := UserGetByEmail(ctx, email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &gqlerror.Error{
				Message: "Email Not Found",
			}
		}
		return nil, err
	}

	token, err := GenerateJWT(ctx, user.ID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"id":                user.ID,
		"token":             token,
		"name":              user.Name,
		"email":             user.Email,
		"PhotoProfile":      user.PhotoProfile,
		"FollowedUser":      user.FollowedUser,
		"RequestConnect":    user.RequestConnect,
		"Headline":          user.Headline,
		"ProfileViews":      user.ProfileViews,
		"BgPhotoProfile":    user.BgPhotoProfile,
		"RequestConnectTxt": user.RequestConnectTxt,
		"FirstName":         user.FirstName,
		"LastName":          user.LastName,
		"AdditionalName":    user.AdditionalName,
		"Gender":            user.Gender,
		"BlockedUser":       user.BlockedUser,
	}, nil
}
