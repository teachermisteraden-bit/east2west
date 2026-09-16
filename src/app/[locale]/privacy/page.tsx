import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { site, isSet } from "@/config/site";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/privacy", namespace: "privacy", titleKey: "title" });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <>
      <PageIntro title={t("title")} />

      <Section rule={false}>
        {/* Flagged as a draft on the page itself, not just in a comment. The
            owner confirms the wording with an adviser before launch, and the
            visitor can see that this is still being reviewed. */}
        <p className="placeholder-note measure">{t("draftNote")}</p>

        <div className="prose" style={{ marginBlockStart: "2.5rem" }}>
          <p>{t("body")}</p>
          {isSet(site.email) && (
            <p>
              <a className="navlink" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
