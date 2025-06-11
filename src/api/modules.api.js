// src/api/modules.api.js
import API from "./api";

export const fetchModules = async () => {
  try {
    const response = await API.get("/modules");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to get all modules:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchModulesUsers = async () => {
  try {
    const response = await API.get("data/modules");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to get all modules:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchModule = async (code) => {
  const res = await API.get(`/modules/${code}`);
  return res.data;
};

export const createModule = async (moduleData) => {
  try {
    const response = await API.post("/modules", moduleData);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create module:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateModule = async (code, updateData) => {
  try {
    const response = await API.patch(`/modules/${code}`, updateData);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to update module:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteModule = async (code) => {
  const res = await API.delete(`/modules/${code}`);
  return res.data;
};

export const addLessonToModule = async (moduleCode, lessonCode) => {
  const res = await API.post(
    `/modules/${moduleCode}/lessons-list/${lessonCode}`
  );
  return res.data;
};

export const removeLessonFromModule = async (moduleCode, lessonCode) => {
  const res = await API.delete(
    `/modules/${moduleCode}/lessons-list/${lessonCode}`
  );
  return res.data;
};
