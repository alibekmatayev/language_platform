import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchExercisesByLessonCode } from "../../api/lessons.api";

export default function LessonPage() {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { lessonCode, moduleCode } = location.state || {};

  useEffect(() => {
    if (lessonCode) {
      fetchExercisesByLessonCode(lessonCode).then(setExercises);
    }
  }, [lessonCode]);

  if (error) return <div>{error}</div>;
  if (exercises.length === 0) return <div>Упражнения не найдены</div>;

  return (
    <>
      {/* <div className="lesson-page">
      <h2>
        Упражнения для урока: {lessonCode} (модуль: {moduleCode || "не указан"})
      </h2>
      {exercises.map((exercise, idx) => (
        <div key={exercise.code || idx} className="exercise-block">
          <h3>{exercise.question}</h3>
          <p>
            <strong>Тип:</strong> {exercise.type}
          </p>
          <p>
            <strong>Объяснение:</strong> {exercise.explanation || "Нет"}
          </p>

          {exercise.type === "multiple_choice" && (
            <ul>
              {exercise.options.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>
          )}

          <p>
            <strong>Подсказки:</strong>
          </p>
          <ul>
            {exercise.hints && exercise.hints.length > 0 ? (
              exercise.hints.map((hint, index) => <li key={index}>{hint}</li>)
            ) : (
              <li>Нет подсказок</li>
            )}
          </ul>
        </div>
      ))}
    </div> */}
    </>
  );
}
