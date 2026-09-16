/**
 * The locale registry — the single place a new language is added.
 *
 * Roadmap: Madinah pilot → all of Saudi Arabia → other Muslim countries.
 * Adding a language is a two-step change: add `messages/<code>.json`, then flip
 * `enabled` to true here. Routing, `lang`/`dir`, fonts, the language switch,
 * the sitemap, `hreflang`, form validation and the database constraint all
 * derive from this file, so nothing else needs editing.
 *
 * A locale stays disabled until its copy is complete and human-written. We never
 * ship a half-translated language.
 */
export type LocaleCode = string;

export type LocaleDef = {
  /** BCP-47 code, used for `lang`, `hreflang` and Intl. */
  code: LocaleCode;
  dir: "ltr" | "rtl";
  /** Endonym — how speakers write the language's own name. */
  label: string;
  /** Which display/body font pairing this locale uses. */
  script: "latin" | "arabic";
  /** Secondary calendar shown alongside Gregorian dates. */
  secondaryCalendar?: string;
  enabled: boolean;
};

export const LOCALE_REGISTRY: readonly LocaleDef[] = [
  {
    code: "en",
    dir: "ltr",
    label: "English",
    script: "latin",
    secondaryCalendar: "islamic-umalqura",
    enabled: true,
  },
  {
    code: "ar",
    dir: "rtl",
    label: "العربية",
    script: "arabic",
    secondaryCalendar: "islamic-umalqura",
    enabled: true,
  },
  // Planned as the society reaches beyond the Kingdom. Each stays disabled
  // until a native speaker has written and reviewed its copy.
  { code: "tr", dir: "ltr", label: "Türkçe", script: "latin", secondaryCalendar: "islamic-umalqura", enabled: false },
  { code: "ur", dir: "rtl", label: "اردو", script: "arabic", secondaryCalendar: "islamic-umalqura", enabled: false },
  { code: "id", dir: "ltr", label: "Bahasa Indonesia", script: "latin", secondaryCalendar: "islamic-umalqura", enabled: false },
  { code: "ms", dir: "ltr", label: "Bahasa Melayu", script: "latin", secondaryCalendar: "islamic-umalqura", enabled: false },
  { code: "fr", dir: "ltr", label: "Français", script: "latin", secondaryCalendar: "islamic-umalqura", enabled: false },
] as const;

export const activeLocales: readonly LocaleDef[] = LOCALE_REGISTRY.filter((l) => l.enabled);

/** Locale codes that are routed and built. */
export const locales: readonly LocaleCode[] = activeLocales.map((l) => l.code);

export const defaultLocale: LocaleCode = "en";

export function isLocale(value: unknown): value is LocaleCode {
  return typeof value === "string" && locales.includes(value);
}

export function getLocale(code: LocaleCode): LocaleDef {
  const found = activeLocales.find((l) => l.code === code);
  if (!found) throw new Error(`Unknown or disabled locale: ${code}`);
  return found;
}

export const localeDir = (code: LocaleCode): "ltr" | "rtl" => getLocale(code).dir;
