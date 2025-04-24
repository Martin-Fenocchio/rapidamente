import Logo from "src/assets/images/menterapida.svg";
import "src/assets/style/onboarding.scss";
import "transition-style";
import OnboardingPlayer from "../components/onboarding-player";
import HavePlayedBlocker from "../components/have-played-blocker";
import Marquee from "react-fast-marquee";
import { useOnboardingLogic } from "../hooks/onboarding-hook";
import "react-responsive-modal/styles.css";
import ModalAskName from "../components/modal-ask-name";
import Hyperspeed from "src/components/background/hyperspeedBackground";
import ModalSignIn from "src/components/google/ModalSignIn";
import Podium from "src/components/podium/Podium";

interface Props {
  onSaveName: (name: string) => void;
}

function OnboardingScreen(props: Props) {
  const {
    showAnimation,
    historicalRecord,
    havePlayedToday,
    handleStartGame,
    showModalSignIn,
    setShowModalSignIn,
  } = useOnboardingLogic();

  return (
    <>
      <Hyperspeed
        effectOptions={{
          colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0xffffff,
            brokenLines: 0xffffff,
            leftCars: [0x274690, 0xf6af65, 0x5bc8af],
            rightCars: [0x274690, 0xf6af65, 0x35bc8af],
            sticks: 0x5bc8af,
          },
        }}
      />

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
              historicalRecord,
              havePlayedToday,
              handleStartGame,
            }}
          />
        )}

        <Podium />

        {showAnimation && (
          <div
            className="circle-animation"
            transition-style="in:circle:center"
          ></div>
        )}
      </main>

      <ModalAskName {...props} />
      {showModalSignIn && (
        <ModalSignIn controlVisibility={setShowModalSignIn} />
      )}
    </>
  );
}

export default OnboardingScreen;
