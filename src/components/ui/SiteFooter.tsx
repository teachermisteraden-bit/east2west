import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Wordmark } from "@/components/brand/Wordmark";
import { audienceNav, aboutNav, utilityNav } from "@/config/nav";
import { site, isSet, pick } from "@/config/site";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

/** Social links render only when the owner has supplied a URL. */
function socialLinks() {
  return (
    [
      { key: "linkedin", label: "LinkedIn", href: site.social.linkedin },
      { key: "instagram", label: "Instagram", href: site.social.instagram },
      { key: "x", label: "X", href: site.social.x },
      { key: "snapchat", label: "Snapchat", href: site.social.snapchat },
    ] as const
  ).filter((s) => isSet(s.href));
}

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations("nav");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");
  const tcontact = await getTranslations("contact");
  const socials = socialLinks();

  return (
    <footer className="sitefooter on-dark">
      <div className="shell sitefooter__inner">
        <div className="sitefooter__brand">
          <Wordmark size="md" />
          {/* Required in the hero eyebrow and the footer (04). */}
          <p className="sitefooter__founded">{tc("founded")}</p>
          <p className="sitefooter__stage">{tc("foundingStage")}</p>
        </div>

        <nav className="sitefooter__nav" aria-label={t("menu")}>
          <ul>
            {audienceNav.map((i) => (
              <li key={i.key}>
                <Link href={i.href} className="navlink">
                  {t(i.key)}
                </Link>
              </li>
            ))}
          </ul>
          <ul>
            {aboutNav.map((i) => (
              <li key={i.key}>
                <Link href={i.href} className="navlink">
                  {t(i.key)}
                </Link>
              </li>
            ))}
          </ul>
          <ul>
            {utilityNav.map((i) => (
              <li key={i.key}>
                <Link href={i.href} className="navlink">
                  {t(i.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sitefooter__contact">
          <p className="sitefooter__contactline">{tc("contactLine")}</p>
          {isSet(site.whatsappCommunity) && (
            <p>
              <a
                className="navlink"
                href={site.whatsappCommunity}
                rel="noopener noreferrer"
                target="_blank"
              >
                {tcontact("chat")}
              </a>
            </p>
          )}
          {isSet(site.email) && (
            <p>
              <a className="navlink" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          )}
          {socials.length > 0 && (
            <ul className="sitefooter__social">
              {socials.map((s) => (
                <li key={s.key}>
                  <a className="navlink" href={s.href} rel="me noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="shell sitefooter__newsletter">
        <NewsletterForm locale={locale} />
      </div>

      <hr className="hairline" />
      <div className="shell sitefooter__base">
        <p>{tf("rights", { year: new Date().getFullYear() })}</p>
        <p className="sitefooter__response">
          {tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
        </p>
      </div>
    </footer>
  );
}
