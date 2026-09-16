import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Lattice } from "./Lattice";

/**
 * Scene 0 — Pre-dawn.
 *
 * Complete on first paint with no JavaScript (04): the lattice is inline SVG and
 * the dawn light is a CSS gradient. The optional WebGL enhancement in Phase 4
 * layers on top and must never be needed for this to look finished.
 *
 * The light rises from the eastern edge — the right-hand side in BOTH languages,
 * because the sun rises in the east on a north-up map. That is why the light
 * layer sits inside .compass-fixed and does not mirror with the text.
 */
export async function Hero() {
  const t = await getTranslations("home.hero");

  return (
    <section className="hero on-dark">
      <div className="hero__sky compass-fixed" aria-hidden="true">
        <Lattice />
        <div className="hero__dawn" />
        <div className="hero__horizon" />
      </div>

      <div className="shell hero__content">
        <p className="eyebrow hero__eyebrow">{t("eyebrow")}</p>
        <h1 className="hero__title">{t("title")}</h1>
        <p className="hero__subtitle measure">{t("subtitle")}</p>

        <div className="hero__actions">
          {/* One primary action per view (Hick's law, 02). */}
          <a href="#doors" className="btn btn--primary">
            {t("cta")}
          </a>
          <Link href="/join" className="hero__secondary navlink">
            {t("secondary")}
          </Link>
        </div>
      </div>

      {/* A thin vertical line that grows. No bouncing arrow (01 §4).
          Sits on the western edge in both languages, away from the dawn light. */}
      <div className="hero__cue compass-fixed" aria-hidden="true">
        <span className="hero__cuelabel">{t("scrollCue")}</span>
        <span className="hero__cueline" />
      </div>
    </section>
  );
}
