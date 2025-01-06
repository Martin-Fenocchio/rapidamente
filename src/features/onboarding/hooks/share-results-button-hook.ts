import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useShareResultsHook = () => {
  const [message, setSetMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (message.length === 0) return;
    const button: any = document.getElementsByClassName(
      "react-share__ShareButton"
    )[0];
    button.click();
  }, [message]);

  return { message, setSetMessage, location };
};
