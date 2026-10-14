import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { anonymous } from "better-auth/plugins";
import { MongoClient, Db } from "mongodb";
import { playerService } from "../players/service";
import { AppError } from "../http/errors";
import { getDatabase } from "../db";

export interface AuthConfig { secret: string; url: string; googleClientId?: string; googleClientSecret?: string }
export function authConfig(): AuthConfig {
  const secret = process.env.BETTER_AUTH_SECRET;
  const url = process.env.BETTER_AUTH_URL || (process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : undefined);
  if (!secret || secret.length < 32 || !url) throw new AppError("AUTH_NOT_CONFIGURED", 503);
  return { secret, url, googleClientId: process.env.GOOGLE_CLIENT_ID, googleClientSecret: process.env.GOOGLE_CLIENT_SECRET };
}

export function createAuth(db: Db, client: MongoClient, config: AuthConfig) {
  const players = playerService(db, client);
  return betterAuth({
    appName: "RápidaMente",
    secret: config.secret,
    baseURL: config.url,
    basePath: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/auth`,
    database: mongodbAdapter(db, { client }),
    user: { modelName: "authUsers" },
    account: { modelName: "authAccounts" },
    session: { modelName: "authSessions", expiresIn: 60 * 60 * 24 * 7, cookieCache: { enabled: false } },
    verification: { modelName: "authVerifications" },
    emailAndPassword: { enabled: false },
    trustedOrigins: [new URL(config.url).origin],
    socialProviders: config.googleClientId && config.googleClientSecret ? {
      google: { clientId: config.googleClientId, clientSecret: config.googleClientSecret },
    } : {},
    plugins: [anonymous({
      disableDeleteAnonymousUser: true,
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        const identity = { id: newUser.user.id, name: newUser.user.name, email: newUser.user.email, emailVerified: newUser.user.emailVerified, isAnonymous: Boolean(newUser.user.isAnonymous) };
        if (identity.isAnonymous || !identity.emailVerified) throw new AppError("VERIFIED_IDENTITY_REQUIRED", 403);
        await players.resolve(identity);
        await players.linkGuest(anonymousUser.user.id, identity.id);
      },
    })],
  });
}

let cached: ReturnType<typeof createAuth> | undefined;
let configurationKey: string | undefined;
export async function getAuth() {
  const config = authConfig();
  const { db, client } = await getDatabase();
  const key = JSON.stringify({ database: db.databaseName, ...config });
  if (!cached || key !== configurationKey) {
    await playerService(db, client).prepareIndexes();
    cached = createAuth(db, client, config);
    configurationKey = key;
  }
  return cached;
}
