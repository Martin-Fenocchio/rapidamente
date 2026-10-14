import { z } from "zod";
import { requireIdentity } from "src/server/auth/identity";
import { getDatabase } from "src/server/db";
import { playerService } from "src/server/players/service";
import { endpoint, requireOrigin } from "src/server/http/response";
export const runtime = "nodejs";
export async function GET() {
  return endpoint(async () => { const { db, client } = await getDatabase(); return playerService(db, client).leaderboard(); });
}
export async function POST(request: Request) {
  return endpoint(async () => {
    requireOrigin(request);
    const identity = await requireIdentity(request.headers);
    const { name } = z.object({ name: z.string().trim().min(1).max(60) }).strict().parse(await request.json());
    const { db, client } = await getDatabase();
    return playerService(db, client).resolve(identity, name);
  });
}
