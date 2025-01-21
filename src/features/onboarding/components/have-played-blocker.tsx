import ShareResultsButton from "src/features/score/components/share/share-results-button";
import Ticket from "src/features/score/components/ticket/ticket";
import { useHavePlayedBlocker } from "../hooks/have-played-blocker-hook";

function HavePlayedBlocker() {
  const { pointsOfDay, resetGame } = useHavePlayedBlocker();

  return (
    <>
      <h3 className="have-played-blocker" data-testid="dailly-blocker">
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
