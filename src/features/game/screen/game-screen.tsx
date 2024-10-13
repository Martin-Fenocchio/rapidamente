import { useEffect, useState } from "react";
import Countdown from "../components/countdown/countdown";
import Calculation from "../components/calculation/calculation";
import Logo from "src/assets/images/menterapida.svg";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
import { OPERATIONS as OperationsList } from "../data/operations";
import { savePointsOfDay } from "src/utils/points/points-utils";
import { setStateAsync } from "src/utils/misc/misc";

function GameScreen() {
  const navigate = useNavigate();

  const [operationIndex, setOperationIndex] = useState(0);
  const [operations, setOperations] = useState(OperationsList[0]);
  const [countdown, setCountdown] = useState(3);

  const [haveFinishedCountdown, setHaveFinishedCountdown] = useState(false);

  const onAnswer = (isCorrect: boolean) => {
    const wasLastOperation = operationIndex === OperationsList.length - 1;

    if (!isCorrect || wasLastOperation) {
      onFinishGmae();

      return;
    }

    setCountdown(3);
    setOperationIndex((prevIndex) => prevIndex + 1);
  };

  const onFinishGmae = async () => {
    const pointsMade = (await setStateAsync(setOperationIndex)) + 1;

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
    return (countdown / 3) * 100;
  };

  useEffect(() => {
    setOperations(OperationsList[Math.floor(Math.random() * 10)]);
  }, []);

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
            <ProgressBar completed={calculatePercentage(countdown)} />
            <Calculation
              onAnswer={onAnswer}
              setCountdown={setCountdown}
              operation={operations[operationIndex]}
              operationIndex={operationIndex}
              timeIsOver={countdown < 0}
            />
          </>
        )}
      </main>
    </>
  );
}

export default GameScreen;
