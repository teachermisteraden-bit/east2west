import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { namedItems, lines } from "@/lib/messages";
import { site, pick } from "@/config/site";
import { flags } from "@/config/flags";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { CardGrid, PlainList } from "@/components/ui/CardGrid";
import { Steps } from "@/components/ui/Steps";
import { Frame } from "@/components/ui/Frame";
import { Invitation } from "@/components/ui/Invitation";
import { SiteFaq } from "@/components/ui/SiteFaq";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/businesses",
    namespace: "businesses",
    titleKey: "title",
    descriptionKey: "subtitle",
  });
}

export default async function BusinessesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("businesses");
  const tc = await getTranslations("common");

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} door="businesses" />

      {/* Three ways in, so a business self-selects rather than being sold one thing. */}
      <Section title={t("waysTitle")}>
        <CardGrid columns={3} items={namedItems(t, "ways")} />
      </Section>

      {/* The signature offer, and the answer to "another networking event that
          wastes my time": you meet future hires while they work. */}
      <Section tone="dark" title={t("challenge.title")} rule={false}>
        <div className="prose">
          <p>{t("challenge.body")}</p>
        </div>
      </Section>

      <Section title={t("whoTitle")}>
        <PlainList items={lines(t, "who")} columns={2} />
        <h3 className="section__title" style={{ marginBlock: "3rem 1.5rem", fontSize: "var(--text-h3)" }}>
          {t("gainTitle")}
        </h3>
        <PlainList items={lines(t, "gain")} columns={2} />
      </Section>

      {/* Truthful scarcity (02): one seat per industry is a real rule of the
          Business Circle, not a countdown. A live count appears only when the
          flag is on AND the database has real numbers — never an invented one. */}
      <Section tone="quiet">
        <Frame className="seat">
          <p className="seat__line">{t("seat")}</p>
          {flags.liveCounters && (
            <p className="seat__count">{/* Phase 5: real remaining seats, from the database. */}</p>
          )}
        </Frame>
      </Section>

      <Section title={t("stepsTitle")}>
        <Steps items={namedItems(t, "steps")} />
      </Section>

      <SiteFaq locale={locale} />

      <Invitation
        title={t("cta")}
        note={t("ctaNote")}
        cta={t("cta")}
        href="/join?type=business"
        reassurance={tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
        microYes={t("microYes")}
        microYesHref="/join?type=business"
      />
    </>
  );
}
