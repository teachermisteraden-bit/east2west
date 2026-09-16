export type Chapter = {
  slug: string;
  kind: "city" | "campus" | "abroad";
  status: "founding" | "next" | "later";
  name: { en: string; ar: string };
  coords?: [number, number]; // [lon, lat] for the map
};
export const chapters: Chapter[] = [
  { slug: "madinah", kind: "city", status: "founding", name: { en: "Madinah", ar: "المدينة المنورة" }, coords: [39.61, 24.47] },
  { slug: "jeddah", kind: "city", status: "next", name: { en: "Jeddah", ar: "جدة" }, coords: [39.19, 21.49] },
  { slug: "riyadh", kind: "city", status: "next", name: { en: "Riyadh", ar: "الرياض" }, coords: [46.72, 24.71] },
];
