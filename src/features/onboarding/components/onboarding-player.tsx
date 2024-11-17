interface Props {
  showAnimation: boolean;
  handleStartGame: () => void;
  historicalRecord: number;
}

function OnboardingPlayer({
  showAnimation,
  handleStartGame,
  historicalRecord
}: Props) {
  return (
    <>
      <h3 className="onboaring-player">
        Entrena tu mente y compite con otros en <span>simples</span> pero{" "}
        <span>rápidas</span> cuentas matemáticas.{" "}
      </h3>

      <button onClick={handleStartGame}>Comenzar</button>
      <p className="score">
        Tu récord: {historicalRecord} punto{historicalRecord == 1 ? "" : "s"}
      </p>

      {showAnimation && (
        <div
          className="circle-animation"
          transition-style="in:circle:center"
        ></div>
      )}
    </>
  );
}

export default OnboardingPlayer;
