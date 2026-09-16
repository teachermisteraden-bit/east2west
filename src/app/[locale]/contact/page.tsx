import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { site, isSet, pick } from "@/config/site";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { Invitation } from "@/components/ui/Invitation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/contact", namespace: "contact", titleKey: "title", descriptionKey: "intro" });
}

/** WhatsApp click-to-chat, built from the configured number. */
function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");

  const hasEmail = isSet(site.email);
  const hasPhone = isSet(site.phone);

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("intro")} />

      <Section>
        <dl className="deflist">
          <div className="deflist__row">
            <dt className="deflist__label">{tc("contactLine")}</dt>
            <dd className="deflist__value">
              {pick(site.contactName, locale)} — {pick(site.contactRole, locale)}
            </dd>
          </div>

          {/* Each channel appears only once the owner has configured it. An
              unconfigured channel shows nothing rather than a broken link. */}
          {hasEmail && (
            <div className="deflist__row">
              <dt className="deflist__label">{t("email")}</dt>
              <dd className="deflist__value">
                <a className="navlink" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
          )}

          {hasPhone && (
            <div className="deflist__row">
              <dt className="deflist__label">{t("whatsapp")}</dt>
              <dd className="deflist__value">
                <a className="navlink" href={whatsappHref(site.phone)} rel="noopener noreferrer" target="_blank">
                  {t("chat")}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {/* If nothing is configured yet, the form is still a real way through —
            never a page that offers no way to reach anyone. */}
        {!hasEmail && !hasPhone && <p className="placeholder-note measure">{tc("foundingStage")}</p>}
      </Section>

      <Invitation
        title={t("intro")}
        cta={t("title")}
        href="/join"
        reassurance={tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
      />
    </>
  );
}
