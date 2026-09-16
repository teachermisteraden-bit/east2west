"use client";

import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { activeLocales } from "@/i18n/locales";

/**
 * Keeps the visitor on the equivalent page when switching language.
 * `usePathname` from next-intl returns the pathname without the locale prefix,
 * so the same path is simply re-rendered under the other locale.
 *
 * With two locales this is a direct swap. With three or more it becomes a list,
 * which is why it reads from the registry rather than hardcoding en/ar.
 */
export function LanguageSwitch({ locale, label }: { locale: string; label: string }) {
  const pathname = usePathname();
  const others = activeLocales.filter((l) => l.code !== locale);

  if (others.length === 1) {
    const other = others[0]!;
    return (
      <Link href={pathname} locale={other.code} className="langswitch" lang={other.code} hrefLang={other.code}>
        {label}
      </Link>
    );
  }

  return (
    <ul className="langswitch__list">
      {others.map((l) => (
        <li key={l.code}>
          <Link href={pathname} locale={l.code} className="langswitch" lang={l.code} hrefLang={l.code}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
