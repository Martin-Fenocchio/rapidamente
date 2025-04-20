interface Props {
  showAnimation: boolean;
  handleStartGame: () => void;
  historicalRecord: number;
  streak: number;
}

function OnboardingPlayer({ showAnimation, handleStartGame }: Props) {
  return (
    <>
      <h3 className="onboaring-player">
        Entrena tu mente y compite con otros en <span>simples</span> pero{" "}
        <span>rápidas</span> cuentas matemáticas.{" "}
      </h3>

      <button onClick={handleStartGame}>Comenzar</button>

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
