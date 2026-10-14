import { json } from "src/server/http/response";
import { challengeDate } from "src/server/players/history";
export async function GET() {
  return json({ googleSignInEnabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), challengeDate: challengeDate() });
}
