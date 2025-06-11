// src/api/auth.api.js
import API from "./api";
import { jwtDecode } from "jwt-decode";

export const signIn = async ({ identificator, password }) => {
  const response = await API.post("/sign-in", { identificator, password });
  const { access_token, refresh_token } = response.data;

  let user = null;
  try {
    const payload = jwtDecode(access_token);

    user = {
      username: payload.username,
      email: payload.email,
      isAdmin: payload.isAdmin,
      access_token,
      refresh_token,
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
  } catch (error) {
    console.error("Failed to decode JWT", error);
  }

  return { user, access_token, refresh_token };
};

export const register = (data) => API.post("/register", data);

export const verify = (username, code) =>
  API.get(`/verify/${username}/${code}`);

export const refreshToken = (token) =>
  API.get(`/refresh-token?refresh_token=${token}`);

export const getStoredUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export function getUserIdFromToken() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payloadBase64Url = token.split(".")[1];
    if (!payloadBase64Url) return null;

    // base64url -> base64
    const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Decode Base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    // Например, в payload.id или payload.sub
    return payload.id || payload.sub || null;
  } catch (e) {
    console.error("Не удалось декодировать токен", e);
    return null;
  }
}
