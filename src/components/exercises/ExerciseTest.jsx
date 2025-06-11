import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExerciseRenderer from "./ExerciseRenderer";
import { updateProgress } from "../../api/progress.api";
import { getUserIdFromToken } from "../../api/auth.api";
import ExitModal from "../navigation/ExitModal";
import {
  MAX_LIVES,
  calculateCurrentLives,
  REGEN_INTERVAL,
} from "../../utils/livesManager";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function LessonTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exercises, moduleCode, lessonCode } = location.state || {};

  const [current, setCurrent] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [lives, setLives] = useState(MAX_LIVES);
  const [lastLifeUpdate, setLastLifeUpdate] = useState(Date.now());
  const [timeUntilNextLife, setTimeUntilNextLife] = useState(0);

  const user_id = getUserIdFromToken();

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

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        navigate("/learn");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isFinished, navigate]);

  useEffect(() => {
    if (lives === 0) {
      const timer = setTimeout(() => {
        navigate("/learn");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [lives, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowExitModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const handleExit = () => {
    setShowExitModal(true);
  };
  const handleComplete = async () => {
    if (current < exercises.length - 1) {
      setCurrent(current + 1);
    } else {
      setIsFinished(true);

      const earnedXp = 50;
      const earnedTasks = exercises.length;
      const earnedLessons = 1;

      const achievements_progress = [
        { achievement_id: 8, earned_progress: earnedXp },
        { achievement_id: 9, earned_progress: earnedTasks },
        { achievement_id: 10, earned_progress: earnedLessons },
      ];

      const payload = {
        user_id,
        xp: earnedXp,
        new_badges: [`${moduleCode}_${lessonCode}`],
        achievements_progress,
      };

      console.log("moduleCode", moduleCode);
      console.log("lessonCode", lessonCode);

      try {
        console.log(payload);
        await updateProgress(payload);
      } catch (error) {
        console.error("Ошибка обновления прогресса:", error);
      }
    }
  };

  const handleWrongAnswer = () => {
    if (lives > 0) {
      const newLives = lives - 1;
      const now = Date.now();
      localStorage.setItem("lives", newLives.toString());
      localStorage.setItem("lastLifeUpdate", now.toString());
      setLives(newLives);
      setLastLifeUpdate(now);
    }
  };

  if (!exercises || exercises.length === 0) {
    return <div>Нет упражнений</div>;
  }

  if (lives === 0) {
    return (
      <div className="test-center-wrapper">
        <div className="lesson-finished-message">У вас закончились жизни.</div>
        {timeUntilNextLife > 0 && (
          <div className="lives-timer">
            Следующая жизнь появится через: {formatTime(timeUntilNextLife)}
          </div>
        )}
      </div>
    );
  }

  const progress = isFinished ? 100 : (current / exercises.length) * 100;

  return (
    <div className="test-center-wrapper">
      <div className="test-header">
        <div className="exercise-exit" onClick={handleExit}>
          ✕
        </div>
        <ExitModal
          isOpen={showExitModal}
          onCancel={() => setShowExitModal(false)}
          onExit={() => navigate("/dashboard")}
        />
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="lives-test" title="Жизни">
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
            style={{ position: "absolute", top: "-0.05rem", right: "-3rem" }}
          >
            {formatTime(timeUntilNextLife)}
          </div>
        )}
      </div>

      {isFinished ? (
        <div className="lesson-finished-message">
          Вы успешно завершили данный урок!
        </div>
      ) : (
        <div className="test-wrapper">
          <div className="exercise-center-wrapper">
            <ExerciseRenderer
              exercise={exercises[current]}
              onComplete={handleComplete}
              onWrongAnswer={handleWrongAnswer}
            />
          </div>
        </div>
      )}
    </div>
  );
}
