"use client";
import dynamic from "next/dynamic";
const GameScreen = dynamic(() => import("src/features/game/screen/game-screen"), {
  ssr: false, loading: () => <p role="status">Cargando juego…</p>,
});
export default function GamePage() { return <GameScreen />; }
