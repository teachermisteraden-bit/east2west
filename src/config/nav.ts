/** Route map. `key` indexes messages.nav.<key>, so labels are never hardcoded. */
export type NavItem = { key: string; href: string };

/** The four conversion paths — the doors. */
export const audienceNav: NavItem[] = [
  { key: "graduates", href: "/graduates" },
  { key: "universities", href: "/universities" },
  { key: "sponsors", href: "/sponsors" },
  { key: "businesses", href: "/businesses" },
];

/** Context about the society. */
export const aboutNav: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "programmes", href: "/programmes" },
  { key: "events", href: "/events" },
  { key: "chapters", href: "/chapters" },
];

/** Practical links, footer only. */
export const utilityNav: NavItem[] = [
  { key: "contact", href: "/contact" },
  { key: "downloads", href: "/downloads" },
  { key: "press", href: "/press" },
  { key: "privacy", href: "/privacy" },
];

export const joinHref = "/join";

/** Every route that must exist in every locale — drives the sitemap and the tests. */
export const allRoutes: string[] = [
  "/",
  ...audienceNav.map((i) => i.href),
  ...aboutNav.map((i) => i.href),
  ...utilityNav.map((i) => i.href),
  joinHref,
];
