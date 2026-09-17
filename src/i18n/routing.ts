import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { defaultLocale, locales } from "./locales";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  // Always prefix, so /en and /ar are visibly equal and neither is the "real" site.
  localePrefix: "always",
  localeDetection: true,
  /**
   * Off, because the `<head>` already carries every hreflang alternate, built by
   * lib/metadata.ts from SITE_URL.
   *
   * Left on, next-intl advertises the same alternates a second time as HTTP
   * `Link:` headers derived from the *request* host. Whenever the request host
   * is not SITE_URL -- every Vercel preview URL, the *.vercel.app host before a
   * custom domain is attached, anything behind a proxy -- a crawler is handed
   * two conflicting sets of alternates for one page, and Lighthouse's canonical
   * audit fails with "points to another hreflang location", because the
   * canonical origin and the header origin genuinely disagree.
   *
   * The head wins because that is where SITE_URL governs the origin.
   */
  alternateLinks: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
