import { useQuery } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { USER_SUGGESTION_QUERY } from "../../query/user";
import "./userMightKnow.scss";

export default function UserMightKnow() {
  const { data } = useQuery(USER_SUGGESTION_QUERY);

  const navigate = useNavigate();

  if (!data) {
    return <></>;
  }

  if (data.userSuggestion.length === 0) {
    return <></>;
  }

  return (
    <div className="box container user-might-know">
      <h2 className="color-first header">User Might be Know</h2>
      <div className="user-container">
        {data.userSuggestion.map((user: any, idx: any) => {
          function handleNavigate() {
            navigate("/profile/" + user.id);
          }

          return (
            <div className="mt-5 user flex flex-col">
              <div className="center">
                <img src={user.PhotoProfile} alt="" />
              </div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <button onClick={handleNavigate}>See Profile</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
