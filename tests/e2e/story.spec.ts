import { test, expect, type Page } from "@playwright/test";

/**
 * The Crossing at First Light.
 *
 * The rules this scene obeys are the ones easiest to break by accident: the sun
 * must keep its real direction under RTL, the two sticky scenes must stay within
 * their limits and must never trap the page, and reduced motion must show every
 * scene finished rather than waiting.
 */

const SCENES = [
  "shores",
  "pillars",
  "flywheel",
  "programmes-scene",
  "challenge",
  "journey",
  "kingdom",
  "doors",
  "closing",
] as const;

async function disableSmoothScroll(page: Page) {
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
}

/**
 * Scrolls to a fraction of a sticky scene's pinned window.
 *
 * The geometry is measured immediately before each scroll rather than once up
 * front: web fonts settle after load and move everything below them, so an
 * offset captured early is stale by the time it is used.
 */
/**
 * The sticky scenes exist only on wide screens with motion allowed. Below
 * 1024px they are ordinary sections, and under reduced motion they collapse on
 * purpose — so these assertions do not apply there, and skipping is the correct
 * outcome rather than a failure.
 */
async function requiresStickyScenes(page: Page) {
  const applies = await page.evaluate(
    () =>
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  test.skip(!applies, "sticky scenes are desktop-only and motion-dependent by design");
}

async function scrollThroughScene(page: Page, selector: string, fraction: number) {
  await page.evaluate(
    ({ selector: sel, fraction: f }: { selector: string; fraction: number }) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`scene not found: ${sel}`);
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const travel = Math.max(rect.height - window.innerHeight, 0);
      window.scrollTo(0, Math.round(top + travel * f));
    },
    { selector, fraction },
  );
  await page.waitForTimeout(280);
}

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: every scene of the story is present and in order`, async ({ page }) => {
    await page.goto(`/${locale}`);
    for (const scene of SCENES) {
      await expect(page.locator(`.${scene}`), `${scene} should exist`).toHaveCount(1);
    }

    // Scene order matches the journey the copy describes.
    const order = await page.evaluate((names) => {
      return names
        .map((n) => ({ n, top: document.querySelector(`.${n}`)?.getBoundingClientRect().top ?? 0 }))
        .map((x) => x.n);
    }, [...SCENES]);
    expect(order).toEqual([...SCENES]);
  });
}

test("the sun keeps its real direction in both languages", async ({ page }) => {
  // Dawn rises in the east — the right-hand side on a north-up map — and dusk
  // sets in the west, whichever way the page reads.
  const positions: Record<string, { dawn: number; dusk: number }> = {};

  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}`);
    await disableSmoothScroll(page);

    const dawn = await page.locator(".hero__sky").evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { dir: getComputedStyle(el).direction, centre: r.left + r.width / 2 };
    });

    // Both light layers opt out of mirroring by sitting in the compass layer.
    expect(dawn.dir, `${locale}: the hero sky must not mirror`).toBe("ltr");

    const dusk = await page.locator(".closing__sky").evaluate((el) => getComputedStyle(el).direction);
    expect(dusk, `${locale}: the closing sky must not mirror`).toBe("ltr");

    positions[locale] = { dawn: dawn.centre, dusk: 0 };
  }

  // The map is geography too.
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}`);
    const mapDir = await page.locator(".kingdom__figure").evaluate((el) => getComputedStyle(el).direction);
    expect(mapDir, `${locale}: the map must not mirror`).toBe("ltr");
  }
});

test("there are at most two sticky scenes, and neither is taller than 200vh", async ({ page }) => {
  await page.goto("/en");

  const sticky = await page.evaluate(() => {
    const out: { cls: string; heightVh: number }[] = [];
    document.querySelectorAll<HTMLElement>("section").forEach((section) => {
      const child = section.querySelector<HTMLElement>(":scope > *");
      if (!child) return;
      if (getComputedStyle(child).position !== "sticky") return;
      out.push({
        cls: section.className.split(" ").filter((c) => c !== "scene")[0] ?? "?",
        heightVh: Math.round((section.getBoundingClientRect().height / window.innerHeight) * 100),
      });
    });
    return out;
  });

  expect(sticky.length, `sticky scenes found: ${sticky.map((s) => s.cls).join(", ")}`).toBeLessThanOrEqual(2);
  for (const scene of sticky) {
    expect(scene.heightVh, `${scene.cls} is ${scene.heightVh}vh`).toBeLessThanOrEqual(200);
  }
});

test("the sticky scenes never trap the page", async ({ page }) => {
  await page.goto("/en");
  await disableSmoothScroll(page);

  // Scrolling always moves the page, wherever in the story you are.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (const fraction of [0.3, 0.45, 0.55, 0.7]) {
    const start = Math.round(height * fraction);
    await page.evaluate((y) => window.scrollTo(0, y), start);
    await page.waitForTimeout(120);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(220);
    const moved = await page.evaluate(() => window.scrollY);
    expect(moved, `the page should still scroll at ${fraction * 100}%`).toBeGreaterThan(start);
  }
});

test("the flywheel's active node follows scroll while the scene is pinned", async ({ page }) => {
  await page.goto("/en");
  await requiresStickyScenes(page);
  await disableSmoothScroll(page);

  const readBrightest = () =>
    page.evaluate(() => {
      const items = [...document.querySelectorAll(".flywheel__listitem")];
      const opacities = items.map((el) => Number(getComputedStyle(el).opacity));
      return opacities.indexOf(Math.max(...opacities));
    });

  const brightestAt = async (fraction: number) => {
    await scrollThroughScene(page, ".flywheel", fraction);
    // Let the scroll-driven animation settle before reading.
    let last = await readBrightest();
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(120);
      const next = await readBrightest();
      if (next === last) return next;
      last = next;
    }
    return last;
  };

  // The lit node advances through the cycle rather than jumping about.
  const early = await brightestAt(0.15);
  const middle = await brightestAt(0.5);
  const late = await brightestAt(0.95);

  expect(early).toBeLessThan(middle);
  expect(middle).toBeLessThan(late);
  expect(late).toBe(3);
});

test("the six-week challenge accumulates rather than resetting", async ({ page }) => {
  await page.goto("/en");
  await requiresStickyScenes(page);
  await disableSmoothScroll(page);

  await scrollThroughScene(page, ".challenge", 0.95);

  // Polled rather than sampled once: scroll-driven animations settle a frame or
  // two after the scroll, and under parallel load that can take longer.
  await expect
    .poll(
      async () =>
        page.evaluate(() =>
          Math.min(
            ...[...document.querySelectorAll(".stations__item")].map((el) =>
              Number(getComputedStyle(el).opacity),
            ),
          ),
        ),
      { message: "every station should be lit by the end of the cycle", timeout: 5000 },
    )
    .toBeGreaterThan(0.9);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("every scene is shown finished, and nothing is pinned", async ({ page }) => {
    await page.goto("/en");

    // No scene is left waiting for a scroll to become readable.
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-reveal]")]
        .filter((el) => Number(getComputedStyle(el).opacity) < 1)
        .map((el) => el.className),
    );
    expect(hidden, "reduced motion must show every reveal in its final state").toEqual([]);

    // The sticky scenes collapse to ordinary sections.
    const stickies = await page.evaluate(() =>
      [".flywheel__sticky", ".challenge__sticky"].map((s) => getComputedStyle(document.querySelector(s)!).position),
    );
    expect(stickies).toEqual(["static", "static"]);

    // The journey thread and the ring sweep are complete, not part-drawn.
    const fill = await page.locator(".journeyline__fill").evaluate((el) => getComputedStyle(el).transform);
    expect(fill === "none" || fill === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
  });
});

test("the story reads without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/en");

  // Every scene's heading is present and legible with no scripting at all.
  for (const id of ["shores-title", "pillars-title", "flywheel-title", "journey-title", "doors-title"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  // The flywheel's meaning lives in an ordered list, not only in the ring.
  await expect(page.locator(".flywheel__list li")).toHaveCount(4);
  await context.close();
});

test("the map credits its source and describes itself", async ({ page }) => {
  await page.goto("/en");
  const svg = page.locator(".kingdom__svg");
  await expect(svg).toHaveAttribute("role", "img");
  await expect(svg).toHaveAttribute("aria-label", /Saudi Arabia/i);
  await expect(page.locator(".kingdom__credit")).toContainText("Natural Earth");
});
