import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "src/assets/images/menterapida.svg";
import "src/assets/style/onboarding.scss";
import {
  checkVavePlayedToday,
  getMaxPointsOfDay
} from "src/utils/points/points-utils";
import "transition-style";
import OnboardingPlayer from "../components/onboarding-player";
import HavePlayedBlocker from "../components/have-played-blocker";
import Marquee from "react-fast-marquee";

function OnboardingScreen() {
  const navigate = useNavigate();

  const [showAnimation, setShowAnimation] = useState(false);
  const [historicalRecord, setHistoricalRecord] = useState(0);
  const [havePlayedToday, setHavePlayedToday] = useState(false);

  const handleStartGame = () => {
    setShowAnimation(true);

    setTimeout(() => {
      navigate("/game");
    }, 800);
  };

  useEffect(() => {
    setHistoricalRecord(getMaxPointsOfDay());
    setHavePlayedToday(checkVavePlayedToday());
  }, []);

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
              handleStartGame
            }}
          />
        )}
      </main>
    </>
  );
}

export default OnboardingScreen;
