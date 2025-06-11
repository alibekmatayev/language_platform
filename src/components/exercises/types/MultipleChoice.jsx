import React, { useState } from "react";

export default function MultipleChoice({
  data,
  onComplete,
  isLastExercise,
  onWrongAnswer,
}) {
  const { question, options, correct_answer, explanation = "" } = data;

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSelect = (opt) => {
    if (submitted) return;

    const correct = opt === correct_answer;
    setSelected(opt);
    setIsCorrect(correct);
    setSubmitted(true);

    if (!correct) {
      if (typeof onWrongAnswer === "function") {
        onWrongAnswer();
      }

      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setSelected(null);
        setSubmitted(false);
        setIsCorrect(false);
      }, 500);
    }
  };

  return (
    <div className="multiple-choice">
      <h3>{question}</h3>
      <div className="options-div">
        <ul className="options-list">
          {options.map((opt, i) => {
            const isSelected = selected === opt;
            const showCorrect =
              submitted && isCorrect && opt === correct_answer;
            const isWrong = showError && selected === opt;

            return (
              <li
                key={i}
                className={`option ${
                  showCorrect ? "correct" : isWrong ? "incorrect" : ""
                } ${isSelected ? "selectedd" : ""}`}
                onClick={() => handleSelect(opt)}
                style={{
                  cursor: submitted ? "default" : "pointer",
                  userSelect: "none",
                }}
              >
                {opt}
              </li>
            );
          })}
        </ul>
      </div>

      {submitted && isCorrect && (
        <div className="result correct" style={{ marginTop: "16px" }}>
          <div className="result-buttons">
            <button className="button-check" onClick={() => onComplete(true)}>
              {isLastExercise ? "Завершить" : "Далее"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
