interface Props {
  handleStartGame: () => void;
  historicalRecord: number;
  streak: number;
}

function OnboardingPlayer({ handleStartGame }: Props) {
  return (
    <>
      <h3 className="onboaring-player">
        Entrena tu mente y compite con otros en <span>simples</span> pero{" "}
        <span>rápidas</span> cuentas matemáticas.{" "}
      </h3>

      <button onClick={handleStartGame} className="start-button">
        Comenzar
      </button>
    </>
  );
}

export default OnboardingPlayer;
