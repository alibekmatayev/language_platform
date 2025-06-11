import API from "./api";

export const getAllLessons = () => API.get("/lessons");
export const getLesson = (code) => API.get(`/lessons/${code}`);
export const createLesson = (lessonData) => API.post("/lessons", lessonData);
export const updateLesson = (code, updatedData) =>
  API.patch(`/lessons/${code}`, updatedData);
export const deleteLesson = (code) => API.delete(`/lessons/${code}`);

// Добавление/удаление урока в/из модуля
export const addLessonToModule = (moduleCode, lessonCode) =>
  API.post(`/modules/${moduleCode}/lessons-list/${lessonCode}`);

export const deleteLessonFromModule = (moduleCode, lessonCode) =>
  API.delete(`/modules/${moduleCode}/lessons-list/${lessonCode}`);
