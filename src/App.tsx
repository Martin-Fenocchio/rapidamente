import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "animate.css";
import OnboardingScreen from "./features/onboarding/screen/onboarding-screen";
import GameScreen from "./features/game/screen/game-screen";
import ScoreScreen from "./features/score/screen/score-screen";
import PlayersScreen from "src/features/players/screen/players-screen";
import axios from "axios";
import { getSumOfPoints } from "./utils/points/points-utils";

export const API_URL = "https://mog81hbjjf.execute-api.sa-east-1.amazonaws.com";

function App() {
  const handleSaveName = async (name: string) => {
    const response = await axios.post(`${API_URL}/users`, {
      name: name,
      points: getSumOfPoints(),
    });
    localStorage.setItem("userID", response.data._id);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<OnboardingScreen onSaveName={handleSaveName} />}
        />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/score" element={<ScoreScreen />} />
        <Route path="/players" element={<PlayersScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
