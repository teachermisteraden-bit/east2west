import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { namedItems, lines } from "@/lib/messages";
import { site, isSet, pick } from "@/config/site";
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
    path: "/graduates",
    namespace: "graduates",
    titleKey: "title",
    descriptionKey: "subtitle",
  });
}

/**
 * The arc from the master prompt §4:
 * outcome → empathy → the guide and the plan → what changes → what it takes →
 * proof (hidden until real) → honest FAQ → the invitation.
 */
export default async function GraduatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("graduates");
  const th = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <>
      {/* 1. Outcome. */}
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} door="graduates" />

      {/* 2. Empathy. The one permitted use of loss framing (02), and it names the
          problem without shaming anyone for having it. */}
      <Section title={t("problem.title")}>
        <div className="prose">
          <p>{t("problem.body")}</p>
        </div>
      </Section>

      {/* 3. The guide and the plan — the real six-step journey, not a sales funnel. */}
      <Section eyebrow={th("journey.eyebrow")} title={th("journey.title")}>
        <Steps items={namedItems(th, "journey.steps")} />
      </Section>

      {/* 4. What changes for you. */}
      <Section title={t("benefitsTitle")}>
        <CardGrid columns={3} items={namedItems(t, "benefits")} />
      </Section>

      {/* 5. What it takes — who can join, and what is genuinely free. */}
      <Section title={t("whoTitle")}>
        <PlainList items={lines(t, "who")} />
        <h3 className="section__title" style={{ marginBlock: "3rem 1.5rem", fontSize: "var(--text-h3)" }}>
          {t("goodTitle")}
        </h3>
        <PlainList items={lines(t, "good")} />
      </Section>

      {/* 6. Proof slots render nothing until real data exists — see
          components/proof/ProofSlot.tsx. Nothing is shown here yet. */}

      {/* 7. Honest FAQ. */}
      <SiteFaq locale={locale} />

      {/* 8. The invitation. */}
      <Invitation
        title={t("cta")}
        note={t("ctaNote")}
        cta={t("cta")}
        href="/join?type=graduate"
        reassurance={tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
        microYes={isSet(site.whatsappCommunity) ? t("microYes") : undefined}
        microYesHref={isSet(site.whatsappCommunity) ? site.whatsappCommunity : undefined}
      />
    </>
  );
}
