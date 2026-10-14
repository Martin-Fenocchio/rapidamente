import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "src/lib/api";

import { useAnalytics } from "src/hooks/useAnalytics";
import {
  checkVavePlayedToday,
  getSumOfPoints,
} from "src/utils/points/points-utils";
import { getStreak } from "src/utils/streak/streak";

export const useOnboardingLogic = () => {
  const router = useRouter();
  const analytics = useAnalytics();

  const [showAnimation, setShowAnimation] = useState(false);
  const [historicalRecord, setHistoricalRecord] = useState(0);
  const [havePlayedToday, setHavePlayedToday] = useState(false);
  const [openModalName, setOpenModalName] = useState(false);
  const [nameController, setNameController] = useState("");
  const [errormessage, setErrormessage] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showModalSignIn, setShowModalSignIn] = useState(false);
  const googleAvailable = useRef(false);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (startTimer.current) clearTimeout(startTimer.current);
  }, []);

  const openModal = () => setOpenModalName(true);
  const closeModal = () => setOpenModalName(false);

  const checkIfThereIsUser = () => {
    const userID = localStorage.getItem("userID");

    if (!userID || userID == "undefined") openModal();
  };

  const handleOnSaveName = async (callback: (name: string) => Promise<void>) => {
    if (!nameController) {
      setErrormessage("Debes escribir un nombre");
      return;
    }

    setIsSavingName(true);

    try {
      await callback(nameController);
      closeModal();
    } catch (error: unknown) {
      const isDuplicatedName =
        axios.isAxiosError(error) && error.response?.data?.message === "NAME_ALREADY_EXISTS";

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
    if (startTimer.current) return;
    setShowAnimation(true);

    analytics.trackGameStart();

    startTimer.current = setTimeout(() => {
      router.push("/game");
    }, 800);
  };

  const handleShowModalSignIn = () => {
    const haveSignedIn = localStorage.getItem("GOOGLE_SIGNED_IN") == "true";
    const userID = localStorage.getItem("userID");

    if (googleAvailable.current && !haveSignedIn && userID && userID !== "undefined") {
      setShowModalSignIn(true);
    }
  };

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/config`).then(response => response.json()).then(config => {
      if (!active) return;
      googleAvailable.current = config.googleSignInEnabled === true;
      handleShowModalSignIn();
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    handleShowModalSignIn();
    checkIfThereIsUser();
    setHistoricalRecord(getSumOfPoints());
    setHavePlayedToday(checkVavePlayedToday());
    setStreak(getStreak());
  }, []);

  useEffect(() => {
    const storageListener = () => {
      setHistoricalRecord(getSumOfPoints());
    };

    const sessionListener = () => {
      const id = localStorage.getItem("userID");
      setOpenModalName(!id || id === "undefined");
      setHavePlayedToday(checkVavePlayedToday());
      handleShowModalSignIn();
    };
    window.addEventListener("sessionUpdated", sessionListener);
    window.addEventListener("pointsUpdated", storageListener);

    return () => {
      window.removeEventListener("pointsUpdated", storageListener);
      window.removeEventListener("sessionUpdated", sessionListener);
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
    streak,
  };
};
