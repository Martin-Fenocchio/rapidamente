import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
if (basePath && (!basePath.startsWith("/") || basePath.endsWith("/"))) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must start with / and have no trailing slash.");
}
const config: NextConfig = {
  basePath,
  poweredByHeader: false,
};

export default process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(config, { org: "limboteams", project: "rapidamente", silent: true, telemetry: false })
  : config;
