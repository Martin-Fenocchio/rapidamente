import { useEffect, useState } from "react";
import ShareResultsButton from "src/features/score/components/share/share-results-button";
import Ticket from "src/features/score/components/ticket/ticket";
import { getScoreOfToday } from "src/utils/points/points-utils";

function HavePlayedBlocker() {
  const [pointsOfDay, setPointsOfDay] = useState(0);
  const [timeOfToday, setTimeOfToday] = useState(0);

  const resetGame = () => {
    if (import.meta.env.DEV) {
      localStorage.removeItem("points");
      window.location.reload();
    }
  };

  useEffect(() => {
    const score = getScoreOfToday();
    setPointsOfDay(score?.pointsOfDay ?? 0);
    setTimeOfToday(score?.time ?? 0);
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

      <ShareResultsButton points={pointsOfDay} time={timeOfToday} />
    </>
  );
}

export default HavePlayedBlocker;
