import { useCallback, useEffect, useRef, useState } from "react";
import Countdown from "../components/countdown/countdown";
import Calculation from "../components/calculation/calculation";
import { assetUrl } from "src/lib/assets";
import ProgressBar from "@ramonak/react-progress-bar";
import { useRouter } from "next/navigation";
import { getOperationsOfDay } from "../data/operations";
import { checkVavePlayedToday, savePointsOfDay } from "src/utils/points/points-utils";
import { calculateTime } from "src/utils/date-utils";
import Squares from "src/components/squarredBackground/SquarredBackground";
import { GAME_SHORT_TIME, getGameTime } from "src/utils/game/game-utils";
import { useAnalytics } from "src/hooks/useAnalytics";
import { queueScore } from "src/lib/score-sync";

function GameScreen() {
  const router = useRouter();
  const { trackGameEnd } = useAnalytics();
  const [operationIndex, setOperationIndex] = useState(0);
  const [operations] = useState(getOperationsOfDay);
  const [countdown, setCountdown] = useState(GAME_SHORT_TIME);
  const [haveFinishedCountdown, setHaveFinishedCountdown] = useState(false);
  const finished = useRef(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (checkVavePlayedToday()) router.replace("/score");
    return () => { if (navigationTimer.current) clearTimeout(navigationTimer.current); };
  }, [router]);

  const onAnswer = useCallback((isCorrect: boolean) => {
    if (finished.current) return;
    if (isCorrect && operationIndex < operations.length - 1) {
      setOperationIndex(operationIndex + 1);
      return;
    }
    finished.current = true;
    const points = operationIndex + (isCorrect ? 1 : 0);
    const time = calculateTime();
    savePointsOfDay(points, time);
    queueScore();
    trackGameEnd({ score: points, duration: time, operation: operations[operationIndex].operation, isCorrect });
    navigationTimer.current = setTimeout(() => router.replace("/score"), 2500);
  }, [operationIndex, operations, router, trackGameEnd]);

  const startQuestions = useCallback(() => setHaveFinishedCountdown(true), []);
  const percentage = Math.max(0, countdown / getGameTime(operationIndex) * 100);
  return <>
    <div className="squares-container"><Squares speed={0.5} squareSize={30} direction="diagonal" borderColor="#fff" hoverFillColor="#222" /></div>
    <div className="circle-animation" transition-style="out:circle:center" />
    <main className="game-screen">
      <img src={assetUrl("menterapida.svg")} className="logo" alt="RápidaMente" />
      {!haveFinishedCountdown ? <Countdown onFinishCountdown={startQuestions} /> : <>
        <ProgressBar completed={percentage} />
        <Calculation key={operationIndex} operation={operations[operationIndex]} operationIndex={operationIndex} onAnswer={onAnswer} setCountdown={setCountdown} />
      </>}
    </main>
  </>;
}
export default GameScreen;
