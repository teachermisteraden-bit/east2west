import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Reveal } from "./Reveal";

const DOORS = [
  { key: "graduates", href: "/graduates" },
  { key: "universities", href: "/universities" },
  { key: "sponsors", href: "/sponsors" },
  { key: "businesses", href: "/businesses" },
] as const;

/**
 * Scene VIII — The four doors.
 *
 * Four invitation cards, each with one outcome and one action. On hover or focus
 * the inner frame opens a little, like a door. The whole card is the link, and
 * `view-transition-name` hands it to the browser so the card carries across into
 * its page where the API is supported.
 *
 * Self-determination and Hick's law (02): the visitor chooses their own path,
 * and there are four choices rather than fourteen.
 */
export async function FourDoors() {
  const t = await getTranslations("home.doors");

  return (
    <section className="scene doors" id="doors" aria-labelledby="doors-title">
      <div className="shell">
        <Reveal className="scene__head">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="scene__title" id="doors-title">
            {t("title")}
          </h2>
        </Reveal>

        <ul className="doors__grid">
          {DOORS.map((door, i) => (
            <Reveal as="li" className="doors__item" key={door.key} delay={i}>
              <Link
                href={door.href}
                className="doors__card"
                style={{ viewTransitionName: `door-${door.key}` } as React.CSSProperties}
              >
                <span className="doors__frame" aria-hidden="true">
                  <span className="doors__leaf doors__leaf--start" />
                  <span className="doors__leaf doors__leaf--end" />
                </span>
                <span className="doors__body">
                  <span className="doors__name">{t(`${door.key}.title`)}</span>
                  <span className="doors__line">{t(`${door.key}.body`)}</span>
                  <span className="doors__cta">{t(`${door.key}.cta`)}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
