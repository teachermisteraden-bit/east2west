import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { activeLocales } from "../../src/i18n/locales";
import { allRoutes } from "../../src/config/nav";

/**
 * WCAG 2.2 AA, checked automatically.
 *
 * axe catches roughly a third to a half of real accessibility problems, so a
 * clean run is a floor and not a certificate. The manual checks it cannot make
 * — keyboard order, focus visibility, the text equivalents for the diagrams,
 * reduced motion — are covered by their own tests elsewhere.
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const locale of activeLocales) {
  for (const route of allRoutes) {
    const path = `/${locale.code}${route === "/" ? "" : route}`;

    test(`${path} has no automatically detectable accessibility violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)\n    ${v.nodes[0]?.html?.slice(0, 160)}`,
      );
      expect(summary, `${path}\n  ${summary.join("\n  ")}`).toEqual([]);
    });
  }
}

test("the join form is accessible on every step", async ({ page }) => {
  await page.goto("/en/join?type=graduate");
  const first = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(first.violations.map((v) => v.id)).toEqual([]);

  // And with errors showing, which is when labels and descriptions matter most.
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(".field__error").first()).toBeVisible();
  const withErrors = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(withErrors.violations.map((v) => v.id)).toEqual([]);
});

test("the admin sign-in page is accessible", async ({ page }) => {
  await page.goto("/admin/login");
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
