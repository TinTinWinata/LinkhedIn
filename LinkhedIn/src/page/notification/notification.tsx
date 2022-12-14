import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useRefetch } from "../../hooks/refetchContext";
import { MY_NOTIFICATION_QUERY } from "../../query/notification";
import NotificationCard from "./notification-card";
import "./notification.scss";

export default function Notification() {
  const { data, refetch } = useQuery(MY_NOTIFICATION_QUERY);
  const { refetchUser } = useRefetch();
  useEffect(() => {
    refetchUser();
  }, []);

  if (!data) {
    return <></>;
  }

  return (
    <div className="h-min-max center-x">
      <div className="notification-container box">
        <div className="header">
          <h2 className="color-first ml-2 mt-2">Notifications</h2>
        </div>
        {data.myNotification.length == 0 ? (
          <p className="nothaveany ml-2 mb-2">
            You don't have any notification
          </p>
        ) : (
          ""
        )}
        {data.myNotification.map((data: any) => {
          return (
            <NotificationCard
              refetch={refetch}
              data={data}
              key={data.id}
            ></NotificationCard>
          );
        })}
      </div>
    </div>
  );
}
