import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { lines } from "@/lib/messages";
import { site, pick } from "@/config/site";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { PlainList } from "@/components/ui/CardGrid";
import { Frame } from "@/components/ui/Frame";
import { Invitation } from "@/components/ui/Invitation";
import { chapters } from "@/content/chapters";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/chapters", namespace: "chapters", titleKey: "title", descriptionKey: "intro" });
}

export default async function ChaptersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("chapters");
  const tc = await getTranslations("common");

  const founding = chapters.filter((c) => c.status === "founding");
  const next = chapters.filter((c) => c.status === "next");

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("intro")} />

      {/* Only real chapters are listed, by status. Campus chapters and chapters
          abroad are described as intent, because none exist yet. */}
      <Section>
        <ul className="chapters">
          {founding.map((c) => (
            <Frame as="li" key={c.slug}>
              <p className="eyebrow">{t("madinah")}</p>
              <h2 className="cardgrid__name">{c.name[locale as "en" | "ar"]}</h2>
            </Frame>
          ))}
          {next.length > 0 && (
            <Frame as="li">
              <p className="eyebrow">{t("next")}</p>
              <h2 className="cardgrid__name">
                {next.map((c) => c.name[locale as "en" | "ar"]).join(locale === "ar" ? "، " : ", ")}
              </h2>
            </Frame>
          )}
          <Frame as="li">
            <p className="eyebrow">{tc("comingSoon")}</p>
            <h2 className="cardgrid__name">{t("campus")}</h2>
          </Frame>
          <Frame as="li">
            <p className="eyebrow">{tc("comingSoon")}</p>
            <h2 className="cardgrid__name">{t("abroad")}</h2>
          </Frame>
        </ul>
      </Section>

      {/* What a chapter needs before it can launch — the standard, stated openly,
          so quality is the same wherever someone joins. */}
      <Section tone="quiet" title={t("requirementsTitle")}>
        <PlainList items={lines(t, "requirements")} columns={2} />
      </Section>

      <Invitation
        title={t("cta")}
        cta={t("cta")}
        href="/join?type=chapter"
        reassurance={tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
      />
    </>
  );
}
