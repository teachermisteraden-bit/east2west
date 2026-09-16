import { test, expect } from "@playwright/test";
import { activeLocales } from "../../src/i18n/locales";
import { allRoutes } from "../../src/config/nav";

/**
 * Every route, in every shipped locale. Reads the locale registry and the route
 * map, so a new language or page is covered the moment it is added.
 */
for (const locale of activeLocales) {
  for (const route of allRoutes) {
    const path = `/${locale.code}${route === "/" ? "" : route}`;

    test(`${path} renders correctly`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should return 200`).toBe(200);

      // Direction and language drive the entire RTL layout.
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", locale.code);
      await expect(html).toHaveAttribute("dir", locale.dir);
      await expect(html).toHaveAttribute("data-script", locale.script);

      // Exactly one h1 per page.
      await expect(page.locator("h1")).toHaveCount(1);

      // No horizontal page scroll at any breakpoint (04).
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflows, `${path} should not scroll horizontally`).toBe(false);

      // No untranslated ICU placeholder ever reaches the page.
      const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
      expect(body, `${path} leaked an ICU placeholder`).not.toMatch(/\{[a-zA-Z]+\}/);

      // Draft markers are bookkeeping and must never render.
      expect(body).not.toContain("_draft");
    });
  }
}

test("the language switch keeps the visitor on the same page", async ({ page }) => {
  await page.goto("/en/sponsors");
  await page.getByRole("link", { name: "العربية" }).first().click();
  await expect(page).toHaveURL(/\/ar\/sponsors$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("an unknown path renders the on-brand 404", async ({ page }) => {
  const response = await page.goto("/en/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("This path hasn't been built yet");
});
