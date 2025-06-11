import React from "react";

export default function ExerciseResult({
  isCorrect,
  explanation,
  onComplete,
  onReset,
}) {
  return (
    <div className={`result ${isCorrect ? "correct" : "incorrect"}`}>
      <div>{isCorrect ? "Правильно!" : "Неправильно."}</div>

      {explanation && (
        <p>
          <em>Объяснение: {explanation}</em>
        </p>
      )}

      <div className="result-buttons">
        {!isCorrect && (
          <button className="button-check" onClick={onReset}>
            Попробовать снова
          </button>
        )}
        <button className="button-check" onClick={() => onComplete(true)}>
          Далее
        </button>
      </div>
    </div>
  );
}
