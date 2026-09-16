import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { activeLocales } from "@/i18n/locales";

/**
 * Per-page bilingual metadata with hreflang alternates for every shipped locale.
 * Adding a language needs no edit here — the alternates come from the registry.
 */
export async function pageMetadata({
  locale,
  path,
  titleKey,
  descriptionKey,
  namespace,
}: {
  locale: string;
  path: string;
  namespace: string;
  titleKey: string;
  descriptionKey?: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const title = t(titleKey);
  const description = descriptionKey ? t(descriptionKey) : undefined;

  const languages = Object.fromEntries(activeLocales.map((l) => [l.code, `/${l.code}${path}`]));

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: `/${locale}${path}`, languages },
    openGraph: { title, ...(description ? { description } : {}), locale, type: "website" },
  };
}
