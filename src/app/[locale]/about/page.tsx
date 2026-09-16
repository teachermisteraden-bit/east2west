import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { lines } from "@/lib/messages";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { CardGrid, PlainList } from "@/components/ui/CardGrid";
import { SiteFaq } from "@/components/ui/SiteFaq";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/about", namespace: "about", titleKey: "title" });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tv = await getTranslations("values");
  const tc = await getTranslations("common");

  const valueKeys = ["cooperation", "trust", "excellence", "benefit"] as const;
  const structureKeys = [
    "graduateCircles",
    "womensCircles",
    "businessCircle",
    "foundersForum",
    "campusChapters",
    "cityChapters",
  ] as const;

  return (
    <>
      <PageIntro title={t("title")} />

      {/* Vision, mission, promise — the society in its own words. */}
      <Section>
        <dl className="deflist">
          {(["vision", "mission", "promise"] as const).map((key) => (
            <div className="deflist__row" key={key}>
              <dt className="deflist__label">{t(`${key}.label`)}</dt>
              <dd className="deflist__value measure">{t(`${key}.body`)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={t("whyNow.title")}>
        <div className="prose">
          <p>{t("whyNow.body")}</p>
        </div>
      </Section>

      <Section title={tv("title")}>
        <CardGrid
          columns={2}
          items={valueKeys.map((key) => ({ name: tv(`${key}.name`), body: tv(`${key}.body`) }))}
        />
      </Section>

      {/* Lessons expressed as principles. The organisations studied are never
          named in public copy (03 §4). */}
      <Section title={t("principles.title")}>
        <PlainList items={lines(t, "principles.items")} columns={2} />
      </Section>

      <Section title={t("structure.title")}>
        <PlainList items={structureKeys.map((key) => t(`structure.items.${key}`))} columns={2} />
      </Section>

      <Section title={t("governance.title")}>
        <div className="prose">
          <p>{t("governance.body")}</p>
        </div>
      </Section>

      <Section title={t("roadmap.title")}>
        <div className="prose">
          <p>{t("roadmap.year1")}</p>
          <p>{t("roadmap.year2")}</p>
        </div>
      </Section>

      {/* The founding-stage truth, stated plainly rather than buried. */}
      <Section title={t("founderNote.title")}>
        <p className="placeholder-note measure">{t("founderNote.placeholder")}</p>
        <div className="prose" style={{ marginBlockStart: "2rem" }}>
          <p>{tc("foundingStage")}</p>
        </div>
      </Section>

      <SiteFaq locale={locale} />
    </>
  );
}
