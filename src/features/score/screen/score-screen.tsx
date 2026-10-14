import { assetUrl } from "src/lib/assets";
const Logo = assetUrl("menterapida.svg");
import { HistoryGrid } from "../components/grid/history-grid";
import "src/assets/style/score-screen.scss";
import "src/assets/style/ticket.scss";
import Ticket from "../components/ticket/ticket";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateWeeks } from "src/utils/date-utils";
import ShareResultsButton from "../components/share/share-results-button";
import Confetti from "react-confetti";
import BarsGraph from "../components/bars/bars-graph";
import { syncPendingScore } from "src/lib/score-sync";
import {
  getScoreOfToday,
} from "src/utils/points/points-utils";
const StarIcon = assetUrl("star.svg");
import Particles from "src/components/blocks/Backgrounds/Particles/Particles";
import ShinyText from "src/components/shinyText/shinyText";
import { getStreak } from "src/utils/streak/streak";

function ScoreScreen() {
  const [weeks, setWeeks] = useState<(string | null)[][]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [points, settodayPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleResetGame = () => {
    if (process.env.NODE_ENV === "development") {
      localStorage.removeItem("points");
      window.location.href = "/";
    }
  };

  const [saveError, setSaveError] = useState(false);
  const handleSavePoints = () => {
    setSaveError(false);
    void syncPendingScore().catch(() => setSaveError(true));
  };

  useEffect(() => {
    setWeeks(calculateWeeks());
    settodayPoints(getScoreOfToday()?.pointsOfDay ?? 0);
    setStreak(getStreak());
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
        {saveError && <div role="alert">Tu resultado está guardado en este dispositivo. No se pudo sincronizar. <button onClick={handleSavePoints}>Reintentar</button></div>}

        <h4>Tu ranking mensual:</h4>
        <HistoryGrid weeks={weeks} />

        <ShinyText text={`Racha diaría: ${streak} 🔥`} />

        <p className="desc-grid">
          Volvé <span>mañana</span> para completar tu proximo cuadrado!
        </p>

        <ShareResultsButton points={points} />
        <Link href="/players">
          <img src={StarIcon} />
          Ver puntajes de jugadores
        </Link>

        <BarsGraph />
      </main>
    </>
  );
}

export default ScoreScreen;
