// src/components/LoginButton.tsx
import { signInWithPopup } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_PROVIDER } from "src/utils/firebase/firebase";
import GoogleIcon from "../../assets/images/google-icon.svg";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "src/App";

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

    console.log("response.data", response.data);

    localStorage.setItem("points", response.data.history);
    localStorage.setItem("userID", response.data._id);
    console.log("tiggering");

    window.dispatchEvent(new Event("pointsUpdated"));
  };

  const handleLinkEmail = async (email: string) => {
    const response = await axios.put(`${API_URL}/users/link-email`, {
      userId: localStorage.getItem("userID"),
      history: localStorage.getItem("points"),
      email,
    });

    localStorage.setItem("userID", response.data._id);
  };

  return (
    <button onClick={handleLogin} className="google-button">
      <img src={GoogleIcon} />
      {isLoading ? "Procesando datos" : "Iniciar sesión"}
    </button>
  );
}
