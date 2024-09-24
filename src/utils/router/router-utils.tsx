import { createBrowserRouter } from "react-router-dom";
import OnboardingScreen from "src/features/onboarding/screen/onboarding-screen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingScreen />
  }
]);
