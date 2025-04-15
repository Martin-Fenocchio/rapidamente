import GoogleButton from "src/components/google/GoogleButton";
import { useOnboardingLogic } from "../hooks/onboarding-hook";
import { Modal } from "react-responsive-modal";

interface Props {
  onSaveName: (name: string) => void;
}

function ModalAskName(props: Props) {
  const {
    nameController,
    setNameController,
    isSavingName,
    errormessage,
    closeModal,
    openModalName,
    handleOnSaveName,
  } = useOnboardingLogic();

  return (
    <Modal
      open={openModalName}
      onClose={() => {}}
      classNames={{ modal: "modal-ask-name" }}
      center
    >
      <h3>Ingresa tu nombre</h3>
      <p>
        Para guardar tus puntajes, y compararlos con otros jugadores, puedes
        inicia sesión con Google.
      </p>

      <GoogleButton onFinish={closeModal} signingUp />

      <div className="divider">
        <div />
        <span>o</span>
        <div />
      </div>

      <p className="option-name">Ingresa con tu nombre:</p>

      <input
        type="text"
        placeholder="Escribe tu nombre"
        onChange={(e) => setNameController(e.target.value)}
        value={nameController}
      />
      {errormessage && <p className="error">{errormessage}</p>}

      {nameController && (
        <button
          onClick={() => handleOnSaveName(props.onSaveName)}
          data-is-saving={isSavingName}
          className="save-button"
        >
          {isSavingName ? "Guardando..." : "Guardar"}
        </button>
      )}
    </Modal>
  );
}

export default ModalAskName;
