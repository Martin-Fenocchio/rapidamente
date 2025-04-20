import { usePlayers } from "src/features/players/hooks/usePlayers";
import ShinyText from "../shinyText/shinyText";
import { useEffect, useReducer } from "react";

function Podium() {
  const { isLoading, handleGeneratePodium } = usePlayers();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { morePoints, lessPoints, currentPlayer, secondLessPoints } =
    handleGeneratePodium();

  const reRender = () => {
    forceUpdate();
  };

  useEffect(() => {
    window.addEventListener("pointsUpdated", reRender);

    return () => {
      window.removeEventListener("pointsUpdated", reRender);
    };
  }, []);

  if (isLoading || !currentPlayer) return <></>;

  const rowComponent = (user: any) => {
    if (!user?._id) return <></>;
    return (
      <article className={`ranking-row ${user.classNames}`}>
        <p className="position">
          {user.index}°{"  "} {user.name}
        </p>
        <p className="points">{user.points}</p>
      </article>
    );
  };

  return (
    <div className="ranking">
      <h2 className="title">
        <ShinyText text="Ranking actual" />
      </h2>
      {rowComponent(morePoints)}
      {rowComponent(currentPlayer)}
      {rowComponent(lessPoints)}
      {rowComponent(secondLessPoints)}
    </div>
  );
}

export default Podium;
