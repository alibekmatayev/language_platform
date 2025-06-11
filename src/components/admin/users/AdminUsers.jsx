import React, { useEffect, useState } from "react";
import { getUsers, getUser, updateUser } from "../../../api/users.api";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    phone_region: "",
  });

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch(console.error);
  }, []);

  const handleSelectUser = (id) => {
    setSelectedId(id);
    getUser(id)
      .then((res) => {
        setUserDetails(res.data);
        setFormData({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          phone: res.data.phone || "",
          phone_region: res.data.phone_region || "",
        });
      })
      .catch(console.error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    const formattedPhone = formData.phone.startsWith("+")
      ? formData.phone
      : `+${formData.phone}`;

    const updatedData = {
      ...formData,
      phone: formattedPhone,
    };

    updateUser(selectedId, updatedData)
      .then(() => alert("User updated"))
      .catch((err) => {
        if (err.response) {
          console.error("Error response data:", err.response.data);
        } else {
          console.error("Unknown error:", err);
        }
      });
  };

  return (
    <div className="center">
      <h1>Управление пользователями</h1>
      <div className="admin-panel-container">
        {userDetails && (
          <div className="edit-user-form">
            <h3>Редактирование: {userDetails.username}</h3>
            <input
              name="first_name"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <input
              name="last_name"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              name="phone_region"
              placeholder="Phone region"
              value={formData.phone_region}
              onChange={handleChange}
            />
            <button className="button-add" onClick={handleUpdate}>
              Обновить
            </button>
          </div>
        )}
        <ul className="user-list">
          {users.map((u) => (
            <li key={u.id}>
              <span>
                {u.username} — {u.email}
              </span>
              <button
                className="button-check"
                onClick={() => handleSelectUser(u.id)}
              >
                Редактировать
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
