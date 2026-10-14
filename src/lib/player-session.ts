import axios from "axios";
import { API_URL } from "./api";

export interface CurrentPlayer { _id: string; name: string; points: number; history: string; isAnonymous?: boolean }
export function applyPlayer(player: CurrentPlayer) {
  const history: unknown = JSON.parse(player.history || "[]");
  if (!Array.isArray(history)) throw new Error("INVALID_HISTORY");
  // A pending result belongs to the previous identity and must not be replayed into another account.
  const previous = localStorage.getItem("userID");
  if (previous && previous !== player._id) localStorage.removeItem("pendingScore");
  localStorage.setItem("userID", player._id);
  localStorage.setItem("userPoints", String(player.points));
  if (!localStorage.getItem("pendingScore")) localStorage.setItem("points", player.history || "[]");
  localStorage.setItem("GOOGLE_SIGNED_IN", String(player.isAnonymous === false));
  window.dispatchEvent(new Event("pointsUpdated"));
  window.dispatchEvent(new Event("sessionUpdated"));
}
export async function restorePlayer() {
  try { const response = await axios.get(`${API_URL}/me`); applyPlayer(response.data); }
  catch (error) {
    if (axios.isAxiosError(error) && [401, 404].includes(error.response?.status ?? 0)) {
      const id = localStorage.getItem("userID");
      if (id && !localStorage.getItem("legacyPlayerSnapshot")) localStorage.setItem("legacyPlayerSnapshot", JSON.stringify({ userID: id, userPoints: localStorage.getItem("userPoints"), points: localStorage.getItem("points") }));
      localStorage.removeItem("userID");
      localStorage.removeItem("GOOGLE_SIGNED_IN");
      window.dispatchEvent(new Event("sessionUpdated"));
    }
  }
}
