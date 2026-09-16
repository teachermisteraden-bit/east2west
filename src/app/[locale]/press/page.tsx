import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { Wordmark } from "@/components/brand/Wordmark";
import { Frame } from "@/components/ui/Frame";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/press", namespace: "press", titleKey: "title", descriptionKey: "boilerplate" });
}

/** The palette, straight from the tokens so this page can never drift from it. */
const SWATCHES = [
  { token: "--palm", name: "Palm" },
  { token: "--obsidian", name: "Obsidian" },
  { token: "--antique-gold", name: "Antique gold" },
  { token: "--ivory", name: "Ivory" },
  { token: "--stone", name: "Stone" },
  { token: "--ink", name: "Ink" },
] as const;

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("press");
  const tc = await getTranslations("common");

  return (
    <>
      <PageIntro title={t("title")} />

      {/* Bilingual boilerplate, ready to paste. Both are shown on both locales,
          because a journalist may need either. */}
      <Section title={t("title")}>
        <div className="prose">
          <p>{t("boilerplate")}</p>
        </div>
      </Section>

      <Section title={t("logos")}>
        <Frame className="press__logo">
          <Wordmark size="lg" />
          {/* Honest about what this is: the final logo has not been made yet, so
              we do not offer a "logo kit" that would misrepresent the brand. */}
          <p className="placeholder-note" style={{ marginBlockStart: "2rem" }}>
            {tc("comingSoon")}
          </p>
        </Frame>
      </Section>

      <Section title={t("colours")} rule={false}>
        <ul className="swatches">
          {SWATCHES.map((s) => (
            <li key={s.token} className="swatches__item">
              <span className="swatches__chip" style={{ background: `var(${s.token})` }} aria-hidden="true" />
              <span className="swatches__name">{s.name}</span>
              <code className="swatches__token">{s.token}</code>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
