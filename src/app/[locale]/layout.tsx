import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getLocale, activeLocales } from "@/i18n/locales";
import { preload } from "react-dom";
import { displayFontFor, bodyFontFor } from "@/styles/fonts";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { ThemeScript } from "@/components/ui/ThemeScript";
import { RevealScript } from "@/components/scenes/RevealScript";
import { Analytics } from "@/components/ui/Analytics";
import { Cursor } from "@/components/ui/Cursor";
import { OrganizationData } from "@/components/ui/StructuredData";

import "@/styles/globals.css";

/**
 * Namespaces sent to the browser.
 *
 * Without this, next-intl serialises the ENTIRE catalogue into every page's RSC
 * payload — 9 KB gzipped in Arabic, around 60% of the page's transfer, for
 * strings no client component reads. Pages are server-rendered, so only
 * namespaces used by a "use client" component belong here.
 *
 * The form is a client component, so it needs its own strings, the confirmation
 * card's, the share labels, and the programme names it offers as interests.
 */
const CLIENT_NAMESPACES = ["common", "join", "confirmation", "share", "programmes", "newsletter", "footer"] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  // hreflang for every shipped locale, so a new language needs no metadata edit.
  const languages = Object.fromEntries(activeLocales.map((l) => [l.code, `/${l.code}`]));

  return {
    metadataBase: new URL(site.url),
    title: { default: t("siteName"), template: `%s · ${t("shortName")}` },
    description: t("description"),
    alternates: { canonical: `/${locale}`, languages },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("siteName"),
      description: t("description"),
      locale,
    },
    robots: { index: true, follow: true },
    manifest: "/manifest.webmanifest",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for this locale segment.
  setRequestLocale(locale);

  const def = getLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });

  // Preload only this locale's faces. The others are never fetched at all,
  // because their @font-face rules carry a unicode-range this page does not use.
  // react-dom's preload emits exactly one tag; a <link> in JSX gets hoisted AND
  // rendered, which produced two.
  preload(displayFontFor(def.script), { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload(bodyFontFor(def.script), { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  const all = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in all).map((ns) => [ns, all[ns]]),
  );

  return (
    <html
      lang={locale}
      dir={def.dir}
      data-script={def.script}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <RevealScript />
      </head>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <a className="skip-link" href="#main">
            {t("skipToContent")}
          </a>
          <SiteHeader locale={locale} />
          <main id="main">{children}</main>
          <SiteFooter locale={locale} />
          <OrganizationData locale={locale} />
          <Cursor />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
