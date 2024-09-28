import { createBrowserRouter } from "react-router-dom";
import GameScreen from "src/features/game/screen/game-screen";
import OnboardingScreen from "src/features/onboarding/screen/onboarding-screen";
import ScoreScreen from "src/features/score/screen/score-screen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingScreen />
  },
  {
    path: "/game",
    element: <GameScreen />
  },
  {
    path: "/score",
    element: <ScoreScreen />
  }
]);
