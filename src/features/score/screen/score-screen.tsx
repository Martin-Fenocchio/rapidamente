import Logo from "src/assets/images/menterapida.svg";
import { HistoryGrid } from "../components/grid/history-grid";
import "src/assets/style/score-screen.scss";
import "src/assets/style/ticket.scss";
import Ticket from "../components/ticket/ticket";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { calculateWeeks } from "src/utils/date-utils";
import ShareResultsButton from "../components/share/share-results-button";

function ScoreScreen() {
  const location = useLocation();
  const [weeks, setWeeks] = useState<(string | null)[][]>([]);

  const points = location.state?.points ?? 0;

  const handleResetGame = () => {
    if (import.meta.env.DEV) {
      localStorage.removeItem("points");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    setWeeks(calculateWeeks());
  }, []);

  return (
    <main className="score-screen">
      <img src={Logo} className="logo" onClick={handleResetGame} />

      <Ticket points={points} />

      <h4>Tu ranking mensual:</h4>
      <HistoryGrid weeks={weeks} />

      <p className="desc-grid">
        Vuelve <span>mañana</span> para completar tu proximo cuadrado!
      </p>

      <ShareResultsButton points={points} />
    </main>
  );
}

export default ScoreScreen;
