import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { lines } from "@/lib/messages";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { CardGrid } from "@/components/ui/CardGrid";
import { Steps } from "@/components/ui/Steps";
import { programmes, type Stage } from "@/content/programmes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/programmes",
    namespace: "programmes",
    titleKey: "title",
    descriptionKey: "intro",
  });
}

const STAGES: Stage[] = ["learn", "connect", "build", "earn"];

export default async function ProgrammesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("programmes");
  const th = await getTranslations("home");

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("intro")} />

      {/* Grouped by the stage of the journey each one serves, so the nine read as
          one path rather than a menu. Order comes from content/programmes.ts. */}
      {STAGES.map((stage) => {
        const inStage = programmes.filter((p) => p.stage === stage);
        if (inStage.length === 0) return null;
        return (
          <Section key={stage} eyebrow={th(`programmes.groups.${stage}`)}>
            <CardGrid
              columns={3}
              items={inStage.map((p) => ({
                name: t(`items.${p.key}.name`),
                body: t(`items.${p.key}.body`),
              }))}
            />
          </Section>
        );
      })}

      {/* The signature format. */}
      <Section
        tone="quiet"
        eyebrow={th("challenge.eyebrow")}
        title={th("challenge.title")}
        lead={th("challenge.intro")}
        rule={false}
      >
        <Steps
          items={lines(th, "challenge.steps").map((name) => ({ name }))}
          lastIsGoal={false}
        />
      </Section>
    </>
  );
}
