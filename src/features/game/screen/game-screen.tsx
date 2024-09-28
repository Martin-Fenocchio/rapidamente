import { useState } from "react";
import Countdown from "../components/countdown/countdown";
import Calculation from "../components/calculation/calculation";
import Logo from "src/assets/images/menterapida.svg";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

function GameScreen() {
  const navigate = useNavigate();

  const [intervalId, setintervalId] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const [haveFinishedCountdown, setHaveFinishedCountdown] = useState(false);

  const onStartQuestion = () => {
    setHaveFinishedCountdown(true);

    const newIntervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(newIntervalId);

          setTimeout(() => {
            setCountdown(-1);
            onTimeOver();
          }, 1000);

          return 0;
        }
        return prevCountdown! - 1;
      });
    }, 1000);

    setintervalId(newIntervalId);
  };

  const onFinishGame = () => {
    setTimeout(() => {
      navigate("/score");
    }, 2000);
  };

  const onTimeOver = () => {
    clearInterval(intervalId);
  };

  const calculatePercentage = (countdown: number | null) => {
    if (countdown === null) return 0;
    return (countdown / 3) * 100;
  };

  return (
    <>
      <div
        className="circle-animation"
        transition-style="out:circle:center"
      ></div>
      {countdown}
      <main className="game-screen">
        <img src={Logo} className="logo" />

        {!haveFinishedCountdown ? (
          <Countdown setHaveFinishedCountdown={onStartQuestion} />
        ) : (
          <>
            <ProgressBar completed={calculatePercentage(countdown)} />
            <Calculation onFinish={onFinishGame} timeIsOver={countdown < 0} />
          </>
        )}
      </main>
    </>
  );
}

export default GameScreen;
