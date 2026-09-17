import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { namedItems, lines } from "@/lib/messages";
import { site, pick } from "@/config/site";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { CardGrid, PlainList } from "@/components/ui/CardGrid";
import { Frame } from "@/components/ui/Frame";
import { Invitation } from "@/components/ui/Invitation";
import { SiteFaq } from "@/components/ui/SiteFaq";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/sponsors",
    namespace: "sponsors",
    titleKey: "title",
    descriptionKey: "subtitle",
  });
}

export default async function SponsorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sponsors");
  const tc = await getTranslations("common");

  // What the quarterly report will contain. Deliberately unnumbered: the society
  // has no activity to report yet, and inventing a figure — even a plausible one —
  // would be the single most damaging thing this page could do.
  const reportRows = lines(t, "receive");

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} door="sponsors" />

      <Section title={t("whyTitle")}>
        <CardGrid columns={2} items={namedItems(t, "why")} />
      </Section>

      {/* Six options described by what they include. No prices anywhere: the
          society has not set them, so the conversation decides (non-negotiable 1). */}
      <Section tone="quiet" title={t("optionsTitle")}>
        <CardGrid columns={3} items={namedItems(t, "options")} />
      </Section>

      <Section title={t("receiveTitle")}>
        <PlainList items={reportRows} columns={2} />
      </Section>

      {/* The impact report, shown as a layout rather than as results. Every
          figure position carries the "illustrative" label. */}
      <Section title={t("reportTitle")}>
        <div className="prose">
          <p>{t("report")}</p>
        </div>
        <Frame className="report">
          <p className="report__label eyebrow">{t("illustrative")}</p>
          <ul className="report__grid">
            {reportRows.map((row, i) => (
              <li className="report__row" key={i}>
                <span>{row}</span>
                {/* A rule where a figure will go. Deliberately not a number. */}
                <span className="report__rule" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </Frame>
      </Section>

      <SiteFaq locale={locale} />

      <Invitation
        title={t("cta")}
        note={t("ctaNote")}
        cta={t("cta")}
        href="/join?type=sponsor"
        reassurance={tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
        microYes={t("microYes")}
        microYesHref="/downloads"
      />
    </>
  );
}
