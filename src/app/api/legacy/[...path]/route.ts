import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
type Context = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: Context) {
  const { path } = await context.params;
  const allowed = (request.method === "GET" && path.length === 1 && path[0] === "users")
    || (request.method === "GET" && path.length === 3 && path[0] === "users" && path[1] === "email")
    || (request.method === "POST" && path.length === 1 && path[0] === "users")
    || (request.method === "PUT" && path.length === 2 && path[0] === "users" && ["update-points", "link-email"].includes(path[1]));
  if (!allowed) return NextResponse.json({ message: "NOT_FOUND" }, { status: 404 });
  const upstream = process.env.LEGACY_API_URL;
  if (!upstream) return NextResponse.json({ message: "LEGACY_API_NOT_CONFIGURED" }, { status: 503 });
  try {
    const url = new URL(upstream);
    url.pathname = `${url.pathname.replace(/\/$/, "")}/${path.map(encodeURIComponent).join("/")}`;
    const response = await fetch(url, {
      method: request.method,
      headers: { "Content-Type": "application/json" },
      body: request.method === "GET" ? undefined : await request.text(),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ message: "LEGACY_API_UNAVAILABLE" }, { status: 502 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT };
