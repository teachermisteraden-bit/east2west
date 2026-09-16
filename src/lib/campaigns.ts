// /go/[campaign] → destination + UTM. Used by app/go/[campaign]/route.ts
export const campaignRoutes: Record<string, { path: string; utm_campaign: string }> = {
  general: { path: "/", utm_campaign: "poster-general" },
  graduates: { path: "/graduates", utm_campaign: "poster-membership" },
  universities: { path: "/universities", utm_campaign: "poster-universities" },
  sponsors: { path: "/sponsors", utm_campaign: "poster-sponsorship" },
  business: { path: "/businesses", utm_campaign: "poster-business" },
};
// Redirect as: /{locale}{path}?utm_source=qr&utm_medium=poster&utm_campaign={utm_campaign}
// Locale: from ?lang= if present, else Accept-Language (ar → ar, otherwise en).
