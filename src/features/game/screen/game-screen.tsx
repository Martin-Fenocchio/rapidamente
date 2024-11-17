import { useEffect, useState } from "react";
import Countdown from "../components/countdown/countdown";
import Calculation from "../components/calculation/calculation";
import Logo from "src/assets/images/menterapida.svg";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
import { OPERATIONS as OperationsList } from "../data/operations";
import { savePointsOfDay } from "src/utils/points/points-utils";
import { setStateAsync } from "src/utils/misc/misc";

export const GAME_TIME = 2.5;

function GameScreen() {
  const navigate = useNavigate();

  const [operationIndex, setOperationIndex] = useState<number>(0);
  const [operations, setOperations] = useState(OperationsList[0]);
  const [countdown, setCountdown] = useState(GAME_TIME);

  const [haveFinishedCountdown, setHaveFinishedCountdown] = useState(false);

  const onAnswer = (isCorrect: boolean) => {
    const wasLastOperation = operationIndex === OperationsList.length - 1;

    if (!isCorrect || wasLastOperation) {
      onFinishGmae(isCorrect);

      return;
    }

    setCountdown(GAME_TIME);
    setOperationIndex((prevIndex: number) => {
      return prevIndex + 1;
    });
  };

  const onFinishGmae = async (isCorrect: boolean) => {
    const pointsMade =
      (await setStateAsync(setOperationIndex)) + (isCorrect ? 1 : 0);

    savePointsOfDay(pointsMade);

    setTimeout(() => {
      navigate("/score", {
        state: {
          points: pointsMade
        },
        replace: true
      });
    }, 2000);
  };

  const calculatePercentage = (countdown: number | null) => {
    if (countdown === null) return 0;
    return (countdown / GAME_TIME) * 100;
  };

  useEffect(() => {
    setOperations(OperationsList[Math.floor(Math.random() * 10)]);
  }, []);

  const percentage = calculatePercentage(countdown);

  return (
    <>
      <div
        className="circle-animation"
        transition-style="out:circle:center"
      ></div>
      <main className="game-screen">
        <img src={Logo} className="logo" />

        {!haveFinishedCountdown ? (
          <Countdown onFinishCountdown={() => setHaveFinishedCountdown(true)} />
        ) : (
          <>
            <ProgressBar completed={percentage < 0 ? 0 : percentage} />
            <Calculation
              onAnswer={onAnswer}
              setCountdown={setCountdown}
              operation={operations[operationIndex]}
              operationIndex={operationIndex}
              timeIsOver={countdown <= -1}
            />
          </>
        )}
      </main>
    </>
  );
}

export default GameScreen;
