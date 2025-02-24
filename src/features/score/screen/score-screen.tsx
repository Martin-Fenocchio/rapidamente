import Logo from "src/assets/images/menterapida.svg";
import { HistoryGrid } from "../components/grid/history-grid";
import "src/assets/style/score-screen.scss";
import "src/assets/style/ticket.scss";
import Ticket from "../components/ticket/ticket";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { calculateWeeks } from "src/utils/date-utils";
import ShareResultsButton from "../components/share/share-results-button";
import Confetti from "react-confetti";
import BarsGraph from "../components/bars/bars-graph";
import axios from "axios";
import { getScoreOfToday, getSumOfPoints } from "src/utils/points/points-utils";
import StarIcon from "src/assets/images/star.svg";
import { API_URL } from "src/App";
import Particles from "src/components/blocks/Backgrounds/Particles/Particles";

function ScoreScreen() {
  const [weeks, setWeeks] = useState<(string | null)[][]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [points, settodayPoints] = useState(0);

  const handleResetGame = () => {
    if (import.meta.env.DEV) {
      localStorage.removeItem("points");
      window.location.href = "/";
    }
  };

  const handleSavePoints = () => {
    try {
      axios.put(`${API_URL}/users/update-points`, {
        id: localStorage.getItem("userID"),
        points: getSumOfPoints(),
      });
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    setWeeks(calculateWeeks());
    settodayPoints(getScoreOfToday()?.pointsOfDay ?? 0);
    handleSavePoints();
  }, []);

  useEffect(() => {
    if (points == 10) {
      setShowConfetti(true);
    }
  }, [points]);

  return (
    <>
      <Particles
        particleColors={["#5bc8af", "#f6af65"]}
        particleCount={300}
        particleSpread={5}
        speed={0.1}
        particleBaseSize={30}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      <main className="score-screen">
        {showConfetti && <Confetti />}
        <img src={Logo} className="logo" onClick={handleResetGame} />
        <Ticket points={points} />

        <h4>Tu ranking mensual:</h4>
        <HistoryGrid weeks={weeks} />

        <p className="desc-grid">
          Volvé <span>mañana</span> para completar tu proximo cuadrado!
        </p>

        <ShareResultsButton points={points} />
        <Link to="/players">
          <img src={StarIcon} />
          Ver puntajes de jugadores
        </Link>

        <BarsGraph />
      </main>
    </>
  );
}

export default ScoreScreen;
