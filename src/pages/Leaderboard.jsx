import React, { useEffect, useState } from "react";
import { getXpLeaderboard } from "../api/xp.api";
import LeaderboardItem from "../components/progress/LeaderboardItem";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getXpLeaderboard();
        setLeaders(data.leaders || []);
      } catch (error) {
        console.error("Ошибка при загрузке рейтинга:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="modules-page__loading">Загрузка...</div>;

  return (
    <div className="leaderboard-wrapper">
      <h2 className="leaderboard-title">Таблица лидеров</h2>
      <div className="leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Имя</th>
              <th>⭐</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader) => (
              <LeaderboardItem
                key={leader.user_id}
                rank={leader.rank}
                username={leader.username}
                xp={leader.xp}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
