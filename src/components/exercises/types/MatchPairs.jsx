import React, { useState, useEffect } from "react";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function MatchPairs({
  data,
  onComplete,
  isLastExercise,
  onWrongAnswer,
}) {
  const { question, pairs } = data;

  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});
  const [shuffledMatches, setShuffledMatches] = useState([]);
  const [wrongPair, setWrongPair] = useState(null);

  useEffect(() => {
    setShuffledMatches(shuffleArray(pairs.map(({ match }) => match)));
  }, [data]);

  const handleTermClick = (term) => {
    if (matchedPairs[term]) return;
    setSelectedTerm(term);
  };

  const handleMatchClick = (match) => {
    if (!selectedTerm) return;

    const alreadyMatched = Object.values(matchedPairs).some(
      (v) => v.match === match
    );
    if (alreadyMatched) return;

    const correctMatch = pairs.find((p) => p.term === selectedTerm)?.match;
    const isCorrect = correctMatch === match;

    if (isCorrect) {
      setMatchedPairs((prev) => ({
        ...prev,
        [selectedTerm]: { match, correct: true },
      }));
      setSelectedTerm(null);
    } else {
      setWrongPair({ term: selectedTerm, match });
      if (typeof onWrongAnswer === "function") {
        onWrongAnswer(); // 👈 вычитаем жизнь
      }
      setTimeout(() => {
        setWrongPair(null);
        setSelectedTerm(null);
      }, 500);
    }
  };

  const isAllCorrect = () => {
    return pairs.every(
      ({ term, match }) => matchedPairs[term]?.match === match
    );
  };

  return (
    <div className="matchpairs-wrapper">
      <h2>{question}</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Слова</h3>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {pairs.map(({ term }) => {
              const matchInfo = matchedPairs[term];
              const isWrongTerm = wrongPair?.term === term;

              return (
                <li
                  key={term}
                  onClick={() => handleTermClick(term)}
                  style={{
                    cursor: "pointer",
                    fontWeight: selectedTerm === term ? "bold" : "normal",
                    backgroundColor: matchInfo?.correct
                      ? "#28a745"
                      : isWrongTerm
                      ? "#dc3545"
                      : selectedTerm,
                    opacity: matchInfo ? 0.5 : 1,
                    userSelect: "none",
                    margin: "1rem",
                    border: "1px solid",
                    padding: "1rem",
                    borderColor: "#e1e1e18b",
                    borderRadius: "15px",
                    color: "white",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {term}
                </li>
              );
            })}
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Переводы</h3>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {shuffledMatches.map((match) => {
              const termWithMatch = Object.entries(matchedPairs).find(
                ([_, value]) => value.match === match
              );
              const isCorrect = termWithMatch?.[1]?.correct;
              const isWrongMatch = wrongPair?.match === match;

              return (
                <li
                  key={match}
                  onClick={() => handleMatchClick(match)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: isCorrect
                      ? "#28a745"
                      : isWrongMatch
                      ? "#dc3545"
                      : "inherit",
                    opacity: isCorrect !== undefined ? 0.5 : 1,
                    userSelect: "none",
                    margin: "1rem",
                    border: "1px solid",
                    padding: "1rem",
                    borderColor: "#e1e1e18b",
                    borderRadius: "15px",
                    color: "white",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {match}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {isAllCorrect() && (
          <button className="button-check" onClick={() => onComplete(true)}>
            {isLastExercise ? "Завершить" : "Далее"}
          </button>
        )}
      </div>
    </div>
  );
}
