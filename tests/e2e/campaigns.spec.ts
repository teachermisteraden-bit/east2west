import { test, expect } from "@playwright/test";
import { campaignRoutes } from "../../src/lib/campaigns";

/**
 * The poster QR routes. Each must land on the right page, in a sensible language,
 * carrying UTM parameters so the launch can tell the five posters apart.
 */
for (const [campaign, target] of Object.entries(campaignRoutes)) {
  test(`/go/${campaign} redirects with UTM parameters`, async ({ page }) => {
    await page.goto(`/go/${campaign}`);

    const url = new URL(page.url());
    expect(url.pathname).toMatch(new RegExp(`^/(en|ar)${target.path === "/" ? "/?$" : target.path}$`));
    expect(url.searchParams.get("utm_source")).toBe("qr");
    expect(url.searchParams.get("utm_medium")).toBe("poster");
    expect(url.searchParams.get("utm_campaign")).toBe(target.utm_campaign);
  });
}

test("an explicit ?lang wins over the browser's preference", async ({ page }) => {
  await page.goto("/go/graduates?lang=ar");
  expect(new URL(page.url()).pathname).toBe("/ar/graduates");
});

test("a referral code survives the redirect", async ({ page }) => {
  await page.goto("/go/graduates?ref=abc123");
  expect(new URL(page.url()).searchParams.get("ref")).toBe("abc123");
});

test("an unknown campaign still lands somewhere real, never a 404", async ({ page }) => {
  const response = await page.goto("/go/not-a-campaign");
  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toMatch(/^\/(en|ar)\/?$/);
});

test("the campaign is remembered for the form to pick up", async ({ page, context }) => {
  await page.goto("/go/sponsors");
  const cookie = (await context.cookies()).find((c) => c.name === "e2w_campaign");
  expect(cookie?.value).toBe("sponsors");
});
