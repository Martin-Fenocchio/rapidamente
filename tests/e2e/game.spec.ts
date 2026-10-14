import { test as base, expect, Page } from "@playwright/test";
import { OPERATIONS } from "../../src/features/game/data/operations";

const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [async ({ page, context }, use) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await context.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== "127.0.0.1") return route.abort();
      if (url.pathname.startsWith("/api/legacy/")) {
        if (route.request().method() === "POST") return route.fulfill({ json: { _id: "test-user", name: "Ana", points: 0 } });
        if (route.request().method() === "PUT") return route.fulfill({ json: { points: route.request().postDataJSON().points } });
        return route.fulfill({ json: [{ _id: "leader", name: "Líder", points: 20 }, { _id: "test-user", name: "Ana", points: 5 }] });
      }
      return route.continue();
    });
    await page.clock.install({ time: new Date("2026-10-14T15:00:00Z") });
    await use(errors);
    expect(errors, "No uncaught browser errors").toEqual([]);
  }, { auto: true }],
});

async function existingPlayer(page: Page) {
  await page.addInitScript(() => {
    if (!localStorage.getItem("userID")) {
      localStorage.setItem("userID", "test-user");
      localStorage.setItem("userPoints", "5");
    }
    localStorage.setItem("GOOGLE_SIGNED_IN", "true");
  });
}

async function startGame(page: Page) {
  await existingPlayer(page);
  await page.goto("/");
  await page.addStyleTag({ content: "*, *::before, *::after { animation: none !important; transition: none !important; }" });
  await page.getByRole("button", { name: "Comenzar" }).click();
  await page.clock.runFor(800);
  await expect(page).toHaveURL(/\/game$/);
  await expect(page.locator(".countdown")).toBeVisible();
  await page.clock.runFor(4000);
  await expect(page.locator(".calculation .grid button")).toHaveCount(4);
}

test("registers a named player and preserves the ID after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Escribe tu nombre").fill("Ana");
  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(page.getByPlaceholder("Escribe tu nombre")).not.toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("userID"))).toBe("test-user");
  await page.reload();
  await expect(page.getByRole("button", { name: "Comenzar" })).toBeVisible();
});

test("keeps registration open after a failed request", async ({ page }) => {
  await page.route("**/api/legacy/users", route => route.fulfill({ status: 503, json: { message: "offline" } }));
  await page.goto("/");
  await page.getByPlaceholder("Escribe tu nombre").fill("Ana");
  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(page.getByText("Ocurrió un error, por favor, intenta más tarde.")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("userID"))).toBeNull();
});

test("finishes all ten questions and saves a ten-point result once", async ({ page }) => {
  const saves: number[] = [];
  page.on("request", request => {
    if (request.method() === "PUT" && request.url().endsWith("/update-points")) saves.push(request.postDataJSON().points);
  });
  await startGame(page);
  for (const question of OPERATIONS[3]) {
    await expect(page.locator(".calculation h3")).toHaveText(question.operation);
    await page.locator(".calculation .grid").getByRole("button", { name: String(question.result), exact: true }).click();
  }
  await page.clock.runFor(2500);
  await expect(page).toHaveURL(/\/score$/);
  await expect(page.locator(".ticket h2")).toHaveText("10 PUNTOS");
  await expect.poll(() => saves.length).toBe(1);
  expect(saves).toEqual([15]);
  await page.reload();
  await expect(page.locator(".ticket h2")).toHaveText("10 PUNTOS");
  expect(saves).toEqual([15]);
});

test("ends on a wrong answer and blocks another attempt today", async ({ page }) => {
  await startGame(page);
  const correct = OPERATIONS[3][0].result;
  const choices = page.locator(".calculation .grid button");
  const labels = await choices.allTextContents();
  await page.locator(".calculation .grid").getByRole("button", { name: labels.find(label => Number(label) !== correct)!.trim(), exact: true }).click();
  await page.clock.runFor(2500);
  await expect(page.locator(".ticket h2")).toHaveText("0 PUNTOS");
  await page.goto("/");
  await expect(page.getByTestId("dailly-blocker")).toBeVisible();
  await page.goto("/game");
  await expect(page).toHaveURL(/\/score$/);
});

test("times out at the configured deadline", async ({ page }) => {
  await startGame(page);
  await page.clock.runFor(2500);
  await expect(page.getByText("Se agotó el tiempo")).toBeVisible();
  await page.clock.runFor(2500);
  await expect(page.locator(".ticket h2")).toHaveText("0 PUNTOS");
});

test("retries a failed score save without losing the local result", async ({ page }) => {
  let fail = true;
  await page.route("**/api/legacy/users/update-points", route => route.fulfill(fail
    ? { status: 503, json: { message: "offline" } }
    : { json: { points: 5 } }));
  await startGame(page);
  await page.clock.runFor(5000);
  await expect(page.locator("main").getByRole("alert")).toContainText("No se pudo sincronizar");
  expect(await page.evaluate(() => localStorage.getItem("pendingScore"))).not.toBeNull();
  fail = false;
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.locator("main").getByRole("alert")).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("pendingScore"))).toBeNull();
});

test("opens and refreshes the leaderboard, including legacy hash links", async ({ page }) => {
  await existingPlayer(page);
  await page.goto("/#/players");
  await expect(page).toHaveURL(/\/players$/);
  await expect(page.getByText(/Líder/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Líder/)).toBeVisible();
  await expect(page.locator(".players-list article")).toHaveCount(3);
});

test("loads the existing home design at desktop and mobile widths", async ({ page }, testInfo) => {
  await existingPlayer(page);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Comenzar" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("next-home.png"), fullPage: true });
  await testInfo.attach("home", { path: testInfo.outputPath("next-home.png"), contentType: "image/png" });
  const logo = page.locator("main img.logo");
  await expect(logo).toBeVisible();
  expect(await logo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});
