"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Link } from "@/i18n/routing";
import { site, isSet } from "@/config/site";
import { ProgressThread } from "./ProgressThread";
import { ShareRow } from "@/components/ui/ShareRow";

/**
 * The end moment.
 *
 * Peak-end rule (02): an experience is judged largely by its peak and its end,
 * so this is deliberately the most crafted screen on the site — the applicant's
 * name, the date in both calendars, the journey thread with its first node lit,
 * and a real next step rather than a dead end.
 *
 * Zeigarnik: the next step is shown, not nagged. One invitation, no follow-up
 * emails beyond the single acknowledgement.
 */
export function InvitationCard({
  name,
  gregorian,
  hijri,
  inviteUrl,
  total,
  responseTime,
  typeNoun,
}: {
  name: string;
  gregorian: string;
  hijri: string;
  /** Built on the server, where SITE_URL is readable. */
  inviteUrl: string | null;
  total: number;
  responseTime: string;
  typeNoun: string;
}) {
  const t = useTranslations("confirmation");
  const tc = useTranslations("common");
  const tj = useTranslations("join");

  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // `scroll-behavior` is already forced to auto under reduced motion.
    headingRef.current?.scrollIntoView({ block: "start" });
    headingRef.current?.focus();
  }, []);

  return (
    <section className="invitecard" aria-live="polite">
      <div className="invitecard__frame">
        <span className="invitecard__inner" aria-hidden="true" />
        <div className="invitecard__body">
          <p className="eyebrow invitecard__eyebrow">{tc("founded")}</p>

          <h2 className="invitecard__title" tabIndex={-1} ref={headingRef}>
            {t("title")}
          </h2>
          <p className="invitecard__body">{t("body", { name, type: typeNoun, responseTime })}</p>

          {/* Both calendars, in the order each language reads them. */}
          <p className="invitecard__date">{t("date", { gregorian, hijri })}</p>

          <hr className="hairline invitecard__rule" />

          {/* The journey, with Join lit. */}
          <div className="invitecard__journey">
            <ProgressThread
              current={total}
              total={total}
              progressLabel={t("journeyJoined")}
              startedLabel={t("journeyJoined")}
              lastStepLabel={t("journeyJoined")}
              completedLabel={t("journeyJoined")}
              nodeLabel={(n, of) => tj("progress", { current: n, total: of })}
              done
            />
          </div>

          <h3 className="invitecard__nexttitle">{t("next")}</h3>
          <ul className="invitecard__next">
            {isSet(site.whatsappCommunity) && (
              <li>
                <a className="navlink" href={site.whatsappCommunity} rel="noopener noreferrer" target="_blank">
                  {t("nextWhatsapp")}
                </a>
              </li>
            )}
            <li>
              <Link className="navlink" href="/events">
                {t("nextEvents")}
              </Link>
            </li>
          </ul>

          {/* A personal invite link, offered rather than pushed. */}
          {inviteUrl && (
            <div className="invitecard__invite">
              <h3 className="invitecard__nexttitle">{t("inviteLink")}</h3>
              <ShareRow url={inviteUrl} title={t("share")} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
