import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";
import { authConfig } from "../auth/config";

export const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { "Cache-Control": "no-store" } });
export async function endpoint(action: () => Promise<unknown>) {
  try { return json(await action()); }
  catch (error) {
    if (error instanceof AppError) return json({ message: error.code }, error.status);
    if (error instanceof ZodError || error instanceof SyntaxError) return json({ message: "INVALID_INPUT" }, 400);
    return json({ message: "SERVICE_UNAVAILABLE" }, 503);
  }
}
export function requireOrigin(request: Request) {
  const config = authConfig();
  const allowed = config.trustedOrigins ?? [new URL(config.url).origin];
  if (!allowed.includes(request.headers.get("origin") || "")) throw new AppError("INVALID_ORIGIN", 403);
}
