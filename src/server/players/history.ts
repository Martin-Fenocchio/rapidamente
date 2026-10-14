import { z } from "zod";

export const historyEntry = z.object({
  date: z.string().min(1).max(40),
  pointsOfDay: z.number().int().min(0).max(10),
  time: z.number().finite().min(0).max(86400),
  isoDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).strict();
export type HistoryEntry = z.infer<typeof historyEntry>;

// Legacy records may have missing duration or extra fields: preserve them unchanged.
export function readLegacyHistory(history?: string): Array<Record<string, unknown> & { date: string }> {
  if (!history) return [];
  const parsed: unknown = JSON.parse(history);
  if (!Array.isArray(parsed) || parsed.some(item => !item || typeof item !== "object" || typeof item.date !== "string")) {
    throw new Error("INVALID_STORED_HISTORY");
  }
  return parsed;
}

export function mergeHistory(existing: string | undefined, incoming: HistoryEntry[]) {
  const records = readLegacyHistory(existing);
  const dates = new Set(records.map(record => record.date));
  for (const record of incoming) {
    if (!dates.has(record.date)) { records.push(record); dates.add(record.date); }
  }
  return JSON.stringify(records);
}

export function challengeDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find(item => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
