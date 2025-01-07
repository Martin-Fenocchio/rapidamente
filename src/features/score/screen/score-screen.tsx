import Logo from "src/assets/images/menterapida.svg";
import { HistoryGrid } from "../components/grid/history-grid";
import "src/assets/style/score-screen.scss";
import "src/assets/style/ticket.scss";
import Ticket from "../components/ticket/ticket";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { calculateWeeks } from "src/utils/date-utils";
import ShareResultsButton from "../components/share/share-results-button";
import Confetti from "react-confetti";
import BarsGraph from "../components/bars/bars-graph";
import axios from "axios";
import { getSumOfPoints } from "src/utils/points/points-utils";
import StarIcon from "src/assets/images/star.svg";
import { API_URL } from "src/App";

function ScoreScreen() {
  const location = useLocation();
  const [weeks, setWeeks] = useState<(string | null)[][]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const points = location.state?.points ?? 0;

  const handleResetGame = () => {
    if (import.meta.env.DEV) {
      localStorage.removeItem("points");
      window.location.href = "/";
    }
  };

  const handleSavePoints = () => {
    axios.put(`${API_URL}/users/update-points`, {
      id: localStorage.getItem("userID"),
      points: getSumOfPoints()
    });
  };

  useEffect(() => {
    handleSavePoints();
    setWeeks(calculateWeeks());

    if (points == 10) {
      setShowConfetti(true);
    }
  }, []);

  return (
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
  );
}

export default ScoreScreen;
