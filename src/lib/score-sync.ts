import axios from "axios";
import { API_URL } from "./api";
import { getHistoricalPoints, getScoreOfToday, getSumOfPoints } from "src/utils/points/points-utils";

const key = "pendingScore";
let inFlight: Promise<void> | null = null;

export function queueScore() {
  const id = localStorage.getItem("userID");
  const today = getScoreOfToday();
  if (!id || !today) return;
  localStorage.setItem(key, JSON.stringify({ id, points: getSumOfPoints() + today.pointsOfDay, history: JSON.stringify(getHistoricalPoints()) }));
}

// Legacy API replaces totals: retrying this exact payload does not add points again.
export function syncPendingScore(): Promise<void> {
  if (inFlight) return inFlight;
  const pending = localStorage.getItem(key);
  if (!pending) return Promise.resolve();
  let payload: { id: string; points: number; history: string };
  try { payload = JSON.parse(pending); }
  catch { return Promise.reject(new Error("El resultado pendiente no se pudo leer.")); }
  inFlight = axios.put(`${API_URL}/users/update-points`, payload).then(response => {
    localStorage.setItem("userPoints", String(response.data.points ?? payload.points));
    if (localStorage.getItem(key) === pending) localStorage.removeItem(key);
    window.dispatchEvent(new Event("pointsUpdated"));
  }).finally(() => { inFlight = null; });
  return inFlight;
}
