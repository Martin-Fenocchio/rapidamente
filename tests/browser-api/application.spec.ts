import { test as base, expect, Page } from "@playwright/test";
import { OPERATIONS } from "../../src/features/game/data/operations";

const test = base.extend<{ errors: string[] }>({
  errors: [async ({ page, context }, use) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await context.route("**/*", route => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
    await page.clock.install({ time: new Date() });
    await use(errors);
    expect(errors).toEqual([]);
  }, { auto: true }],
});
async function register(page: Page, name: string) {
  await page.goto("/");
  await page.getByPlaceholder("Escribe tu nombre").fill(name);
  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(page.getByPlaceholder("Escribe tu nombre")).not.toBeVisible();
}
async function start(page: Page) {
  await page.addStyleTag({ content: "*, *::before, *::after { animation: none !important; transition: none !important; }" });
  await page.getByRole("button", { name: "Comenzar" }).click();
  await page.clock.runFor(800);
  await expect(page).toHaveURL(/\/game$/);
  await expect(page.locator(".countdown")).toBeVisible();
  await page.clock.runFor(4000);
  await expect(page.locator(".calculation .grid button")).toHaveCount(4);
}

test("real guest session, private recovery, and logout", async ({ page, context, request }, info) => {
  const name = `Guest ${info.project.name}`;
  await register(page, name);
  const mine = await page.request.get("/api/me");
  expect(mine.status()).toBe(200);
  expect((await mine.json()).name).toBe(name);
  expect((await context.cookies()).some(cookie => cookie.name.includes("session_token") && cookie.httpOnly)).toBe(true);
  expect((await request.get("/api/me")).status()).toBe(401);
  await page.reload();
  await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page.getByPlaceholder("Escribe tu nombre")).toBeVisible();
  expect((await page.request.get("/api/me")).status()).toBe(401);
});

test("complete game persists once through the real API and survives reload", async ({ page }, info) => {
  await register(page, `Winner ${info.project.name}`);
  const config = await (await page.request.get("/api/config")).json();
  const weekday = new Date(`${config.challengeDate}T12:00:00-03:00`).getUTCDay();
  await start(page);
  for (const question of OPERATIONS[weekday]) {
    await expect(page.locator(".calculation h3")).toHaveText(question.operation);
    await page.locator(".calculation .grid").getByRole("button", { name: String(question.result), exact: true }).click();
  }
  await page.clock.runFor(2500);
  await expect(page).toHaveURL(/\/score$/, { timeout: 10000 });
  await expect(page.locator(".ticket h2")).toHaveText("10 PUNTOS");
  await expect.poll(async () => (await (await page.request.get("/api/me")).json()).points).toBe(10);
  const repeat = await page.request.post("/api/results", { headers: { Origin: "http://127.0.0.1:4182" }, data: { date: config.challengeDate, pointsOfDay: 10, time: 10 } });
  expect(repeat.status()).toBe(200);
  expect((await repeat.json()).points).toBe(10);
  await page.reload();
  await expect(page.locator(".ticket h2")).toHaveText("10 PUNTOS");
  const mine = await (await page.request.get("/api/me")).json();
  expect(JSON.parse(mine.history)).toHaveLength(1);
  await page.goto("/");
  await expect(page.getByTestId("dailly-blocker")).toBeVisible();
});

test("private result ownership and origin protection use real cookies", async ({ page, request }, info) => {
  await register(page, `Protected ${info.project.name}`);
  const config = await (await page.request.get("/api/config")).json();
  const body = { date: config.challengeDate, pointsOfDay: 4, time: 8 };
  expect((await request.post("/api/results", { headers: { Origin: "http://127.0.0.1:4182" }, data: body })).status()).toBe(401);
  expect((await page.request.post("/api/results", { headers: { Origin: "https://another.example" }, data: body })).status()).toBe(403);
  expect((await page.request.post("/api/results", { headers: { Origin: "http://127.0.0.1:4182" }, data: { ...body, id: "another-player", points: 1000 } })).status()).toBe(400);
  expect((await (await page.request.get("/api/me")).json()).points).toBe(0);
});
