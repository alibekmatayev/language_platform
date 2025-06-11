import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserByUsername } from "../api/users.api";
import { getAllAchievements } from "../api/achievements.api";
import { BsFillShieldLockFill } from "react-icons/bs";

const Achievements = () => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, []);

  useEffect(() => {
    if (!username) return;

    const fetchAchievements = async () => {
      try {
        const [userRes, allAchRes] = await Promise.all([
          getUserByUsername(username),
          getAllAchievements(),
        ]);
        setUserAchievements(userRes.data.progress.achievements || []);
        setAllAchievements(allAchRes.data || []);
      } catch (err) {
        console.error("Ошибка при загрузке достижений:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [username]);

  const getUserAch = (name) =>
    userAchievements.find((a) => a.ach_name === name);

  const getLevelCategory = (index, total) => {
    const part = Math.ceil(total / 3);
    if (index < part) return "bronze";
    if (index < part * 2) return "silver";
    return "gold";
  };

  if (loading) return <div className="achievements-loading">Загрузка...</div>;

  return (
    <div className="achievements-container">
      <h1 className="achievements-title">Достижения</h1>
      <div className="achievements-list">
        {allAchievements.map((ach) => {
          const userAch = getUserAch(ach.name);
          const lvl = userAch?.lvl || 0;

          return (
            <div key={ach.id} className="achievement-card">
              <h2 className="achievement-name">{ach.name}</h2>
              <div className="achievement-grid">
                {ach.levels.map((level, idx) => {
                  const category = getLevelCategory(idx, ach.levels.length);
                  const unlocked = lvl >= level.level + 1;

                  return (
                    <div key={level.level} className="achievement-cell">
                      <div
                        className={`shield-wrapper ${category} ${
                          unlocked ? "unlocked" : "locked"
                        }`}
                      >
                        <BsFillShieldLockFill className="shield-icon" />
                      </div>
                      <p className="level-desc">{level.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
