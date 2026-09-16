import { NextResponse } from "next/server";
import { events } from "@/content/events";
import { buildIcs } from "@/lib/ics";
import { site } from "@/config/site";
import { isLocale } from "@/i18n/locales";

/** Downloadable calendar entry for one event, in the visitor's language. */
export async function GET(_req: Request, ctx: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await ctx.params;
  if (!isLocale(locale)) return new NextResponse("Not found", { status: 404 });

  const event = events.find((e) => e.slug === slug);
  if (!event) return new NextResponse("Not found", { status: 404 });

  const ics = buildIcs(event, locale === "ar" ? "ar" : "en", site.url);

  return new NextResponse(ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="${slug}.ics"`,
      "cache-control": "public, max-age=3600",
    },
  });
}
