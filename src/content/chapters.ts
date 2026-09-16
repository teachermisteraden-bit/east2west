/**
 * Chapters. Adapted from starters/content/chapters.ts and widened for the
 * roadmap: Madinah pilot → the whole Kingdom → other Muslim countries.
 *
 * `country` is an ISO 3166-1 alpha-2 code, present from day one so that grouping
 * by country later needs no migration. Only real chapters appear here. Nothing
 * aspirational is listed as though it exists — the approved copy already says
 * "Later: alumni chapters abroad", and that stays copy, not data.
 */
export type ChapterKind = "city" | "campus" | "alumni";

/** founding = running, next = named and planned, later = direction of travel. */
export type ChapterStatus = "founding" | "next" | "later";

export type Chapter = {
  slug: string;
  kind: ChapterKind;
  status: ChapterStatus;
  /** ISO 3166-1 alpha-2. */
  country: string;
  name: { en: string; ar: string };
  /** [lon, lat] for the map. */
  coords?: [number, number];
};

export const chapters: Chapter[] = [
  { slug: "madinah", kind: "city", status: "founding", country: "SA", name: { en: "Madinah", ar: "المدينة المنورة" }, coords: [39.61, 24.47] },
  { slug: "jeddah", kind: "city", status: "next", country: "SA", name: { en: "Jeddah", ar: "جدة" }, coords: [39.19, 21.49] },
  { slug: "riyadh", kind: "city", status: "next", country: "SA", name: { en: "Riyadh", ar: "الرياض" }, coords: [46.72, 24.71] },
];

export const chaptersByCountry = (): Map<string, Chapter[]> => {
  const map = new Map<string, Chapter[]>();
  for (const c of chapters) {
    const list = map.get(c.country) ?? [];
    list.push(c);
    map.set(c.country, list);
  }
  return map;
};

export const chaptersWithStatus = (status: ChapterStatus): Chapter[] =>
  chapters.filter((c) => c.status === status);
