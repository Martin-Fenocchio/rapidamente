import Logo from "src/assets/images/menterapida.svg";
import "src/assets/style/onboarding.scss";
import "transition-style";
import OnboardingPlayer from "../components/onboarding-player";
import HavePlayedBlocker from "../components/have-played-blocker";
import Marquee from "react-fast-marquee";
import { useOnboardingLogic } from "../hooks/onboarding-hook";

function OnboardingScreen() {
  const { showAnimation, historicalRecord, havePlayedToday, handleStartGame } =
    useOnboardingLogic();

  return (
    <>
      <div style={{ opacity: showAnimation ? 0 : 1 }}>
        <Marquee>
          ≠ ≤ 3√a ∑ |x-y| % Π φ ∫∫≠ ≤ 3√a ∑ |x-y| % Π φ ∫∫≠ ≤ 3√a ∑ |x-y| % Π φ
          ∫∫≠ ≤ 3√a ∑ |x-y| % Π φ ∫∫≠ ≤ 3√a ∑ |x-y| % Π φ ∫∫≠ ≤ 3√a ∑ |x-y| % Π
          φ ∫∫≠ ≤ 3√a ∑ |x-y| % Π φ
        </Marquee>
      </div>
      <main className="onboarding-screen">
        <img src={Logo} className="logo" />

        {havePlayedToday ? (
          <HavePlayedBlocker />
        ) : (
          <OnboardingPlayer
            {...{
              showAnimation,
              historicalRecord,
              havePlayedToday,
              handleStartGame,
            }}
          />
        )}
      </main>
    </>
  );
}

export default OnboardingScreen;
