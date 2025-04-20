// src/components/LoginButton.tsx
import { signInWithPopup } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_PROVIDER } from "src/utils/firebase/firebase";
import GoogleIcon from "../../assets/images/google-icon.svg";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "src/App";
import toast from "react-hot-toast";

interface Props {
  signingUp?: boolean;
  onFinish: () => void;
}

export default function GoogleButton({ signingUp, onFinish }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(FIREBASE_AUTH, FIREBASE_PROVIDER);
      const email = result.user.email;

      if (!email) return;

      setIsLoading(true);

      if (signingUp) {
        await handleCreateUser(
          email,
          result.user.displayName || email.split("@")[0]
        );
      } else {
        await handleLinkEmail(result.user.email!);
      }

      onFinish();

      toast.success("Datos guardados correctamente");
      localStorage.setItem("GOOGLE_SIGNED_IN", "true");
    } catch (error) {
      console.error("Error de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (email: string, name: string) => {
    const response = await axios.post(`${API_URL}/users`, {
      name,
      email,
      points: 0,
    });

    localStorage.setItem("points", response.data.history ?? "[]");
    localStorage.setItem("userID", response.data._id);
    localStorage.setItem("userPoints", `${response.data.points ?? 0}`);

    window.dispatchEvent(new Event("pointsUpdated"));
  };

  const handleLinkEmail = async (email: string) => {
    const history = localStorage.getItem("points");

    const response = await axios.put(`${API_URL}/users/link-email`, {
      userId: localStorage.getItem("userID"),
      history: history && history != "undefined" ? history : "[]",
      email,
    });

    localStorage.setItem("userID", response.data._id);
    localStorage.setItem("userPoints", `${response.data.points ?? 0}`);
  };

  return (
    <button onClick={handleLogin} className="google-button">
      <img src={GoogleIcon} />
      {isLoading ? "Procesando datos" : "Iniciar sesión"}
    </button>
  );
}
