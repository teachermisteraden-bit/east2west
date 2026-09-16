import { test, expect } from "@playwright/test";

/**
 * Reduced motion must show every scene in its final state (04) — not a paused
 * animation, not an element still waiting to fade in.
 */
test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the hero is fully visible with no animation pending", async ({ page }) => {
    await page.goto("/en");

    const dawn = page.locator(".hero__dawn");
    await expect(dawn).toBeVisible();

    // Nothing should be mid-flight: opacity settled, no transform offset.
    const state = await dawn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { opacity: cs.opacity, animationName: cs.animationName, transform: cs.transform };
    });
    expect(Number(state.opacity)).toBe(1);
    expect(["none", ""]).toContain(state.animationName);

    // The headline and the primary action are present and readable.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Find your door" })).toBeVisible();
  });

  test("smooth scrolling is disabled", async ({ page }) => {
    await page.goto("/en");
    const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(behavior).toBe("auto");
  });
});

test("the focus ring is visible when tabbing", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");

  const focused = page.locator(":focus-visible");
  await expect(focused).toBeVisible();

  const outline = await focused.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { width: cs.outlineWidth, style: cs.outlineStyle, color: cs.outlineColor };
  });
  expect(outline.style).toBe("solid");
  expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
});

test("the first tab stop is the skip link", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveClass(/skip-link/);
});
