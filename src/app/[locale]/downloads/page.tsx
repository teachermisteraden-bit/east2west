import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { Frame } from "@/components/ui/Frame";
import { downloads } from "@/content/downloads";
import { tagEvent } from "@/lib/analytics";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/downloads", namespace: "downloads", titleKey: "title", descriptionKey: "intro" });
}

export default async function DownloadsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("downloads");
  const tc = await getTranslations("common");

  // Prefer this locale's edition, falling back to whatever exists.
  const available = downloads.filter((d) => d.locale === locale);
  const items = available.length > 0 ? available : downloads;

  return (
    <>
      {/* Reciprocity (02): free really means free. There is no email field on
          this page at all — not optional, not pre-ticked, not anywhere. */}
      <PageIntro title={t("title")} subtitle={t("intro")} />

      <Section rule={false}>
        {items.length > 0 ? (
          <ul className="cardgrid cardgrid--2">
            {items.map((d) => (
              <Frame as="li" key={d.href} interactive>
                <h2 className="cardgrid__name">{t(d.key)}</h2>
                <p className="cardgrid__body">
                  <a className={`navlink ${tagEvent("Download", { file: d.key })}`} href={d.href} download>
                    {t(d.key)}
                  </a>
                  {d.sizeLabel ? ` · ${d.sizeLabel}` : ""}
                </p>
              </Frame>
            ))}
          </ul>
        ) : (
          /* No file exists yet, so nothing is offered. A link that 404s would be
             a dead end (non-negotiable 5), and a gated "request it" form would
             break the promise this page makes. */
          <Frame>
            <p className="events__emptyline">{tc("comingSoon")}</p>
            <p className="cardgrid__body">{tc("foundingStage")}</p>
          </Frame>
        )}
      </Section>
    </>
  );
}
