import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getUserByUsername, updateProfile } from "../api/users.api";
import { getStoredUser } from "../api/auth.api";
import { getFriendList } from "../api/friendship.api";
import { CiCamera } from "react-icons/ci";
import { FaPencilAlt } from "react-icons/fa";
import API from "../api/api";

const countryOptions = [
  { code: "KZ", name: "Казахстан", flag: "🇰🇿" },
  { code: "RU", name: "Россия", flag: "🇷🇺" },
  { code: "UA", name: "Украина", flag: "🇺🇦" },
  { code: "BY", name: "Беларусь", flag: "🇧🇾" },
  { code: "UZ", name: "Узбекистан", flag: "🇺🇿" },
  { code: "KG", name: "Киргизия", flag: "🇰🇬" },
];

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendCount, setFriendCount] = useState(0);

  const [editing, setEditing] = useState(false);
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [phone_region, setPhoneRegion] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = getStoredUser();
  const resolvedUsername = username === "me" ? storedUser?.username : username;
  const isOwnProfile = resolvedUsername === storedUser?.username;

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await API.post("/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newAvatarBaseUrl = res.data?.url || user.avatar_url;
      if (newAvatarBaseUrl) {
        const newAvatarWithTimestamp = `${newAvatarBaseUrl}?t=${Date.now()}`;
        setAvatarUrl(newAvatarWithTimestamp);
        setUser((prev) => ({ ...prev, avatar_url: newAvatarBaseUrl }));
        console.log("Ответ сервера", res.data);
      } else {
        throw new Error("Сервер не вернул ссылку на аватар");
      }
    } catch (err) {
      console.error("Ошибка загрузки аватара:", err);
      alert("Не удалось загрузить аватар");
    }
  };

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
    });
  };

  useEffect(() => {
    if (!resolvedUsername) return;

    setLoading(true);
    setError(null);

    getUserByUsername(resolvedUsername)
      .then((res) => {
        const u = res.data;
        setUser(u);
        setFirstname(u.first_name || "");
        setLastname(u.last_name || "");
        setPhone(u.phone || "");
        setPhoneRegion(u.phone_region || "");

        // Устанавливаем avatarUrl с ?t=... для обхода кеша
        if (u.avatar_url) {
          setAvatarUrl(`${u.avatar_url}?t=${Date.now()}`);
        }

        setLoading(false);
        return getFriendList(resolvedUsername);
      })
      .then((res) => {
        setFriendCount(res.data.total || res.data.usernames?.length || 0);
      })
      .catch((err) => {
        console.error("Ошибка загрузки профиля или друзей:", err);
        setError("Не удалось загрузить профиль.");
        setLoading(false);
      });
  }, [resolvedUsername]);

  const onSave = () => {
    setLoading(true);
    updateProfile({ first_name, last_name, phone, phone_region })
      .then(() => {
        setUser((prev) => ({
          ...prev,
          first_name,
          last_name,
          phone,
          phone_region,
        }));
        setEditing(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка обновления профиля", err);
        alert("Не удалось сохранить изменения");
        setLoading(false);
      });
  };

  if (!user) return <div className="profile-error">Загрузка...</div>;

  return (
    <div className="profile-wrapper">
      {location.state?.from === "/friends" && (
        <button onClick={() => navigate(-1)} className="back-button">
          ←
        </button>
      )}

      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          {!avatarError && avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Аватар"
              className="profile-avatar"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="profile-avatar-placeholder">
              <CiCamera />
            </div>
          )}

          {isOwnProfile && (
            <label className="avatar-upload-label" title="Загрузить аватар">
              <FaPencilAlt style={{ color: "#1f2e34", marginTop: "4px" }} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        <div className="profile-basic-info">
          {editing && isOwnProfile ? (
            <>
              <input
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Имя"
              />
              <input
                value={last_name}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Фамилия"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон"
              />
              <select
                value={phone_region}
                onChange={(e) => setPhoneRegion(e.target.value)}
                className="select-region"
              >
                <option value="">Выберите регион</option>
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>

              <div className="buttons-wrapper" style={{ marginTop: "5px" }}>
                <button
                  className="button-check"
                  onClick={onSave}
                  disabled={loading}
                >
                  Сохранить
                </button>
                <button
                  className="button-check"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Отмена
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>
                {user.first_name} {user.last_name}
              </h1>
              <p className="username">@{user.username}</p>
              <p className="reg-date">Телефон: {user.phone || "-"}</p>
              <p className="reg-date">
                Регистрация: {formatDate(user.created_at)}
              </p>

              {isOwnProfile && (
                <button
                  onClick={() => setEditing(true)}
                  className="button-check"
                >
                  Редактировать профиль
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div
          className="stat-block"
          onClick={() =>
            navigate(`/friends/${user.username}`, {
              state: { from: `/profile/${user.username}` },
            })
          }
        >
          <span className="stat-number">{friendCount}</span>
          <span className="stat-label">друзей</span>
        </div>
      </div>

      <div className="profile-progress">
        <h3>Прогресс</h3>
        <div>
          <strong>⭐: </strong>
          {user.progress?.xp}
        </div>
      </div>
    </div>
  );
};

export default Profile;
