import { test, expect } from "@playwright/test";

/**
 * The craft details.
 *
 * These are the things that make the site feel made rather than assembled — and
 * each one carries a rule it must not break. A cursor effect that hid the real
 * cursor, or a reveal that left text invisible, would be worse than not having
 * it at all.
 */

test.describe("the gold ring", () => {
  test("follows the pointer and opens over anything interactive", async ({ page }) => {
    await page.goto("/en");
    const applies = await page.evaluate(
      () =>
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    test.skip(!applies, "the ring is for fine pointers with motion allowed");

    await page.mouse.move(700, 400);
    await expect.poll(() => page.locator(".cursorring").count()).toBe(1);

    const ring = page.locator(".cursorring");
    await expect(ring).toHaveAttribute("data-on", "true");
    await expect(ring).toHaveAttribute("aria-hidden", "true");

    const resting = await ring.evaluate((el) => getComputedStyle(el).width);

    await page.locator(".doors__card").first().scrollIntoViewIfNeeded();
    const box = (await page.locator(".doors__card").first().boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

    await expect(ring).toHaveAttribute("data-open", "true");
    await expect.poll(async () => ring.evaluate((el) => getComputedStyle(el).width)).not.toBe(resting);
  });

  test("never hides the real cursor", async ({ page }) => {
    await page.goto("/en");
    await page.mouse.move(600, 400);
    // Whatever the ring does, the system cursor must remain.
    for (const selector of ["body", ".doors__card", ".btn--primary"]) {
      const cursor = await page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).cursor);
      expect(cursor, `${selector} must not hide the cursor`).not.toBe("none");
    }
  });

  test("never intercepts a click", async ({ page }) => {
    await page.goto("/en");
    await page.mouse.move(700, 400);
    const events = await page.locator(".cursorring").count();
    if (events === 0) test.skip(true, "no ring on this device");
    await expect(page.locator(".cursorring")).toHaveCSS("pointer-events", "none");
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("there is no cursor ring at all", async ({ page }) => {
    await page.goto("/en");
    await page.mouse.move(700, 400);
    await page.waitForTimeout(400);
    // Either never created, or created and hidden — both acceptable, visible is not.
    const visible = await page.evaluate(() => {
      const el = document.querySelector(".cursorring");
      return el ? getComputedStyle(el).display !== "none" : false;
    });
    expect(visible).toBe(false);
  });

  test("masked headings are fully visible, not clipped away", async ({ page }) => {
    await page.goto("/en");
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".maskreveal")]
        .filter((el) => {
          const clip = getComputedStyle(el).clipPath;
          return clip !== "none" && clip.includes("100%");
        })
        .map((el) => el.textContent?.slice(0, 40)),
    );
    expect(clipped, "no heading may be left hidden behind its mask").toEqual([]);
  });
});

test("the doors and their pages share a transition name", async ({ page }) => {
  await page.goto("/en");
  const doors = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".doors__card")].map(
      (el) => getComputedStyle(el).viewTransitionName,
    ),
  );
  expect(doors).toEqual(["door-graduates", "door-universities", "door-sponsors", "door-businesses"]);

  // The destination carries the same name, which is what makes the card open
  // into the page rather than the whole document cross-fading.
  for (const [door, path] of [
    ["door-graduates", "/en/graduates"],
    ["door-sponsors", "/en/sponsors"],
  ] as const) {
    await page.goto(path);
    const heading = await page
      .locator("h1")
      .evaluate((el) => getComputedStyle(el).viewTransitionName);
    expect(heading, `${path} should receive ${door}`).toBe(door);
  }
});

test("the paper grain sits on light fields and never on dark ones", async ({ page }) => {
  await page.goto("/en");
  const light = await page
    .locator(".scene:not(.on-dark)")
    .first()
    .evaluate((el) => getComputedStyle(el, "::before").backgroundImage);
  expect(light).toContain("data:image/svg+xml");

  const dark = await page
    .locator(".closing")
    .evaluate((el) => getComputedStyle(el, "::before").backgroundImage);
  expect(dark, "grain on obsidian would read as noise, not paper").toBe("none");

  // It is decoration and must never catch a click.
  const events = await page
    .locator(".scene:not(.on-dark)")
    .first()
    .evaluate((el) => getComputedStyle(el, "::before").pointerEvents);
  expect(events).toBe("none");
});

test("the tracing hairline is decoration, not the focus indicator", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  // Focus must still be shown by the outline, never by the hover trace alone.
  const focused = page.locator(":focus-visible");
  await expect(focused).toBeVisible();
  const outline = await focused.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).toBe("solid");
});
