import "src/assets/style/players.scss";
import Logo from "src/assets/images/menterapida.svg";
import { usePlayers } from "../hooks/usePlayers";
import Hyperspeed from "src/components/background/hyperspeedBackground";
import PodiumSkeleton from "src/components/podium/PodiumSkeleton";

function PlayersScreen() {
  const { players, isLoading } = usePlayers();

  return (
    <main className="players-screen">
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
      <img src={Logo} className="logo" />

      <div className="players-list ranking">
        {isLoading ? (
          <PodiumSkeleton amount={30} />
        ) : (
          <>
            <article>
              <p>Jugador</p>
              <p>Puntos</p>
            </article>
            {players.map((player, index) => {
              return (
                <article
                  className={`ranking-row ${index === 0 && "current"} ${
                    index == 1 && "next"
                  }`}
                >
                  <p className="position">
                    {index + 1}°{"  "} {player.name}
                  </p>
                  <p className="points">{player.points}</p>
                </article>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}

export default PlayersScreen;
