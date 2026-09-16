import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { namedItems, lines } from "@/lib/messages";
import { site, pick } from "@/config/site";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { CardGrid, PlainList } from "@/components/ui/CardGrid";
import { Steps } from "@/components/ui/Steps";
import { Invitation } from "@/components/ui/Invitation";
import { SiteFaq } from "@/components/ui/SiteFaq";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/universities",
    namespace: "universities",
    titleKey: "title",
    descriptionKey: "subtitle",
  });
}

export default async function UniversitiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("universities");
  const tc = await getTranslations("common");

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      {/* What changes for the university. */}
      <Section title={t("bringTitle")}>
        <CardGrid columns={3} items={namedItems(t, "bring")} />
      </Section>

      {/* What it takes, stated before the ask — the core fear here is an unknown
          group creating risk, so the cost is small, specific and up front. */}
      <Section tone="quiet" title={t("askTitle")}>
        <PlainList items={lines(t, "ask")} columns={2} />
      </Section>

      <Section title={t("gainTitle")}>
        <PlainList items={lines(t, "gain")} columns={2} />
      </Section>

      {/* The plan, with reporting as the final step. */}
      <Section title={t("stepsTitle")}>
        <Steps items={namedItems(t, "steps")} />
      </Section>

      <SiteFaq locale={locale} />

      <Invitation
        title={t("cta")}
        note={t("ctaNote")}
        cta={t("cta")}
        href="/join?type=university"
        reassurance={tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
        microYes={t("microYes")}
        microYesHref="/downloads"
      />
    </>
  );
}
