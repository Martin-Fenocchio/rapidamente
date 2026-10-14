import { useCallback } from "react";

type GameEndData = {
  score: number;
  duration: number;
  isCorrect: boolean;
  operation: string;
};

export function useAnalytics() {
  const sendEvent = useCallback(
    (eventName: string, eventParams: Record<string, unknown> = {}) => {
      try {
        const gtag = (window as Window & { gtag?: (event: string, name: string, params: Record<string, unknown>) => void }).gtag;

        if (typeof window !== "undefined" && typeof gtag === "function") {
          gtag("event", eventName, eventParams);

        }
      } catch {
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
    } catch {
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
