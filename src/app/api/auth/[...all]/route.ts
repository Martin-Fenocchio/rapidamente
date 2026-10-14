import { getAuth } from "src/server/auth/config";
import { endpoint } from "src/server/http/response";
export const runtime = "nodejs";
async function handle(request: Request) {
  try { return await (await getAuth()).handler(request); }
  catch (error) { return endpoint(async () => { throw error; }); }
}
export { handle as GET, handle as POST };
