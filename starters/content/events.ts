// Add real events here. Leave the array empty until events are confirmed; the site shows an elegant empty state.
export type EventType = "gathering" | "keynote" | "workshop" | "hiring" | "showcase" | "summit";
export type SocietyEvent = {
  slug: string;
  type: EventType;
  title: { en: string; ar: string };
  summary: { en: string; ar: string };
  start: string; // ISO 8601 with +03:00 offset, e.g. "2026-10-08T19:00:00+03:00"
  end: string;
  city: { en: string; ar: string };
  venue?: { en: string; ar: string };
  womenOnly?: boolean;
  registrationUrl?: string; // defaults to /join if empty
};
export const events: SocietyEvent[] = [];
