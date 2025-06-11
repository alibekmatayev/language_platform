import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setLoggedOut(true);
  }, []);

  if (loggedOut) {
    return <Navigate to="/" replace />;
  }

  return <div>Выход...</div>;
};

export default Logout;
