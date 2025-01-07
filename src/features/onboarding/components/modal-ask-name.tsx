import { useOnboardingLogic } from "../hooks/onboarding-hook";
import { Modal } from "react-responsive-modal";

function ModalAskName() {
  const {
    nameController,
    setNameController,
    isSavingName,
    errormessage,
    openModalName,
    handleOnSaveName
  } = useOnboardingLogic();

  return (
    <Modal open={openModalName} onClose={() => {}} center>
      <h3>Ingresa tu nombre</h3>
      <p>
        Para guardar tus puntajes, y compararlos con otros jugadores, escribí tu
        nombre.
      </p>

      <input
        type="text"
        placeholder="Nombre"
        onChange={(e) => setNameController(e.target.value)}
        value={nameController}
      />
      {errormessage && <p className="error">{errormessage}</p>}

      <button onClick={handleOnSaveName} data-is-saving={isSavingName}>
        {isSavingName ? "Guardando..." : "Guardar"}
      </button>
    </Modal>
  );
}

export default ModalAskName;
