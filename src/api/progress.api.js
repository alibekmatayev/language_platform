import API from "./api";

export const updateProgress = async (progressData) => {
  try {
    const response = await API.patch("/progress", progressData);
    return response.data;
  } catch (error) {
    console.error("Failed to update progress:", error);
    throw error;
  }
};
