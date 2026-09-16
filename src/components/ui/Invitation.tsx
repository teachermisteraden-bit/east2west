import { Link } from "@/i18n/routing";
import { Frame } from "./Frame";

/**
 * The invitation that closes every audience page: one primary action, a warm
 * note, and reassurance directly beneath it (04).
 *
 * Peak-end rule (02): this is the last thing read, so it carries the warmth.
 * The micro-yes sits below as a quieter alternative for anyone not ready to
 * apply — a smaller first step, never a competing primary action (Hick's law).
 */
export function Invitation({
  title,
  note,
  cta,
  href,
  reassurance,
  microYes,
  microYesHref,
}: {
  title: string;
  note?: string;
  cta: string;
  href: string;
  reassurance: string;
  microYes?: string;
  microYesHref?: string;
}) {
  return (
    <section className="invitation">
      <div className="shell">
        <Frame className="invitation__card">
          <h2 className="invitation__title">{title}</h2>
          {note && <p className="invitation__note measure">{note}</p>}
          <div className="invitation__actions">
            <Link href={href} className="btn btn--primary">
              {cta}
            </Link>
          </div>
          <p className="invitation__reassurance">{reassurance}</p>
          {microYes && microYesHref && (
            <p className="invitation__micro">
              {microYesHref.startsWith("/") ? (
                // Internal: routed through next-intl so it keeps the locale.
                <Link className="navlink" href={microYesHref}>
                  {microYes}
                </Link>
              ) : (
                <a className="navlink" href={microYesHref} rel="noopener noreferrer" target="_blank">
                  {microYes}
                </a>
              )}
            </p>
          )}
        </Frame>
      </div>
    </section>
  );
}
