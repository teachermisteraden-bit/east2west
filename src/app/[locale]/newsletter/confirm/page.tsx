import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { confirmSubscription } from "@/app/actions/newsletter";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/newsletter/confirm",
    namespace: "newsletter",
    titleKey: "confirmTitle",
  });
}

/** Not indexed: this page only means anything with a one-time token. */
export const robots = { index: false, follow: false };

export default async function ConfirmPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("newsletter");
  const tc = await getTranslations("common");

  const outcome = await confirmSubscription(token ?? "");

  const title = outcome === "invalid" ? t("invalidToken") : t("confirmTitle");
  const body = outcome === "confirmed" ? t("confirmBody") : outcome === "already" ? t("alreadyConfirmed") : "";

  return (
    <>
      <PageIntro title={title} subtitle={body || undefined} />
      <Section rule={false}>
        <Link href="/" className="btn btn--quiet">
          {tc("learnMore")}
        </Link>
      </Section>
    </>
  );
}
