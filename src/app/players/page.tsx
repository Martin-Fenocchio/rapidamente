"use client";
import dynamic from "next/dynamic";
const PlayersScreen = dynamic(() => import("src/features/players/screen/players-screen"), {
  ssr: false, loading: () => <p role="status">Cargando jugadores…</p>,
});
export default function PlayersPage() { return <PlayersScreen />; }
