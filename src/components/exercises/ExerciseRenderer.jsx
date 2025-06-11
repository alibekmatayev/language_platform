import React from "react";
import MultipleChoice from "./types/MultipleChoice";
import OrderWords from "./types/OrderWords";
import ManualTyping from "./types/ManualTyping";
import MatchPairs from "./types/MatchPairs";

export default function ExerciseRenderer({
  exercise,
  onComplete,
  isLastExercise,
  onWrongAnswer,
}) {
  const commonProps = {
    data: exercise,
    onComplete,
    isLastExercise,
    onWrongAnswer,
  };

  switch (exercise.type) {
    case "multiple_choice":
      return <MultipleChoice {...commonProps} />;
    case "order_words":
      return <OrderWords {...commonProps} />;
    case "manual_typing":
      return <ManualTyping {...commonProps} />;
    case "match_pairs":
      return <MatchPairs {...commonProps} />;
    default:
      return <div>Неизвестный тип упражнения: {exercise.type}</div>;
  }
}
