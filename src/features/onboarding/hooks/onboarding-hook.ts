import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkVavePlayedToday,
  getMaxPointsOfDay,
} from "src/utils/points/points-utils";

export const useOnboardingLogic = () => {
  const navigate = useNavigate();

  const [showAnimation, setShowAnimation] = useState(false);
  const [historicalRecord, setHistoricalRecord] = useState(0);
  const [havePlayedToday, setHavePlayedToday] = useState(false);

  const handleStartGame = () => {
    setShowAnimation(true);

    setTimeout(() => {
      navigate("/game");
    }, 800);
  };

  useEffect(() => {
    setHistoricalRecord(getMaxPointsOfDay());
    setHavePlayedToday(checkVavePlayedToday());
  }, []);

  return {
    showAnimation,
    historicalRecord,
    havePlayedToday,
    handleStartGame,
  };
};
