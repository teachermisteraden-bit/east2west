import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Page transitions use the native cross-document View Transitions API, declared
 * in CSS (`@view-transition { navigation: auto }`). That needs no JavaScript and
 * no framework flag, and browsers without support simply navigate normally.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
