import type { Metadata } from "next";
import { getNow, getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { formatDual } from "@/lib/dates";
import { site, isSet, pick } from "@/config/site";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { Frame } from "@/components/ui/Frame";
import { Invitation } from "@/components/ui/Invitation";
import { events } from "@/content/events";
import { EventData } from "@/components/ui/StructuredData";

type Props = { params: Promise<{ locale: string }> };

/**
 * Revalidated hourly.
 *
 * This page is otherwise fully static, which would freeze "now" at build time —
 * an event would sit under "Upcoming" until the next deploy. An hour is well
 * inside the useful resolution for weekly gatherings and keeps the page cached.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/events", namespace: "events", titleKey: "title", descriptionKey: "intro" });
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const tc = await getTranslations("common");
  const th = await getTranslations("home");
  const tg = await getTranslations("graduates");

  // From next-intl, so it honours the configured Asia/Riyadh timezone.
  const now = (await getNow()).getTime();
  const upcoming = events
    .filter((e) => new Date(e.end).getTime() >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const past = events
    .filter((e) => new Date(e.end).getTime() < now)
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("intro")} />
      <EventData locale={locale} />

      {upcoming.length > 0 ? (
        <Section title={t("upcoming")}>
          <ul className="events">
            {upcoming.map((e) => {
              const { gregorian, hijri } = formatDual(new Date(e.start), locale as "en" | "ar");
              return (
                <Frame as="li" key={e.slug} interactive>
                  <p className="eyebrow">{t(`types.${e.type}`)}</p>
                  <h3 className="cardgrid__name">{e.title[locale as "en" | "ar"]}</h3>
                  <p className="cardgrid__body">{e.summary[locale as "en" | "ar"]}</p>
                  {/* Both calendars, always — Umm al-Qura alongside Gregorian (04). */}
                  <p className="events__date">
                    <time dateTime={e.start}>{gregorian}</time>
                    <span aria-hidden="true"> · </span>
                    <span>{hijri}</span>
                  </p>
                  <p className="events__where">
                    {e.city[locale as "en" | "ar"]}
                    {e.venue ? ` — ${e.venue[locale as "en" | "ar"]}` : ""}
                  </p>
                  <p className="events__calendar">
                    <a className="navlink" href={`/${locale}/events/${e.slug}/calendar.ics`} download>
                      {t("addToCalendar")}
                    </a>
                  </p>
                </Frame>
              );
            })}
          </ul>
          <p className="events__note">{t("weekendNote")}</p>
        </Section>
      ) : (
        /* An empty state that reads as anticipation, not absence (02 §4).
           No invented events, no fake "sold out", no countdown. */
        <Section rule={false}>
          <Frame className="events__empty">
            <p className="events__emptyline">{t("empty")}</p>
            <p className="events__note">{t("weekendNote")}</p>
          </Frame>
        </Section>
      )}

      {past.length > 0 && (
        <Section title={t("past")}>
          <ul className="events">
            {past.map((e) => (
              <Frame as="li" key={e.slug}>
                <p className="eyebrow">{t(`types.${e.type}`)}</p>
                <h3 className="cardgrid__name">{e.title[locale as "en" | "ar"]}</h3>
              </Frame>
            ))}
          </ul>
        </Section>
      )}

      {/* The summit is named in the roadmap, so it is described as planned — with
          no date, no venue and no speakers, because none are confirmed. */}
      <Section tone="quiet" title={t("summit.title")} rule={false}>
        <div className="prose">
          <p>{t("summit.body")}</p>
        </div>
      </Section>

      {/* Anticipation, then a real next step — never a dead end (non-negotiable 5). */}
      <Invitation
        title={t("empty")}
        cta={th("closing.cta")}
        href="/join"
        reassurance={tc("reassurance", { responseTime: pick(site.responseTime, locale) })}
        microYes={isSet(site.whatsappCommunity) ? tg("microYes") : undefined}
        microYesHref={isSet(site.whatsappCommunity) ? site.whatsappCommunity : undefined}
      />
    </>
  );
}
