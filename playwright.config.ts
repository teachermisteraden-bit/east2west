import { defineConfig, devices } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PORT = Number(process.env.E2E_PORT ?? 3999);
const baseURL = `http://localhost:${PORT}`;

/**
 * Some CI images ship a preinstalled Chromium whose build number differs from the
 * one this Playwright expects. Prefer an explicit CHROMIUM_PATH, then any build
 * found in PLAYWRIGHT_BROWSERS_PATH, and otherwise let Playwright use its own.
 */
function findChromium(): string | undefined {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;

  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return undefined;

  for (const dir of readdirSync(root)) {
    if (!dir.startsWith("chromium-")) continue;
    const candidate = join(root, dir, "chrome-linux", "chrome");
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

const executablePath = findChromium();

/**
 * End-to-end coverage. The acceptance checklist requires every route in both
 * locales, every form mode, the /go redirects, reduced motion and RTL snapshots.
 * Phase 2 establishes route, locale and RTL coverage; Phase 3 adds the forms.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    // The environment ships Chromium; do not let Playwright fetch its own.
    launchOptions: { executablePath },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
