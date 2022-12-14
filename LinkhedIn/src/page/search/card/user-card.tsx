import { useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../config/toast";
import { CONNECT_REQUEST_QUERY } from "../../../query/connect";
import "./card.scss";

export default function UserCard(props: any) {
  const user = props.user;
  const navigate = useNavigate();

  const [connectFunc] = useMutation(CONNECT_REQUEST_QUERY);

  function handleSubmit(e: any) {
    e.preventDefault();
    const text = e.target.text.value;
    connectFunc({ variables: { id: user.id, text: text } })
      .then((resp) => {
        toastSuccess("Succesfully send request to " + user.name);
        e.target.text.value = "";
      })
      .catch((err) => {
        e.target.text.value = "";
        toastError(err.message);
      });
  }

  function handleClick() {
    navigate("/profile/" + user.id);
  }

  return (
    <div className="user-card box">
      <div className="flex">
        <img onClick={handleClick} src={user.PhotoProfile} alt="" />
        <div className="text">
          <p>{user.name}</p>
          <form onSubmit={handleSubmit}>
            <div className="flex form-connect">
              <input className="input-border" type="text" name="text" />
              <button type="submit">Connect</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
