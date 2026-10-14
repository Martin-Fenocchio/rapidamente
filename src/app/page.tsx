"use client";

import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "src/lib/api";
import { authClient } from "src/lib/auth-client";
import { applyPlayer } from "src/lib/player-session";

const OnboardingScreen = dynamic(() => import("src/features/onboarding/screen/onboarding-screen"), {
  ssr: false, loading: () => <p role="status">Cargando RápidaMente…</p>,
});

export default function HomePage() {
  const saveName = async (name: string) => {
    const current = await authClient.getSession();
    if (!current.data) {
      const result = await authClient.signIn.anonymous();
      if (result.error) throw new Error(result.error.message);
    }
    const response = await axios.post(`${API_URL}/players`, { name });
    applyPlayer({ ...response.data, isAnonymous: true });
  };
  return <OnboardingScreen onSaveName={saveName} />;
}
