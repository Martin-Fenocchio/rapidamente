import ShareResultsButton from "src/features/score/components/share/share-results-button";
import Ticket from "src/features/score/components/ticket/ticket";
import { useHavePlayedBlocker } from "../hooks/have-played-blocker-hook";
import { useEffect, useState } from "react";
import { getStreak } from "src/utils/streak/streak";
import ShinyText from "src/components/shinyText/shinyText";

function HavePlayedBlocker() {
  const { pointsOfDay } = useHavePlayedBlocker();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  return (
    <>
      <h3 className="have-played-blocker" data-testid="dailly-blocker">
        Ya has jugado hoy! <span>Vuelve mañana</span> para volver a probar tu
        rapidez en <span>#RapidaMente</span>
      </h3>

      <Ticket points={pointsOfDay} />

      <ShinyText text={`Racha diaría: ${streak} 🔥`} />

      <ShareResultsButton points={pointsOfDay} />
    </>
  );
}

export default HavePlayedBlocker;
