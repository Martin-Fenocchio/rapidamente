import Maths from "../../assets/images/maths.png";
import GoogleButton from "./GoogleButton";

interface Props {
  controlVisibility: (value: boolean) => void;
}

function ModalSignIn({ controlVisibility }: Props) {
  return (
    <div className="modal-sign-in animate__animated animate__fadeInUp">
      <h3>Evita perder tus puntos!</h3>
      <p>
        Inicía sesión con Google para guardar tus puntos y no perderlos, además
        de poder jugar con tu cuenta desde cualquier dispositivo.
      </p>

      <img src={Maths} />

      <GoogleButton onFinish={() => controlVisibility(false)} />

      <button
        className="cancel-button"
        onClick={() => controlVisibility(false)}
      >
        Cancelar
      </button>
    </div>
  );
}

export default ModalSignIn;
