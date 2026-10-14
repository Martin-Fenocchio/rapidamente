import "server-only";
import { getAuth } from "./config";
import { AppError } from "../http/errors";

export async function requireIdentity(headers: Headers) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers });
  if (!session) throw new AppError("UNAUTHORIZED", 401);
  return { id: session.user.id, name: session.user.name, email: session.user.email, emailVerified: session.user.emailVerified, isAnonymous: Boolean(session.user.isAnonymous) };
}
