import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { site, pick } from "@/config/site";
import { Link } from "@/i18n/routing";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { Frame } from "@/components/ui/Frame";
import { JoinForm } from "@/components/forms/JoinForm";
import { MODES, isMode } from "@/lib/form-steps";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/join", namespace: "join", titleKey: "title", descriptionKey: "intro" });
}

/**
 * Deep-linkable per mode: /join?type=university.
 *
 * Commitment and consistency (02): the easiest question — "I am a…" — is asked
 * first and on its own. Answering it is what starts the thread, and the first
 * node arrives already filled because the visitor genuinely completed a step.
 */
export default async function JoinPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("join");
  const tc = await getTranslations("common");
  const mode = isMode(type) ? type : null;

  if (mode) {
    return (
      <>
        <PageIntro title={t("title")} subtitle={t("intro")} />
        <Section rule={false}>
          <JoinForm
            mode={mode}
            locale={locale}
            responseTime={pick(site.responseTime, locale)}
            typeNoun={t(`typeNoun.${mode}`)}
          />
        </Section>
      </>
    );
  }

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("intro")} />

      <Section title={t("iAm")} rule={false}>
        <ul className="cardgrid cardgrid--2 modes">
          {MODES.map((m) => (
            <Frame as="li" key={m} interactive className="modes__item">
              <Link href={`/join?type=${m}`} className="modes__link">
                <h2 className="cardgrid__name">{t(`modes.${m}`)}</h2>
                <p className="cardgrid__body">{t(`submit.${m}`)}</p>
              </Link>
            </Frame>
          ))}
        </ul>

        <p className="invitation__reassurance" style={{ marginBlockStart: "2rem" }}>
          {tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
        </p>
      </Section>
    </>
  );
}
