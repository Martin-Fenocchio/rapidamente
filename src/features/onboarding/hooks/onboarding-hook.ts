import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkVavePlayedToday,
  getSumOfPoints,
} from "src/utils/points/points-utils";

export const useOnboardingLogic = () => {
  const navigate = useNavigate();

  const [showAnimation, setShowAnimation] = useState(false);
  const [historicalRecord, setHistoricalRecord] = useState(0);
  const [havePlayedToday, setHavePlayedToday] = useState(false);
  const [openModalName, setOpenModalName] = useState(false);
  const [nameController, setNameController] = useState("");
  const [errormessage, setErrormessage] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [showModalSignIn, setShowModalSignIn] = useState(false);

  const openModal = () => setOpenModalName(true);
  const closeModal = () => setOpenModalName(false);

  const checkIfThereIsUser = () => {
    const userID = localStorage.getItem("userID");

    if (!userID) openModal();
  };

  const handleOnSaveName = async (callback: (name: string) => void) => {
    if (!nameController) {
      setErrormessage("Debes escribir un nombre");
      return;
    }

    setIsSavingName(true);

    try {
      callback(nameController);
      closeModal();
    } catch (error: any) {
      const isDuplicatedName =
        error.response.data.message === "NAME_ALREADY_EXISTS";

      if (isDuplicatedName) {
        setErrormessage(
          "Tu nombre ya ha sido elegido por otra persona, por favor, usa otro."
        );
      } else {
        setErrormessage("Ocurrió un error, por favor, intenta más tarde.");
      }
    } finally {
      setIsSavingName(false);
    }
  };

  const handleStartGame = () => {
    setShowAnimation(true);

    setTimeout(() => {
      navigate("/game");
    }, 800);
  };

  const handleShowModalSignIn = () => {
    const haveSignedIn = localStorage.getItem("GOOGLE_SIGNED_IN") == "true";
    const userID = localStorage.getItem("userID");

    if (!haveSignedIn && userID) {
      setShowModalSignIn(true);
    }
  };

  useEffect(() => {
    handleShowModalSignIn();
    checkIfThereIsUser();
    setHistoricalRecord(getSumOfPoints());
    setHavePlayedToday(checkVavePlayedToday());
  }, []);

  useEffect(() => {
    const storageListener = () => {
      setHistoricalRecord(getSumOfPoints());
    };

    window.addEventListener("pointsUpdated", storageListener);

    return () => {
      window.removeEventListener("pointsUpdated", storageListener);
    };
  }, []);

  return {
    showAnimation,
    historicalRecord,
    havePlayedToday,
    handleStartGame,
    openModal,
    closeModal,
    checkIfThereIsName: checkIfThereIsUser,
    openModalName,
    nameController,
    setNameController,
    handleOnSaveName,
    isSavingName,
    errormessage,
    showModalSignIn,
    setShowModalSignIn,
  };
};
