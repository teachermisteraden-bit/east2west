/**
 * Guards the origin that every absolute URL on the site is built from.
 *
 * Deploying without SITE_URL used to publish http://localhost:3000 as the
 * canonical URL of every page, in the sitemap and in every hreflang alternate.
 * Nothing looks broken when that happens; the site just quietly asks not to be
 * indexed. These cases are cheap to assert and expensive to get wrong.
 *
 * Run with: npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";

/** Mirrors the resolution order in src/config/site.ts. */
const resolve = (env) => {
  const isSet = (v) => typeof v === "string" && v.trim().length > 0;
  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL ?? env.VERCEL_URL;
  return isSet(env.SITE_URL)
    ? env.SITE_URL.replace(/\/$/, "")
    : isSet(vercelHost)
      ? `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
      : "http://localhost:3000";
};

test("an explicit SITE_URL wins over everything", () => {
  assert.equal(
    resolve({ SITE_URL: "https://east2west.org", VERCEL_URL: "x.vercel.app" }),
    "https://east2west.org",
  );
});

test("a trailing slash never doubles up in a built URL", () => {
  assert.equal(resolve({ SITE_URL: "https://east2west.org/" }), "https://east2west.org");
});

test("a Vercel deploy with no SITE_URL uses the production domain, not localhost", () => {
  assert.equal(
    resolve({ VERCEL_PROJECT_PRODUCTION_URL: "east2westds.vercel.app" }),
    "https://east2westds.vercel.app",
  );
});

test("a preview points its canonical at production rather than competing with it", () => {
  assert.equal(
    resolve({
      VERCEL_PROJECT_PRODUCTION_URL: "east2westds.vercel.app",
      VERCEL_URL: "east2westds-git-branch.vercel.app",
    }),
    "https://east2westds.vercel.app",
  );
});

test("a deployment URL still beats publishing localhost", () => {
  assert.equal(
    resolve({ VERCEL_URL: "east2westds-abc123.vercel.app" }),
    "https://east2westds-abc123.vercel.app",
  );
});

test("localhost is only reachable when nothing else is set", () => {
  assert.equal(resolve({}), "http://localhost:3000");
});

test("a host that already carries a scheme is not double-prefixed", () => {
  assert.equal(
    resolve({ VERCEL_URL: "https://east2westds.vercel.app" }),
    "https://east2westds.vercel.app",
  );
});
