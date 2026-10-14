import { afterEach, describe, expect, it, vi } from "vitest";
import { authConfig } from "../../src/server/auth/config";

afterEach(() => vi.unstubAllEnvs());
function configure() {
  vi.stubEnv("BETTER_AUTH_SECRET", "a".repeat(32));
  vi.stubEnv("BETTER_AUTH_URL", "");
  vi.stubEnv("VERCEL_BRANCH_URL", "");
  vi.stubEnv("VERCEL_URL", "");
}
describe("deployment auth configuration", () => {
  it("fails closed without a URL or strong signing secret", () => {
    configure();
    expect(() => authConfig()).toThrow("AUTH_NOT_CONFIGURED");
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
    vi.stubEnv("BETTER_AUTH_SECRET", "short");
    expect(() => authConfig()).toThrow("AUTH_NOT_CONFIGURED");
  });
  it("trusts the exact branch and deployment hosts in Vercel previews", () => {
    configure();
    vi.stubEnv("VERCEL_BRANCH_URL", "app-git-migration.vercel.app");
    vi.stubEnv("VERCEL_URL", "app-unique.vercel.app");
    expect(authConfig()).toMatchObject({
      url: "https://app-git-migration.vercel.app",
      trustedOrigins: ["https://app-git-migration.vercel.app", "https://app-unique.vercel.app"],
    });
  });
  it("prefers an explicit canonical URL without trusting unrelated origins", () => {
    configure();
    vi.stubEnv("BETTER_AUTH_URL", "https://game.example.com");
    vi.stubEnv("VERCEL_URL", "app-unique.vercel.app");
    expect(authConfig()).toMatchObject({ url: "https://game.example.com", trustedOrigins: ["https://game.example.com", "https://app-unique.vercel.app"] });
    expect(authConfig().trustedOrigins).not.toContain("https://other.example.com");
  });
});
