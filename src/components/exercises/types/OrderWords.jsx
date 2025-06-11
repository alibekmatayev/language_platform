import React, { useState } from "react";

export default function OrderWords({
  data,
  onComplete,
  isLastExercise,
  onWrongAnswer,
}) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSelect = (word) => {
    if (submitted || selected.includes(word)) return;
    setSelected([...selected, word]);
  };

  const handleDeselect = (word) => {
    if (submitted) return;
    setSelected(selected.filter((w) => w !== word));
  };

  const handleSubmit = () => {
    const result =
      JSON.stringify(selected) === JSON.stringify(data.correct_order);
    setIsCorrect(result);
    setSubmitted(true);

    if (result) {
      onComplete({ correct: true });
    } else if (typeof onWrongAnswer === "function") {
      onWrongAnswer();
    }
  };

  const handleReset = () => {
    setSelected([]);
    setSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div className="orderWords-container">
      <h3>{data.question}</h3>

      <div className="options">
        {data.options.map((word, index) => (
          <button
            style={{ fontFamily: "inherit" }}
            className="option"
            key={index}
            onClick={() => handleSelect(word)}
            disabled={selected.includes(word) || submitted}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="selected">
        {selected.map((word, idx) => (
          <span
            key={idx}
            className="selected-word"
            style={{
              cursor: "pointer",
              userSelect: "none",
              backgroundColor: submitted
                ? isCorrect
                  ? "green"
                  : "red"
                : "#009fd9",
            }}
            onClick={() => handleDeselect(word)}
            title="Нажмите, чтобы убрать"
          >
            {word}{" "}
          </span>
        ))}
      </div>

      {!submitted && (
        <button
          className="button-check"
          onClick={handleSubmit}
          disabled={selected.length === 0}
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
