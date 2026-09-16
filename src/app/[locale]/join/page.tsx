import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { site, pick } from "@/config/site";
import { Link } from "@/i18n/routing";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { Frame } from "@/components/ui/Frame";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/join", namespace: "join", titleKey: "title", descriptionKey: "intro" });
}

const MODES = ["graduate", "university", "sponsor", "business", "chapter"] as const;

/**
 * Mode selection. The form itself arrives in Phase 3.
 *
 * Commitment and consistency (02): the first question is the easiest one — "I am
 * a..." — and answering it is what starts the progress thread. The estimate in
 * the intro ("about 2 minutes") must stay accurate once the form exists.
 */
export default async function JoinPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("join");
  const tc = await getTranslations("common");
  const selected = MODES.find((m) => m === type);

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("intro")} />

      <Section title={t("iAm")} rule={false}>
        <ul className="cardgrid cardgrid--2 modes">
          {MODES.map((mode) => (
            <Frame as="li" key={mode} interactive className={selected === mode ? "modes__item is-selected" : "modes__item"}>
              <Link href={`/join?type=${mode}`} className="modes__link">
                <h2 className="cardgrid__name">{t(`modes.${mode}`)}</h2>
                <p className="cardgrid__body">{t(`submit.${mode}`)}</p>
              </Link>
            </Frame>
          ))}
        </ul>

        <p className="invitation__reassurance" style={{ marginBlockStart: "2rem" }}>
          {tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
        </p>

        <div className="shell stub" style={{ paddingInline: 0 }}>
          <p className="stub__badge">Phase 2 — the form itself is built in Phase 3.</p>
        </div>
      </Section>
    </>
  );
}
