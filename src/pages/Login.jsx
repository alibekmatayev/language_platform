import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api/auth.api";

const Login = () => {
  const [identificator, setIdentificator] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signIn({ identificator, password });
      if (user) {
        navigate("/admin");
      } else {
        setError("Ошибка авторизации");
      }
    } catch (err) {
      setError("Неверные данные для входа");
    }
  };

  return (
    <>
      <div className="auth-switch">
        <button className="change-button" onClick={() => navigate("/register")}>
          У меня еще нет аккаунта
        </button>
      </div>
      <div className="center">
        <div className="auth-container">
          <h2>Войти в аккаунт</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="auth-listbox">
            <form onSubmit={handleSubmit} className="auth-list">
              <input
                className="input-field"
                type="text"
                placeholder="Ник или электронная почта"
                value={identificator}
                onChange={(e) => setIdentificator(e.target.value)}
                required
              />
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.7rem",
                    top: "1.65rem",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#1cb0f6",
                    fontWeight: "bold",
                  }}
                >
                  {showPassword ? "Скрыть" : "Показать"}
                </button>
              </div>

              <button className="auth-button" type="submit">
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
