import React, { useState, useRef } from "react";

export default function ManualTyping({
  data,
  onComplete,
  isLastExercise,
  onWrongAnswer,
}) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const inputRef = useRef(null);

  const handleSubmit = () => {
    const normalizedInput = input.trim().toLowerCase();
    const normalizedAnswer = data.correct_answer.trim().toLowerCase();
    const result = normalizedInput === normalizedAnswer;

    setIsCorrect(result);
    setSubmitted(true);

    if (!result && typeof onWrongAnswer === "function") {
      onWrongAnswer();
    }
  };

  const handleReset = () => {
    setInput("");
    setSubmitted(false);
    setIsCorrect(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!submitted) {
        handleSubmit();
      } else if (submitted && !isCorrect) {
        handleReset();
      } else if (submitted && isCorrect) {
        onComplete(true);
      }
    }
  };

  return (
    <div className="manual-typing">
      <h3>{data.question}</h3>
      <div style={{ position: "relative", display: "inline-block" }}>
        <input
          ref={inputRef}
          type="text"
          value={
            submitted ? (isCorrect ? "Правильно!" : "Неправильно.") : input
          }
          onChange={(e) => setInput(e.target.value)}
          readOnly={submitted}
          onKeyDown={handleKeyDown}
          className={submitted ? (isCorrect ? "correct" : "incorrect") : ""}
        />
        {submitted && isCorrect && <></>}
      </div>

      {!submitted && (
        <button
          className="button-check"
          onClick={handleSubmit}
          disabled={input.trim() === ""}
        >
          Проверить
        </button>
      )}

      {submitted && (
        <div
          className={`result ${isCorrect ? "correct" : "incorrect"}`}
          style={{ marginTop: "16px" }}
        >
          <div className="result-buttons">
            {!isCorrect && (
              <button className="button-check" onClick={handleReset}>
                Попробовать снова
              </button>
            )}
            {isCorrect && (
              <button
                className="button-check"
                onClick={() => onComplete(true)}
                style={{ marginLeft: "8px" }}
              >
                {isLastExercise ? "Завершить" : "Далее"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
