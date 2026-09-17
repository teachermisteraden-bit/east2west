import { ogForPage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { routing } from "@/i18n/routing";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "East to West Development Society";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** The four audience pages are the links people actually share. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return ogForPage(locale, "sponsors", "title");
}
