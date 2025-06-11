import React, { useState } from "react";
import { sendFriendRequest } from "../../api/friendship.api";

const SendFriendRequest = () => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSend = async () => {
    try {
      await sendFriendRequest(user.username, username);
      setStatus("Запрос отправлен");
      setUsername("");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setStatus("Пользователь не найден.");
      } else if (err.response && err.response.status === 409) {
        setStatus("Запрос уже отправлен.");
      } else {
        setStatus("Укажите пользователя, которого хотите добавить в друзья.");
      }
    }
  };

  return (
    <div className="sendfriend-container">
      <h2>Добавить в друзья</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Имя пользователя"
        className=""
      />
      <button onClick={handleSend} className="button-friends">
        Отправить
      </button>
      {status && <p className="">{status}</p>}
    </div>
  );
};

export default SendFriendRequest;
