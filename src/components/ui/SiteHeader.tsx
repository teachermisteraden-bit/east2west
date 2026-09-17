import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Wordmark } from "@/components/brand/Wordmark";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { audienceNav, aboutNav, joinHref } from "@/config/nav";

/**
 * One primary action per view (Hick's law, 02): "Apply" is the only filled
 * button in the header. Everything else is a quiet link.
 *
 * The small-screen menu is a native <details> disclosure — keyboard accessible
 * with no JavaScript, and it is a panel rather than a modal, so it needs no
 * focus trap.
 */
export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations("nav");
  const tc = await getTranslations("common");
  const items = [...audienceNav, ...aboutNav];

  return (
    <header className="siteheader">
      <div className="shell siteheader__inner">
        <Link href="/" className="siteheader__brand" aria-label={t("home")}>
          <Wordmark size="sm" uid="header" />
        </Link>

        <nav className="siteheader__nav" aria-label={t("menu")}>
          <ul>
            {items.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="navlink">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="siteheader__actions">
          {/* Always visible, at every breakpoint. */}
          <LanguageSwitch locale={locale} label={tc("languageSwitch")} />
          <div className="siteheader__desktoponly">
            <ThemeToggle label={tc("themeToggle")} />
            <Link href={joinHref} className="btn btn--primary btn--sm">
              {t("join")}
            </Link>
          </div>
        </div>

        <details className="siteheader__disclosure">
          <summary aria-label={t("menu")}>
            <span aria-hidden="true" className="siteheader__bars" />
          </summary>
          <div className="siteheader__panel">
            <nav aria-label={t("menu")}>
              <ul>
                {items.map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className="navlink">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="siteheader__panelactions">
              <ThemeToggle label={tc("themeToggle")} />
            </div>
            <Link href={joinHref} className="btn btn--primary">
              {t("join")}
            </Link>
          </div>
        </details>
      </div>
      <hr className="hairline" />
    </header>
  );
}
