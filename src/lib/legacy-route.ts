const routes = new Set(["/", "/game", "/score", "/players", "/lab"]);

export function legacyRoute(hash: string): string | null {
  const route = hash.startsWith("#") ? hash.slice(1) : hash;
  return routes.has(route) ? route : null;
}
