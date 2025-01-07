import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "animate.css";
import OnboardingScreen from "./features/onboarding/screen/onboarding-screen";
import GameScreen from "./features/game/screen/game-screen";
import ScoreScreen from "./features/score/screen/score-screen";
import PlayersScreen from "src/features/players/screen/players-screen";

export const API_URL = "https://rapidamente-backend.onrender.com";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/score" element={<ScoreScreen />} />
        <Route path="/players" element={<PlayersScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
