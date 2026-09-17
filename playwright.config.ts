import { defineConfig, devices } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PORT = Number(process.env.E2E_PORT ?? 3999);
const STUB_PORT = Number(process.env.STUB_PORT ?? 4999);
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
  webServer: [
    {
      // Stands in for Supabase's REST API so the real submission path can be
      // exercised end to end. See tests/e2e/fixtures/supabase-stub.mjs.
      command: "node tests/e2e/fixtures/supabase-stub.mjs",
      url: `http://localhost:${STUB_PORT}/__stub/received`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `npx next start -p ${PORT}`,
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: `http://localhost:${STUB_PORT}`,
        SUPABASE_SERVICE_ROLE_KEY: "stub-service-role-key",
        RATE_LIMIT_SALT: "test-salt",
        ADMIN_PASSWORD: "e2e-admin-password",
        ADMIN_SESSION_SECRET: "e2e-admin-session-secret-value",
        RESPONSE_TIME_EN: "3 working days",
        RESPONSE_TIME_AR: "3 أيام عمل",
        SITE_URL: baseURL,
      },
    },
  ],
});
