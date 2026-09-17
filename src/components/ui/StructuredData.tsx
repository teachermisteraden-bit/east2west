import { getTranslations } from "next-intl/server";
import { site, isSet } from "@/config/site";
import { events } from "@/content/events";

/**
 * Organization and Event structured data.
 *
 * Only facts the site already states, and only fields that are true today: no
 * founding date the society has not announced, no legal registration it does not
 * have, no member count, no logo it has not made, no address that is a
 * placeholder. Search engines penalise structured data that contradicts the
 * page, and more to the point, inventing any of it here would be the same lie
 * as inventing it in the copy (non-negotiable 1).
 */
export async function OrganizationData({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "meta" });

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("siteName"),
    alternateName: "East to West Development Society",
    description: t("description"),
    url: `${site.url}/${locale}`,
    // Where it was founded is stated on every page; it is not a claim of
    // registration, which the FAQ answers honestly as "not yet".
    foundingLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "Madinah", addressCountry: "SA" },
    },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
  };

  // Every optional field appears only once the owner has supplied it.
  const sameAs = [site.social.linkedin, site.social.instagram, site.social.x].filter(isSet);
  if (sameAs.length > 0) data.sameAs = sameAs;

  if (isSet(site.email)) {
    data.contactPoint = {
      "@type": "ContactPoint",
      email: site.email,
      contactType: "membership enquiries",
      availableLanguage: ["en", "ar"],
    };
  }

  return <Script data={data} />;
}

/** Events, only when real ones exist. An empty list emits nothing at all. */
export function EventData({ locale }: { locale: string }) {
  if (events.length === 0) return null;
  const lang = locale === "ar" ? "ar" : "en";

  const data = events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title[lang],
    description: event.summary[lang],
    startDate: event.start,
    endDate: event.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue?.[lang] ?? event.city[lang],
      address: { "@type": "PostalAddress", addressLocality: event.city[lang], addressCountry: "SA" },
    },
    organizer: { "@type": "Organization", name: "East to West Development Society", url: site.url },
  }));

  return <Script data={data} />;
}

/** JSON-LD is data, not script: serialised safely and never interpolated into HTML. */
function Script({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes the content; < is additionally escaped so the
      // payload can never close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
