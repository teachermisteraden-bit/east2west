import { test, expect } from "@playwright/test";

const STUB = `http://localhost:${process.env.STUB_PORT ?? 4999}`;
const PASSWORD = "e2e-admin-password";

/**
 * The admin area holds other people's personal data, so the boundary matters
 * more than the page. These check that nothing behind it is reachable without a
 * session — including the CSV export, which is the whole database in one file.
 */
test.describe("the admin boundary", () => {
  test("submissions are not reachable without signing in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("the opportunities panel is not reachable without signing in", async ({ page }) => {
    await page.goto("/admin/opportunities");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("the CSV export gives nothing away when signed out", async ({ request }) => {
    const response = await request.get("/admin/export.csv");
    // 404 rather than 401: an unauthenticated caller learns nothing, not even
    // that the export exists.
    expect(response.status()).toBe(404);
    const body = await response.text();
    expect(body).not.toContain("payload");
    expect(body).not.toContain("consent_at");
  });

  test("a wrong password is refused and leaks nothing", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Password").fill("not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Scoped to the form's own error: Next's route announcer is also role=alert.
    const error = page.locator(".admin__login .field__error");
    await expect(error).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
    // The message says only that it was wrong — nothing about the real one.
    const message = await error.innerText();
    expect(message).not.toMatch(/length|character|expected|[0-9]{3,}/);
  });

  test("the admin area is excluded from search engines", async ({ page, request }) => {
    await page.goto("/admin/login");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);

    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("/admin");
  });

  test("the admin area is not in the sitemap and carries no hreflang", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("/admin");
  });
});

test.describe("signed in", () => {
  test.skip(
    () => !process.env.E2E_ADMIN_PASSWORD,
    "needs ADMIN_PASSWORD on the server under test",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("submissions can be filtered by form and by campaign", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Submissions" })).toBeVisible();
    await page.getByRole("link", { name: "graduate", exact: true }).click();
    await expect(page).toHaveURL(/mode=graduate/);
    await page.getByRole("link", { name: "sponsors", exact: true }).click();
    await expect(page).toHaveURL(/campaign=sponsors/);
  });

  test("the export downloads a CSV", async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Export CSV" }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/east-to-west-submissions-\d{4}-\d{2}-\d{2}\.csv/);
  });

  test("opportunities start at zero and say so honestly", async ({ page }) => {
    await page.goto("/admin/opportunities");
    await expect(page.getByRole("heading", { name: "Opportunities created" })).toBeVisible();
    await expect(page.locator(".admin__figurenum").first()).toHaveText("0");
    await expect(page.getByText(/stays at zero until something real happens/)).toBeVisible();
  });

  test("signing out ends the session", async ({ page }) => {
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});

test("analytics load nothing while the flag is off", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/en");
  expect(requests.filter((u) => u.includes("plausible"))).toEqual([]);
});

test("funnel events are declared in the markup, not in JavaScript", async ({ page }) => {
  await page.goto("/en");
  // Doors report themselves through class names, so the click costs no script.
  const door = page.locator(".doors__card").first();
  await expect(door).toHaveClass(/plausible-event-name=Door\+Click/);
  await expect(door).toHaveClass(/plausible-event-door=graduates/);
});
