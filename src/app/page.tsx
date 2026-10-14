"use client";

import dynamic from "next/dynamic";
import axios from "axios";
import { API_URL } from "src/lib/api";
import { getSumOfPoints } from "src/utils/points/points-utils";

const OnboardingScreen = dynamic(() => import("src/features/onboarding/screen/onboarding-screen"), {
  ssr: false, loading: () => <p role="status">Cargando RápidaMente…</p>,
});

export default function HomePage() {
  const saveName = async (name: string) => {
    const response = await axios.post(`${API_URL}/users`, { name, points: getSumOfPoints() });
    localStorage.setItem("userID", response.data._id);
    localStorage.setItem("userPoints", String(response.data.points ?? 0));
    window.dispatchEvent(new Event("pointsUpdated"));
  };
  return <OnboardingScreen onSaveName={saveName} />;
}
