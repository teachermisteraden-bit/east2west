import type { SocietyEvent } from "@/content/events";
import { formatDual } from "./dates";

/**
 * Builds an iCalendar file for one event.
 *
 * The Hijri date goes in the description rather than the date fields, because
 * the format only understands Gregorian — but a visitor who keeps the Umm al-Qura
 * calendar should still see it when they open the entry.
 */
const CRLF = "\r\n";

/** RFC 5545 requires escaping these in text values, and folding long lines. */
function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest.length) parts.push(` ${rest}`);
  return parts.join(CRLF);
}

const stamp = (iso: string): string => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function buildIcs(event: SocietyEvent, locale: "en" | "ar", siteUrl: string): string {
  const { gregorian, hijri } = formatDual(new Date(event.start), locale);
  const title = event.title[locale];
  const location = [event.venue?.[locale], event.city[locale]].filter(Boolean).join(", ");

  const description = [event.summary[locale], `${gregorian} · ${hijri}`].join("\n\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//East to West Development Society//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@east-to-west`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(event.end)}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    location ? `LOCATION:${escapeText(location)}` : null,
    `URL:${siteUrl}/${locale}/events`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);

  return lines.map(fold).join(CRLF) + CRLF;
}
