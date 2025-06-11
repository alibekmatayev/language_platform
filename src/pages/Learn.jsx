import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchModulesUsers } from "../api/modules.api";
import { fetchExercisesByLessonCode } from "../api/exercises.api";
import { getUserByUsername } from "../api/users.api";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { TbCancel } from "react-icons/tb";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  MAX_LIVES,
  calculateCurrentLives,
  REGEN_INTERVAL,
} from "../utils/livesManager";

export default function Learn() {
  const [modules, setModules] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userXp, setUserXp] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [nextAllowedLesson, setNextAllowedLesson] = useState(null);
  const [lives, setLives] = useState(MAX_LIVES);
  const [lastLifeUpdate, setLastLifeUpdate] = useState(Date.now());
  const [timeUntilNextLife, setTimeUntilNextLife] = useState(0);

  function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  useEffect(() => {
    const loadModulesAndUser = async () => {
      try {
        if (!username) throw new Error("Имя пользователя не найдено");

        const [userResponse, moduleResponse] = await Promise.all([
          getUserByUsername(username),
          fetchModulesUsers(),
        ]);

        const user = userResponse?.data;
        const progress = user?.progress || {};
        const xp = Number(progress.xp) || 0;
        const badges = Array.isArray(progress.badges) ? progress.badges : [];

        const allLessons = (moduleResponse?.modules || []).flatMap(
          (mod) => mod.lessons || []
        );
        const nextAllowed = allLessons.find(
          (lesson) => !badges.some((badge) => badge.endsWith(lesson))
        );
        setNextAllowedLesson(nextAllowed);

        setUserXp(xp);
        setCompletedLessons(badges);
        const enhancedModules = (moduleResponse?.modules || []).map((mod) => {
          const requiredXp = Number(mod.unlock_requirements?.min_xp) || 0;
          return {
            ...mod,
            isUnlocked: xp >= requiredXp,
            requiredXp,
          };
        });

        setModules(enhancedModules);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError("Ошибка загрузки модулей");
      } finally {
        setLoading(false);
      }
    };

    loadModulesAndUser();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        goToNextModule();
      } else if (event.key === "ArrowLeft") {
        goToPrevModule();
      } else if (/^Digit[1-5]$/.test(event.code)) {
        const digit = parseInt(event.code.replace("Digit", ""), 10);
        const lessons = modules[currentIndex]?.lessons || [];
        const selectedLesson = lessons[digit - 1];

        if (selectedLesson === nextAllowedLesson) {
          handleLessonClick(selectedLesson);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modules, currentIndex, completedLessons]);

  const goToNextModule = () => {
    if (currentIndex < modules.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrevModule = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleLessonClick = async (lessonCode) => {
    if (!lessonCode || typeof lessonCode !== "string") {
      alert("Некорректный урок");
      return;
    }

    if (lessonCode !== nextAllowedLesson) {
      alert("Этот урок пока недоступен");
      return;
    }

    try {
      const exercises = await fetchExercisesByLessonCode(lessonCode);
      if (!exercises || exercises.length === 0) {
        alert("В данном уроке нет заданий");
        return;
      }

      navigate("/lesson", {
        state: {
          exercises,
          moduleCode: modules[currentIndex]?.code,
          lessonCode,
        },
      });
    } catch (err) {
      console.error("Ошибка при загрузке упражнений:", err);
      alert("Ошибка загрузки упражнений");
    }
  };

  useEffect(() => {
    const { lives: currentLives, lastUpdate } = calculateCurrentLives();
    setLives(currentLives);
    setLastLifeUpdate(lastUpdate);

    if (currentLives < MAX_LIVES) {
      const now = Date.now();
      const timeLeft = REGEN_INTERVAL - (now - lastUpdate);
      setTimeUntilNextLife(Math.max(0, timeLeft));
    } else {
      setTimeUntilNextLife(0);
    }
  }, []);

  // 2. Обновление каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      const { lives: currentLives, lastUpdate } = calculateCurrentLives();
      setLives(currentLives);
      setLastLifeUpdate(lastUpdate);

      if (currentLives < MAX_LIVES) {
        const now = Date.now();
        const timeLeft = REGEN_INTERVAL - (now - lastUpdate);
        setTimeUntilNextLife(Math.max(0, timeLeft));
      } else {
        setTimeUntilNextLife(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="content-container">
        <div className="center">
          <div className="module-header">
            <div className="skeleton skeleton-module" />
          </div>
          <div className="lesson-container">
            <div className="lesson-list">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton skeleton-lesson" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;
  if (modules.length === 0) return <div>Нет доступных модулей</div>;

  const currentModule = modules[currentIndex];
  const lessons = Array.isArray(currentModule.lessons)
    ? currentModule.lessons
    : [];

  return (
    <div className="content-container">
      <div className="lives-learn" title="Жизни">
        {[...Array(MAX_LIVES)].map((_, i) =>
          i < lives ? (
            <FaHeart key={i} color="red" size={24} />
          ) : (
            <FaHeart key={i} color="#274957" size={24} />
          )
        )}
      </div>
      {lives < MAX_LIVES && timeUntilNextLife > 1000 && (
        <div
          className="lives-timer"
          style={{
            position: "absolute",
            top: "4rem",
            right: "6.36rem",
            color: "white",
          }}
        >
          {formatTime(timeUntilNextLife)}
        </div>
      )}
      <div className="center">
        <div className="module-header">
          <button
            onClick={goToPrevModule}
            disabled={currentIndex === 0}
            className="module-switch"
          >
            <IoIosArrowBack className="switch-icon" />
          </button>
          <div
            className="module-block"
            style={{
              backgroundColor: currentModule.isUnlocked
                ? "#009fd9"
                : "rgb(87 87 87)",
              color: currentModule.isUnlocked ? "white" : "gray",
              opacity: currentModule.isUnlocked ? 1 : 0.6,
            }}
          >
            <h2 style={{ color: currentModule.isUnlocked ? "white" : "gray" }}>
              Модуль {currentIndex + 1}: {currentModule.title}
            </h2>
          </div>
          <button
            className="module-switch"
            onClick={goToNextModule}
            disabled={currentIndex >= modules.length - 1}
          >
            <IoIosArrowForward className="switch-icon" />
          </button>
        </div>

        <div className="lesson-container">
          {lessons.length === 0 ? (
            <div>Нет заданий в этом модуле</div>
          ) : (
            <div className="lesson-list">
              {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.some((badge) =>
                  badge.endsWith(lesson)
                );

                const isLocked = !currentModule.isUnlocked;
                const isAllowed = lesson === nextAllowedLesson;

                return (
                  <div
                    key={lesson || `lesson-${index}`}
                    className="lesson-block"
                    onClick={() =>
                      isAllowed ? handleLessonClick(lesson) : null
                    }
                    style={{
                      backgroundColor: isCompleted
                        ? "#264958"
                        : isAllowed
                        ? "#009fd9"
                        : isLocked
                        ? "rgb(87 87 87)"
                        : "#264958",

                      color: "white",
                      cursor: isAllowed ? "pointer" : "not-allowed",
                      opacity: isAllowed ? 1 : 0.6,
                      pointerEvents: isAllowed ? "auto" : "none",
                      border: isAllowed ? "3px solid yellow" : "none",
                      position: "relative",
                    }}
                  >
                    {isCompleted ? (
                      <ImCheckmark
                        style={{ fontSize: "24px", color: "gray" }}
                      />
                    ) : isLocked ? (
                      <TbCancel style={{ fontSize: "28px", color: "gray" }} />
                    ) : (
                      <FaStar style={{ fontSize: "24px" }} />
                    )}

                    {isAllowed && <div className="next-lesson">НАЧАТЬ</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
