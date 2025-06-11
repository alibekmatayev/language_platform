import { useEffect } from "react";
import { refreshToken } from "../api";

export default function useRefreshToken(token) {
  useEffect(() => {
    if (!token) return;
    refreshToken(token)
      .then((res) => console.log("Token refreshed:", res.data))
      .catch((err) => console.error("Token refresh failed:", err));
  }, [token]);
}
