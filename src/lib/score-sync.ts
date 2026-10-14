import axios from "axios";
import { API_URL } from "./api";
import { getScoreOfToday } from "src/utils/points/points-utils";
import { challengeDate } from "src/shared/game-date";

const key = "pendingScore";
let inFlight: Promise<void> | null = null;
interface PendingResult { playerId: string; date: string; pointsOfDay: number; time: number }
export function queueScore() {
  const playerId = localStorage.getItem("userID");
  const today = getScoreOfToday();
  if (!playerId || !today) return;
  localStorage.setItem(key, JSON.stringify({ playerId, date: today.isoDate ?? challengeDate(), pointsOfDay: today.pointsOfDay, time: today.time }));
}
export function syncPendingScore(): Promise<void> {
  if (inFlight) return inFlight;
  const pending = localStorage.getItem(key);
  if (!pending) return Promise.resolve();
  let payload: PendingResult;
  try { payload = JSON.parse(pending); }
  catch { return Promise.reject(new Error("El resultado pendiente no se pudo leer.")); }
  if (!payload.playerId) {
    localStorage.setItem("legacyPendingScore", pending);
    localStorage.removeItem(key);
    return Promise.resolve();
  }
  if (payload.playerId !== localStorage.getItem("userID")) return Promise.reject(new Error("El resultado pertenece a otra sesión."));
  const { date, pointsOfDay, time } = payload;
  inFlight = axios.post(`${API_URL}/results`, { date, pointsOfDay, time }).then(response => {
    localStorage.setItem("userPoints", String(response.data.points));
    localStorage.setItem("points", response.data.history);
    if (localStorage.getItem(key) === pending) localStorage.removeItem(key);
    window.dispatchEvent(new Event("pointsUpdated"));
  }).finally(() => { inFlight = null; });
  return inFlight;
}
