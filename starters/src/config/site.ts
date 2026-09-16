// Every value that is not yet known comes from the environment. Empty values hide their UI cleanly.
export const site = {
  url: process.env.SITE_URL ?? "http://localhost:3000",
  contactName: { en: "Muhsin Aden", ar: "محسن آدن" },
  contactRole: { en: "founding coordinator", ar: "المنسّق المؤسِّس" },
  email: process.env.CONTACT_EMAIL ?? "",
  phone: process.env.CONTACT_PHONE ?? "",
  whatsappCommunity: process.env.WHATSAPP_COMMUNITY_URL ?? "",
  social: {
    linkedin: process.env.SOCIAL_LINKEDIN ?? "",
    instagram: process.env.SOCIAL_INSTAGRAM ?? "",
    x: process.env.SOCIAL_X ?? "",
    snapchat: process.env.SOCIAL_SNAPCHAT ?? "",
  },
  responseTime: { en: process.env.RESPONSE_TIME_EN ?? "3 working days", ar: process.env.RESPONSE_TIME_AR ?? "3 أيام عمل" },
  membershipCost: { en: process.env.MEMBERSHIP_COST_EN ?? "Membership fees will be announced soon", ar: process.env.MEMBERSHIP_COST_AR ?? "سيُعلن عن رسوم العضوية قريبًا" },
  flags: {
    liveCounters: process.env.FLAG_LIVE_COUNTERS === "true",
    abTests: process.env.FLAG_AB_TESTS === "true",
    ramadanMode: process.env.FLAG_RAMADAN_MODE === "true",
    webglHero: process.env.FLAG_WEBGL_HERO !== "false",
    arabicIndicDigits: process.env.FLAG_ARABIC_INDIC_DIGITS === "true",
  },
  campaigns: ["general", "graduates", "universities", "sponsors", "business"] as const,
};
