import { requireIdentity } from "src/server/auth/identity";
import { getDatabase } from "src/server/db";
import { playerService } from "src/server/players/service";
import { endpoint } from "src/server/http/response";
export const runtime = "nodejs";
export async function GET(request: Request) {
  return endpoint(async () => {
    const identity = await requireIdentity(request.headers);
    const { db, client } = await getDatabase();
    const service = playerService(db, client);
    const player = identity.isAnonymous ? await service.current(identity.id) : await service.resolve(identity);
    return { ...player, isAnonymous: identity.isAnonymous };
  });
}
