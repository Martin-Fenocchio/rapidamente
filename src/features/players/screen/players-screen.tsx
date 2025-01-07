import "src/assets/style/players.scss";
import Logo from "src/assets/images/menterapida.svg";
import { usePlayers } from "../hooks/usePlayers";

function PlayersScreen() {
  const { players, isLoading } = usePlayers();

  return (
    <main className="players-screen">
      <img src={Logo} className="logo" />

      <div className="players-list">
        {isLoading ? (
          <p>Cargando jugadores...</p>
        ) : (
          <article>
            <p>Jugador</p>
            <p>Puntos</p>
          </article>
        )}
        {players.map((player) => {
          return (
            <article>
              <p>{player.name}</p>
              <p>{player.points}</p>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default PlayersScreen;
