import React, { useEffect, useRef, useState } from "react";
import { getFriendList, deleteFriend } from "../../api/friendship.api";
import { Link, useNavigate } from "react-router-dom";
import { FaUserFriends, FaUserSlash } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const FriendList = ({ currentUsername }) => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null); // ✅ Один ref — только для открытого меню

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await getFriendList(currentUsername);
      if (res.data && Array.isArray(res.data.usernames)) {
        setFriends(res.data.usernames);
      } else {
        setFriends([]);
      }
    } catch (err) {
      console.error("Ошибка загрузки друзей", err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFriend = async (recipientUsername) => {
    try {
      await deleteFriend(currentUsername, recipientUsername);
      setFriends((prev) =>
        prev.filter((friend) => friend.username !== recipientUsername)
      );
    } catch (err) {
      console.error("Ошибка удаления друга", err);
      alert("Не удалось удалить друга.");
    }
  };

  useEffect(() => {
    if (currentUsername) {
      fetchFriends();
    }
  }, [currentUsername]);

  const visibleFriends = showAll ? friends : friends.slice(0, 3);

  const toggleMenu = (username) => {
    setOpenMenu((prev) => (prev === username ? null : username));
  };

  const goToFriendsTab = (username) => {
    navigate(`/profile/${username}`, {
      state: { from: "/friends" },
    });
  };

  return (
    <div className="friends-container">
      {friends.length === 0 ? (
        <p>У пользователя пока нет друзей.</p>
      ) : (
        <>
          <div className="friends-list">
            {visibleFriends.map((friend) => (
              <div key={friend.username} className="friend-box">
                <Link
                  to={`/profile/${friend.username}`}
                  state={{ from: "/friends" }}
                  className="friend-link"
                >
                  {friend.first_name || friend.last_name
                    ? `${friend.first_name} ${friend.last_name}`.trim()
                    : friend.username}
                </Link>

                <div className="menu-container">
                  <button
                    onClick={() => toggleMenu(friend.username)}
                    className="menu-button"
                  >
                    <BsThreeDotsVertical />
                  </button>

                  {openMenu === friend.username && (
                    <div className="dropdown-menu" ref={menuRef}>
                      <button
                        className="menu-item"
                        onClick={() => {
                          goToFriendsTab(friend.username);
                          setOpenMenu(null);
                        }}
                      >
                        <FaUserFriends style={{ color: "#4ea1f3" }} />
                        <span>Посмотреть друзей</span>
                      </button>

                      <button
                        className="menu-item"
                        onClick={() => {
                          handleDeleteFriend(friend.username);
                          setOpenMenu(null);
                        }}
                      >
                        <FaUserSlash style={{ color: "#ff4d4f" }} />
                        <span>Удалить из друзей</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {friends.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="button-friends"
            >
              {showAll ? "Скрыть" : "Показать всех"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FriendList;
