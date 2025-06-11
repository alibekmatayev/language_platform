import React, { useEffect, useState } from "react";
import { getRequestList, handleFriendRequest } from "../../api/friendship.api";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchRequests = async () => {
    try {
      const res = await getRequestList(user.username);
      if (res.data && Array.isArray(res.data.usernames)) {
        setRequests(res.data.usernames);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Ошибка загрузки входящих запросов", err);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const respondToRequest = async (requesterUsername, action) => {
    try {
      await handleFriendRequest(requesterUsername, user.username, action);
      fetchRequests();
    } catch (err) {
      console.error("Ошибка при обработке запроса", err);
    }
  };

  if (!Array.isArray(requests)) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="friendrequest-container">
      <h2>Входящие запросы</h2>
      {requests.length === 0 ? (
        <p>У вас нет входящих запросов.</p>
      ) : (
        <div className="friendrequest-list">
          {requests.map((requester) => (
            <div className="friendrequest-item" key={requester.username}>
              {requester.first_name || requester.last_name
                ? `${requester.first_name} ${requester.last_name}`.trim()
                : requester.username}{" "}
              <button
                onClick={() => respondToRequest(requester.username, "accepted")}
                className="button-add"
              >
                Принять
              </button>
              <button
                onClick={() => respondToRequest(requester.username, "declined")}
                className="button-remove"
              >
                Отклонить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
