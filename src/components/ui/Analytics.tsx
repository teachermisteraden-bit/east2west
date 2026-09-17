import Script from "next/script";
import { flags } from "@/config/flags";

/**
 * Cookieless analytics, off unless ANALYTICS_ENABLED is true (04).
 *
 * No cookies, no cross-site identifier, no personal data — so there is nothing
 * to ask consent for, and nothing is loaded at all while the flag is off. The
 * tagged-events build lets links report themselves through class names, which
 * keeps our own JavaScript at zero.
 */
export function Analytics() {
  const domain = process.env.PLAUSIBLE_DOMAIN;
  if (!flags.analytics || !domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.tagged-events.js"
      strategy="afterInteractive"
    />
  );
}
