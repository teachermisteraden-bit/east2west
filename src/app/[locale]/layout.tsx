import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getLocale, activeLocales } from "@/i18n/locales";
import { fontVariables } from "@/styles/fonts";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { ThemeScript } from "@/components/ui/ThemeScript";
import { RevealScript } from "@/components/scenes/RevealScript";

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

  const all = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in all).map((ns) => [ns, all[ns]]),
  );

  return (
    <html
      lang={locale}
      dir={def.dir}
      data-script={def.script}
      // The font variables must sit on <html>: tokens.css composes the display and
      // body stacks at :root, so they have to resolve there.
      className={fontVariables}
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
