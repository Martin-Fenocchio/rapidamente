import { useCallback } from "react";

type GameEndData = {
  score: number;
  duration: number;
  isCorrect: boolean;
  operation: string;
};

export function useAnalytics() {
  const sendEvent = useCallback(
    (eventName: string, eventParams: Record<string, any> = {}) => {
      try {
        const gtag = (window as any).gtag;

        console.log("gtag", gtag);

        if (typeof window !== "undefined" && typeof gtag === "function") {
          gtag("event", eventName, eventParams);
        } else {
          console.warn("gtag no está disponible");
        }
      } catch (error) {
        //
      }
    },
    []
  );

  const trackGameStart = useCallback(() => {
    try {
      sendEvent("game_start", {
        timestamp: Date.now(),
      });
    } catch (error) {
      //
    }
  }, [sendEvent]);

  const trackGameEnd = useCallback(
    ({ score, duration, isCorrect, operation }: GameEndData) => {
      sendEvent("game_end", {
        score,
        duration,
        isCorrect,
        operation,
        timestamp: Date.now(),
      });
    },
    [sendEvent]
  );

  return {
    trackGameStart,
    trackGameEnd,
  };
}
