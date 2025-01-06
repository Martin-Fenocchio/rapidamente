import { useEffect, useState } from "react";
import { getScoreOfToday } from "src/utils/points/points-utils";

export const useHavePlayedBlocker = () => {
  const [pointsOfDay, setPointsOfDay] = useState(0);
  const [timeOfToday, setTimeOfToday] = useState(0);

  const resetGame = () => {
    if (import.meta.env.DEV) {
      localStorage.removeItem("points");
      window.location.reload();
    }
  };

  useEffect(() => {
    const score = getScoreOfToday();
    setPointsOfDay(score?.pointsOfDay ?? 0);
    setTimeOfToday(score?.time ?? 0);
  }, []);

  return {
    pointsOfDay,
    timeOfToday,
    resetGame,
  };
};
