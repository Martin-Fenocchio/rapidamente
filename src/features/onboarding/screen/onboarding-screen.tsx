import Logo from "src/assets/images/menterapida.svg";
import "src/assets/style/onboarding.scss";
import "transition-style";
import OnboardingPlayer from "../components/onboarding-player";
import HavePlayedBlocker from "../components/have-played-blocker";
import Marquee from "react-fast-marquee";
import { useOnboardingLogic } from "../hooks/onboarding-hook";
import "react-responsive-modal/styles.css";
import ModalAskName from "../components/modal-ask-name";

interface Props {
  onSaveName: (name: string) => void;
}

function OnboardingScreen(props: Props) {
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

      <ModalAskName {...props} />
    </>
  );
}

export default OnboardingScreen;
