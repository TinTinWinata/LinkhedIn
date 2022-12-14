import { useMutation } from "@apollo/client";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { toastSuccess } from "../../../config/toast";
import { useUserAuth } from "../../../hooks/userContext";
import { MESSAGE_QUERY } from "../../../query/message";
import { getChannel, sendMessageFirebase } from "../../../script/helper";
import "./sendMessage.scss";

export default function SendMessage(props: any) {
  const userContext = useUserAuth();
  const user = props.user;
  const setHandle = props.setHandle;
  const [messageFunc] = useMutation(MESSAGE_QUERY);
  function handleSubmit(e: any) {
    e.preventDefault();
    const text = e.target.text.value;
    const message = {
      userId: user.id,
      message: "Hi, i send you a message: " + text,
      link: "/profile/" + user.id,
    };
    messageFunc({ variables: message }).then((resp) => {
      sendMessageFirebase(
        getChannel(user.id, userContext.user.id),
        "Hi, i send you a message: " + text,
        userContext.user.name,
        "/profile/" + user.id
      ).then(() => {
        setHandle(false);
        toastSuccess("Succesfully send message!");
      });
    });
  }

  return (
    <>
      <div className="popup"></div>
      <div className="popup-container send-message-popup">
        <form action="" onSubmit={handleSubmit}>
          <FaTimes
            onClick={() => {
              setHandle(false);
            }}
            className="x-icon"
          ></FaTimes>
          <div className="flex flex-col">
            <div className="flex mb-3 mt-1">
              <img src={user.PhotoProfile} alt="" />
              <div className="center">
                <div className="flex flex-col">
                  <h3 className="ml-2">{user.name}</h3>
                  <p className="ml-2">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="center">
              <input className="input-border mb-3" type="text" name="text" />
            </div>
            <button>Send</button>
          </div>
        </form>
      </div>
    </>
  );
}
