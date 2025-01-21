import { useEffect, useState } from "react";
import { getScoreOfToday } from "src/utils/points/points-utils";

export const useShareResultsHook = () => {
  const [message, setSetMessage] = useState("");
  const [timeOfToday, setTimeOfToday] = useState(0);

  useEffect(() => {
    const score = getScoreOfToday();
    setTimeOfToday(score?.time ?? 0);

    if (message.length === 0) return;

    const button: any = document.getElementsByClassName(
      "react-share__ShareButton"
    )[0];
    button.click();
  }, [message]);

  return { message, setSetMessage, timeOfToday };
};
