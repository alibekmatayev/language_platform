// exercises.api.js
import API from "./api";

export const submitTestResults = async ({ lessonCode, answers }) => {
  const response = await API.post("/api/results", {
    lessonCode,
    answers,
  });
  return response.data;
};

export const fetchExercisesByLessonCode = async (code) => {
  const response = await API.get(`/data/lesson`, {
    params: { code },
  });
  const data = response.data;

  // Если data или data.exercises нет, но data есть — вернём null
  if (!data || (!Array.isArray(data.exercises) && data.exercises !== null)) {
    throw new Error("Упражнения не найдены или в неверном формате");
  }

  return data.exercises; // может быть массив или null
};

// Остальные функции (уже есть или можешь добавить):
export const getExercise = (code) => API.get(`/exercises/${code}`);
export const createExercise = (data) => API.post(`/exercises`, data);
export const updateExercise = (code, data) =>
  API.patch(`/exercises/${code}`, data);
export const deleteExercise = (code) => API.delete(`/exercises/${code}`);
