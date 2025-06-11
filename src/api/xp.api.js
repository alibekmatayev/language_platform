import API from "./api";

export const getXpLeaderboard = async () => {
  try {
    const response = await API.get("/data/xp-leaderboard");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении таблицы лидеров:", error);
    throw error;
  }
};
