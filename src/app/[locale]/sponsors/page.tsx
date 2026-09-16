import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/ui/PageIntro";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/sponsors", namespace: "sponsors", titleKey: "title", descriptionKey: "subtitle" });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sponsors");

  return (
    <>
      <PageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="shell stub">
        <p className="stub__badge">Phase 1 — this page is built in Phase 2.</p>
      </div>
    </>
  );
}
