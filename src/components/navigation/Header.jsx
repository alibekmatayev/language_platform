import { useEffect, useState } from "react";
import logo from "/logo.svg";

export default function StickyHeader({ onStartClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`welcome-header ${scrolled ? "scrolled" : ""}`}>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="header-logo" />
      </div>
      <button
        className={`start-button ${scrolled ? "visible" : ""}`}
        onClick={onStartClick}
      >
        Начать
      </button>
    </header>
  );
}
