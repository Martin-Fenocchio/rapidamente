import { useEffect, useState } from "react";
import { authClient } from "src/lib/auth-client";


export default function AccountControls() {
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const refresh = () => setSignedIn(Boolean(localStorage.getItem("userID")));
    refresh();
    window.addEventListener("sessionUpdated", refresh);
    return () => window.removeEventListener("sessionUpdated", refresh);
  }, []);
  const signOut = async () => {
    setError(false);
    try {
      const response = await authClient.signOut();
      if (response.error) throw new Error("SIGN_OUT_FAILED");
      for (const key of ["userID", "userPoints", "points", "pendingScore", "GOOGLE_SIGNED_IN"]) localStorage.removeItem(key);
      window.dispatchEvent(new Event("sessionUpdated"));
    } catch { setError(true); }
  };
  return signedIn ? <div style={{ textAlign: "center", padding: "1rem" }}>
    <button onClick={signOut}>Cerrar sesión</button>
    {error && <p role="alert">No se pudo cerrar la sesión.</p>}
  </div> : null;
}
