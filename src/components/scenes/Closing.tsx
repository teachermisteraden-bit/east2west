import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Lattice } from "./Lattice";
import { Reveal } from "./Reveal";

/**
 * Scene IX — The closing.
 *
 * Dusk on the western edge, closing the sun's path the hero opened in the east.
 * Like the hero, the light sits in .compass-fixed: it sets in the west in both
 * languages, because that is where the sun sets.
 *
 * Peak-end rule (02): this is the last thing read, so it carries the promise and
 * a single action.
 */
export async function Closing() {
  const t = await getTranslations("home.closing");
  const tc = await getTranslations("common");

  return (
    <section className="scene closing on-dark" aria-labelledby="closing-title">
      <div className="closing__sky compass-fixed" aria-hidden="true">
        <Lattice />
        <div className="closing__dusk" />
        <div className="closing__horizon" />
      </div>

      <div className="shell closing__content">
        <Reveal>
          <h2 className="closing__title maskreveal" id="closing-title">
            {t("promise")}
          </h2>
          <div className="closing__actions">
            <Link href="/join" className="btn btn--primary">
              {t("cta")}
            </Link>
          </div>
          <p className="closing__founded">{tc("founded")}</p>
        </Reveal>
      </div>
    </section>
  );
}
