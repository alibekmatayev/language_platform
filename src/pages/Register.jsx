import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "../api/auth.api";

const RegisterForm = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      setError("Все поля должны быть заполнены!");
      return;
    }

    try {
      await register(form);
      toast.success("Регистрация успешна! Переход на страницу входа...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const message = err?.response?.data?.message || "Ошибка регистрации";
      setError(message);
    }
  };

  return (
    <>
      <div className="auth-switch">
        <button className="change-button" onClick={() => navigate("/login")}>
          У меня уже есть аккаунт
        </button>
      </div>
      <div className="center">
        <div className="auth-container">
          <h2>Создайте аккаунт</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="auth-listbox">
            <form onSubmit={handleSubmit} className="auth-list">
              <input
                className="input-field"
                type="text"
                placeholder="Ник"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
              <input
                className="input-field"
                type="email"
                placeholder="Электронная почта"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
                Зарегистрироваться
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default RegisterForm;
