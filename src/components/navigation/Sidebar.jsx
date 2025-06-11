import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "/logo.svg";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/learn", icon: "/sidebar/learn.svg", label: "Обучение" },
    { to: "/modules", icon: "/sidebar/modules.svg", label: "Модули" },
    { to: "/friends/me", icon: "/sidebar/friends.svg", label: "Друзья" },
    { to: "/ratings", icon: "/sidebar/rating.svg", label: "Рейтинги" },
    {
      to: "/achievements",
      icon: "/sidebar/achievements.svg",
      label: "Достижения",
    },
    { to: "/profile/me", icon: "/sidebar/profile.svg", label: "Профиль" },
    { to: "/logout", icon: null, label: "Выйти" },
  ];

  // Устанавливаем начальный activeIndex при загрузке
  useEffect(() => {
    const currentPath = location.pathname;
    const index = navItems.findIndex((item) => currentPath.startsWith(item.to));
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname]);

  // Обновляем activeIndex при нажатии клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "ArrowDown") {
        setActiveIndex((prev) => (prev + 1) % navItems.length);
      } else if (e.key === "ArrowUp") {
        setActiveIndex(
          (prev) => (prev - 1 + navItems.length) % navItems.length
        );
      } else if (e.key === "Enter") {
        navigate(navItems[activeIndex].to);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, navItems, navigate]);

  // Фокус на элементе после изменения activeIndex
  useEffect(() => {
    navRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  let username = localStorage.getItem("username");

  if (!username) {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        username = decoded.username;
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
      }
    }
  }

  return (
    <div className="sidebar">
      <img className="logo" src={logo} alt="Uiren" />
      <div className="nav-list">
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""} ${
                index === activeIndex ? "keyboard-focus" : ""
              }`
            }
            ref={(el) => (navRefs.current[index] = el)}
            tabIndex={-1}
            onFocus={() => setActiveIndex(index)} // При фокусе мышкой
            onClick={() => setActiveIndex(index)} // При клике мышкой
          >
            {item.icon && (
              <img src={item.icon} alt={item.label} className="nav-icon" />
            )}
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
