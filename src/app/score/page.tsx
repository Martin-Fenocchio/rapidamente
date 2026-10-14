"use client";
import dynamic from "next/dynamic";
const ScoreScreen = dynamic(() => import("src/features/score/screen/score-screen"), {
  ssr: false, loading: () => <p role="status">Cargando resultados…</p>,
});
export default function ScorePage() { return <ScoreScreen />; }
