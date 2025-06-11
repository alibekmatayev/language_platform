// src/api/friendships.api.js
import API from "./api";

export const sendFriendRequest = (requesterUsername, recipientUsername) =>
  API.post("/friends/send-request", {
    requester_username: requesterUsername,
    recipient_username: recipientUsername,
  });

export const handleFriendRequest = (
  recipientUsername,
  requesterUsername,
  status
) =>
  API.post("/friends/handle-request", {
    requester_username: requesterUsername,
    recipient_username: recipientUsername,
    status,
  });

export const deleteFriend = (requesterUsername, recipientUsername) =>
  API.delete("/friends", {
    data: {
      requester_username: requesterUsername,
      recipient_username: recipientUsername,
    },
  });

export const getFriendList = (username) =>
  API.get(`/friends/friend-list?username=${username}`);

export const getRequestList = (username) =>
  API.get(`/friends/request-list?username=${username}`);
