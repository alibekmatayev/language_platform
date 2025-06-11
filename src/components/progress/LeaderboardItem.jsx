import React from "react";

const LeaderboardItem = ({ rank, username, xp }) => {
  return (
    <tr className="">
      <td className="">{rank}</td>
      <td className="">{username}</td>
      <td className="">{xp}</td>
    </tr>
  );
};

export default LeaderboardItem;
