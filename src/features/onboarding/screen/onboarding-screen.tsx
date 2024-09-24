import Logo from "src/assets/images/menterapida.svg";
import "src/assets/style/onboarding.scss";

function OnboardingScreen() {
  return (
    <>
      <div className="bar">
        {Array(50)
          .fill(0)
          .map((_, index) => (
            <p key={index}>≠ ≤ 3√a ∑ |x-y| % Π φ ∫∫</p>
          ))}
      </div>
      <main className="onboarding-screen">
        <img src={Logo} className="logo" />

        <h3>
          Entrena tu mente y compite con otros en <span>simples</span> pero{" "}
          <span>rápidas</span> cuentas matemáticas{" "}
        </h3>

        <button>Comenzar</button>
        <p className="score">Tu récord: 76 puntos</p>
      </main>
    </>
  );
}

export default OnboardingScreen;
