import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/scenes/Hero";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "",
    namespace: "meta",
    titleKey: "tagline",
    descriptionKey: "description",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      <Hero />
      <div className="shell stub">
        <p className="stub__badge">
          Phase 1 — scenes I to VIII ({t("shores.eyebrow")} … {t("doors.eyebrow")}) are built in Phase 4.
        </p>
      </div>
    </>
  );
}
