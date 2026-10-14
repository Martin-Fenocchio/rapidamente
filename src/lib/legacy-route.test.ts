import { describe, expect, it } from "vitest";
import { legacyRoute } from "./legacy-route";

describe("legacy hash links", () => {
  it.each(["/", "/game", "/score", "/players", "/lab"])("maps #%s to the new route", route => {
    expect(legacyRoute(`#${route}`)).toBe(route);
  });
  it.each(["", "#unknown", "#//example.com", "#https://example.com", "#/api/legacy/users"])("rejects unsupported hash %s", hash => {
    expect(legacyRoute(hash)).toBeNull();
  });
});
