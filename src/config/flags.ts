/**
 * Feature flags. Everything is off by default except the WebGL hero, whose
 * absence must be invisible anyway (04 — the static hero stands on its own).
 */
export const flags = {
  liveCounters: process.env.FLAG_LIVE_COUNTERS === "true",
  abTests: process.env.FLAG_AB_TESTS === "true",
  ramadanMode: process.env.FLAG_RAMADAN_MODE === "true",
  webglHero: process.env.FLAG_WEBGL_HERO !== "false",
  arabicIndicDigits: process.env.FLAG_ARABIC_INDIC_DIGITS === "true",
  analytics: process.env.ANALYTICS_ENABLED === "true",
} as const;
