import { requireIdentity } from "src/server/auth/identity";
import { getDatabase } from "src/server/db";
import { playerService } from "src/server/players/service";
import { endpoint, requireOrigin } from "src/server/http/response";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return endpoint(async () => {
    requireOrigin(request);
    const identity = await requireIdentity(request.headers);
    const { db, client } = await getDatabase();
    return playerService(db, client).saveResult(identity.id, await request.json());
  });
}
