import { useEffect, useState } from "react";
import Countdown from "../components/countdown/countdown";
import Calculation from "../components/calculation/calculation";
import Logo from "src/assets/images/menterapida.svg";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
import {
  getOperationsOfDay,
  OPERATIONS as OperationsList,
} from "../data/operations";
import { savePointsOfDay } from "src/utils/points/points-utils";
import { setStateAsync } from "src/utils/misc/misc";
import { calculateTime } from "src/utils/date-utils";
import Squares from "src/components/squarredBackground/SquarredBackground";
import { GAME_SHORT_TIME, getGameTime } from "src/utils/game/game-utils";

function GameScreen() {
  const navigate = useNavigate();

  const [operationIndex, setOperationIndex] = useState<number>(0);
  const [operations, setOperations] = useState(OperationsList[0]);
  const [countdown, setCountdown] = useState(GAME_SHORT_TIME);

  const [haveFinishedCountdown, setHaveFinishedCountdown] = useState(false);

  const onAnswer = async (isCorrect: boolean) => {
    const currentIndex = await setStateAsync(setOperationIndex);
    const wasLastOperation = currentIndex === OperationsList.length - 1;

    if (!isCorrect || wasLastOperation) {
      onFinishGmae(isCorrect);

      return;
    }

    setCountdown(getGameTime(currentIndex));
    setOperationIndex((prevIndex: number) => {
      return prevIndex + 1;
    });
  };

  const onFinishGmae = async (isCorrect: boolean) => {
    const pointsMade =
      (await setStateAsync(setOperationIndex)) + (isCorrect ? 1 : 0);
    const time = calculateTime();

    savePointsOfDay(pointsMade, time);

    setTimeout(() => {
      navigate("/score", {
        state: {
          points: pointsMade,
          time: time,
        },
        replace: true,
      });
    }, 2500);
  };

  const calculatePercentage = (countdown: number | null) => {
    if (countdown === null) return 0;
    return (countdown / getGameTime(operationIndex)) * 100;
  };

  useEffect(() => {
    setOperations(getOperationsOfDay() ?? []);
  }, []);

  const percentage = calculatePercentage(countdown);

  return (
    <>
      <div className="squares-container">
        <Squares
          speed={0.5}
          squareSize={30}
          direction="diagonal"
          borderColor="#fff"
          hoverFillColor="#222"
        />
      </div>
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
