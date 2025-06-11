import { useParams, useNavigate, useLocation } from "react-router-dom";
import SendFriendRequest from "../components/friendship/SendFriendRequest";
import FriendRequests from "../components/friendship/FriendRequests";
import FriendList from "../components/friendship/FriendList";
import { getStoredUser } from "../api/auth.api";

export default function Friends() {
  const { username } = useParams();
  const localUser = getStoredUser();
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedUsername = username === "me" ? localUser?.username : username;

  const isOwnProfile =
    !username || username === "me" || username === localUser?.username;

  return (
    <div className="friends-wrapper">
      {location.state?.from?.startsWith("/profile") && (
        <button onClick={() => navigate(-1)} className="back-button">
          ←
        </button>
      )}

      <div className="friends-header">
        <div className="friends-basic-info">
          <h1>{isOwnProfile ? "Мои друзья" : `Друзья ${resolvedUsername}`}</h1>
        </div>
      </div>

      <div className="friends-tabs">
        <FriendList currentUsername={resolvedUsername} />
        {isOwnProfile && (
          <>
            <SendFriendRequest currentUsername={resolvedUsername} />
            <FriendRequests currentUsername={resolvedUsername} />
          </>
        )}
      </div>
    </div>
  );
}
