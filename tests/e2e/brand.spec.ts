import { test, expect } from "@playwright/test";

/**
 * The E2W DS lockup.
 *
 * A logo is the one asset that appears on every page in both languages, so the
 * things that would be embarrassing about it are worth pinning down.
 */

test.describe("the lockup", () => {
  for (const locale of ["en", "ar"] as const) {
    test(`reads the same on /${locale} as it does anywhere else`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const wordmark = page.locator(".siteheader .wordmark");
      await expect(wordmark).toBeVisible();

      // A mark is not prose. On an Arabic page the document flips, but the
      // lockup must not: E2W reversed is a different brand.
      await expect(wordmark).toHaveCSS("direction", "ltr");
      await expect(wordmark.locator(".wordmark__primary")).toHaveText("E2W");
      await expect(wordmark.locator(".wordmark__secondary")).toHaveText("DS");

      // DS sits under E2W, not beside it.
      const primary = (await wordmark.locator(".wordmark__primary").boundingBox())!;
      const secondary = (await wordmark.locator(".wordmark__secondary").boundingBox())!;
      expect(secondary.y).toBeGreaterThan(primary.y + primary.height / 2);
    });
  }

  test("is named for a screen reader wherever nothing else names it", async ({ page }) => {
    await page.goto("/en");

    // The header wraps it in a link that is already labelled, so the lockup
    // there is decorative and must not be announced twice.
    await expect(page.locator(".siteheader .wordmark")).toHaveAttribute("aria-hidden", "true");

    // The footer has no such wrapper, so the lockup carries the full name --
    // "ee two double-you dee ess" would tell a listener nothing.
    const footer = page.locator(".sitefooter .wordmark");
    await expect(footer).toHaveAttribute("role", "img");
    await expect(footer).toHaveAttribute("aria-label", "East to West Development Society");
  });

  test("carries the Arabic name on an Arabic page", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator(".sitefooter .wordmark")).toHaveAttribute(
      "aria-label",
      "جمعية الشرق إلى الغرب للتنمية",
    );
  });

  test("draws one gradient per badge, with no id collisions", async ({ page }) => {
    // The footer and the press sheet both render the full badge on this page.
    // Two elements sharing an id is invalid markup that browsers resolve by
    // document order, which would silently point one badge at the other's fill.
    await page.goto("/en/press");
    const ids = await page.evaluate(() =>
      [...document.querySelectorAll("svg linearGradient[id]")].map((n) => n.id),
    );
    expect(ids.length).toBeGreaterThan(1);
    expect(new Set(ids).size, `duplicate gradient ids: ${ids.join(", ")}`).toBe(ids.length);
  });

  test("the header badge drops the detail that would turn to mud", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator(".siteheader .mark--compact")).toBeVisible();
    await expect(page.locator(".sitefooter .mark--full")).toBeVisible();
  });
});
