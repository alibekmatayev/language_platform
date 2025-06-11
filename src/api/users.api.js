// src/api/users.api.js

import API from "./api";

export const getUsers = () => API.get("/users");
export const getUser = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post("/users", data);
export const updateUser = (id, data) => API.patch(`/users/${id}`, data);

// users.api.js
export const getUserByUsername = (username) => {
  return API.get(`/data/users?username=${username}&withProgress=true`);
};

export const updateProfile = (data) => API.patch("/profile", data);
