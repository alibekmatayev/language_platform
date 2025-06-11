import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/learn", { replace: true });
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  if (checkingAuth) {
    return null;
  }

  return (
    <>
      <Header onStartClick={() => navigate("/register")} />

      <div className="welcome-main">
        <div className="center">
          <div className="welcome-text">
            <h1 style={{ marginBottom: "2rem" }}>
              Учите казахский язык бесплатно,
              <br />
              эффективно и главное интересно!
            </h1>
            <button
              className="starttt-button"
              style={{ marginRight: "0.5rem" }}
              onClick={() => navigate("/register")}
            >
              Начать
            </button>
            <button
              className="starttt-button"
              onClick={() => navigate("/login")}
            >
              У меня уже есть аккаунт
            </button>
          </div>
        </div>
      </div>

      <div className="welcome-page">
        <section className="welcome-section">
          <div className="welcome-text">
            <h2 className="highlight">Бесплатно, эффективно и весело</h2>
            <p>
              Учиться с <strong>Uiren</strong> весело и интересно. Зарабатывайте
              очки за правильные ответы, открывайте новые материалы и развивайте
              навыки.
            </p>
          </div>
          <img
            className="wp-image"
            src="\addition\certificate.svg"
            alt="certificate"
          />
        </section>

        <section className="welcome-section reverse">
          <img
            className="wp-image"
            src="\addition\light-bulb.svg"
            alt="light-bulb"
          />
          <div className="welcome-text">
            <h2 className="highlight">Научный подход</h2>
            <p>
              Уникальный метод обучения и увлекательные материалы: наши уроки
              эффективно развивают навыки чтения, письма, понимания.
            </p>
          </div>
        </section>

        <section className="welcome-section">
          <div className="welcome-text">
            <h2 className="highlight">Стимул к учёбе</h2>
            <p>
              Игровой подход с наградами и напоминаниями помогает вам выработать
              привычку и заниматься регулярно.
            </p>
          </div>
          <img
            className="wp-image"
            src="\addition\mortarboard.svg"
            alt="mortarboard"
          />
        </section>

        <section className="welcome-section reverse">
          <img className="wp-image" src="\addition\palette.svg" alt="palette" />
          <div className="welcome-text">
            <h2 className="highlight">Индивидуальное обучение</h2>
            <p>
              Наши уроки адаптируются под ваш уровень и интересы. Каждый
              пользователь получает персонализированный путь.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
