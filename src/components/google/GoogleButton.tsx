import { useEffect, useState } from "react";
import { authClient } from "src/lib/auth-client";
import { API_URL } from "src/lib/api";
import { assetUrl } from "src/lib/assets";
import toast from "react-hot-toast";

interface Props { signingUp?: boolean; onFinish: () => void }
export default function GoogleButton({ onFinish }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(`${API_URL}/config`).then(response => response.json()).then(config => setEnabled(config.googleSignInEnabled === true)).catch(() => {});
  }, []);
  const login = async () => {
    setLoading(true);
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/` });
      if (result.error) throw new Error(result.error.message);
      onFinish();
    } catch { toast.error("No se pudo iniciar sesión con Google."); setLoading(false); }
  };
  if (!enabled) return <p>El inicio de sesión con Google estará disponible próximamente.</p>;
  return <button className="google-button" onClick={login} disabled={loading}>
    <img src={assetUrl("google-icon.svg")} alt="" />{loading ? "Conectando…" : "Iniciar sesión"}
  </button>;
}
