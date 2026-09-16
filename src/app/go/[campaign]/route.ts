import { NextResponse, type NextRequest } from "next/server";
import { campaignRoutes } from "@/lib/campaigns";
import { defaultLocale, activeLocales, isLocale } from "@/i18n/locales";

/**
 * QR and poster entry points: /go/<campaign>
 *
 * Redirects to the right page in the visitor's language and tags the visit with
 * UTM parameters so the launch posters can be told apart. The campaign is also
 * dropped in a first-party cookie so it survives the click into a form —
 * no third-party tracker, nothing personal, and it expires in 30 days.
 */
export const dynamic = "force-dynamic";

function resolveLocale(req: NextRequest): string {
  const explicit = req.nextUrl.searchParams.get("lang");
  if (isLocale(explicit)) return explicit;

  const header = req.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
    const base = tag.split("-")[0] ?? "";
    const match = activeLocales.find((l) => l.code === tag || l.code === base);
    if (match) return match.code;
  }
  return defaultLocale;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await ctx.params;
  const route = campaignRoutes[campaign];

  // An unknown campaign is still a real visitor holding a poster: send them home
  // rather than to a 404.
  const target = route ?? { path: "/", utm_campaign: "poster-unknown" };
  const locale = resolveLocale(req);

  const url = new URL(`/${locale}${target.path}`, req.nextUrl.origin);
  url.searchParams.set("utm_source", "qr");
  url.searchParams.set("utm_medium", "poster");
  url.searchParams.set("utm_campaign", target.utm_campaign);

  // Carry any referral code straight through.
  const ref = req.nextUrl.searchParams.get("ref");
  if (ref) url.searchParams.set("ref", ref);

  const res = NextResponse.redirect(url, 307);
  res.cookies.set("e2w_campaign", campaign, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    httpOnly: false,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
