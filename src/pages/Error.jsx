import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "10vh",
        fontFamily: "inherit",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#555" }}>404</h1>
      <p style={{ fontSize: "1.5rem" }}>Ой, а тут ничегошеньки нету...</p>
      <h1
        style={{
          cursor: "pointer",
          left: "1rem",
          top: "-0.5rem",
          position: "fixed",
          zIndex: 1000,
        }}
        onClick={() => navigate(-1)}
      >
        ←
      </h1>
    </div>
  );
}
