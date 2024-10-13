import { useEffect, useState } from "react";
import ShareResultsButton from "src/features/score/components/share/share-results-button";
import Ticket from "src/features/score/components/ticket/ticket";
import { getPointsOfToday } from "src/utils/points/points-utils";

function HavePlayedBlocker() {
  const [pointsOfDay, setPointsOfDay] = useState(0);

  const resetGame = () => {
    if (import.meta.env.DEV) {
      localStorage.removeItem("points");
      window.location.reload();
    }
  };

  useEffect(() => {
    setPointsOfDay(getPointsOfToday());
  }, []);

  return (
    <>
      <h3 className="have-played-blocker">
        Ya has jugado hoy! <span>Vuelve mañana</span> para volver a probar tu
        rapidez en <span>#RapidaMente</span>
      </h3>

      <h3 className="points-of-today" onClick={resetGame}>
        Hoy obtuviste:
      </h3>
      <Ticket points={pointsOfDay} />

      <ShareResultsButton points={pointsOfDay} />
    </>
  );
}

export default HavePlayedBlocker;
