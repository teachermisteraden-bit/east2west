import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";
import { KINGDOM_PATHS, KINGDOM_VIEWBOX, KINGDOM_CITIES, KINGDOM_SOURCE } from "@/content/kingdom-map";
import { chapters } from "@/content/chapters";

/**
 * Scene VII — Across the Kingdom.
 *
 * The outline is Natural Earth's, public domain, credited beneath the map and
 * derived once by scripts/build-kingdom-map.mjs. No neighbouring countries are
 * drawn or labelled, no boundary asserts a position on a disputed border, and
 * the city dots carry no invented figures — only which chapter is founding and
 * which are next.
 *
 * The map is geography, so it sits in .compass-fixed and does not mirror for
 * Arabic. The faint arcs reaching east and west are the roadmap's alumni
 * chapters abroad, which is copy, not a claim that any exist.
 */
export async function KingdomMap() {
  const t = await getTranslations("home.kingdom");

  const founding = chapters.find((c) => c.status === "founding");
  const next = chapters.filter((c) => c.status === "next");

  const marker = (slug: string) => KINGDOM_CITIES[slug];

  return (
    <section className="scene kingdom" aria-labelledby="kingdom-title">
      <div className="shell">
        <Reveal className="scene__head">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="scene__title maskreveal" id="kingdom-title">
            {t("title")}
          </h2>
        </Reveal>

        <div className="kingdom__stage">
          <Reveal className="kingdom__figure compass-fixed">
            <svg
              className="kingdom__svg"
              viewBox={KINGDOM_VIEWBOX}
              role="img"
              aria-label={t("mapAlt")}
              focusable="false"
            >
              {/* Arcs beyond the border: later, alumni chapters abroad. */}
              <g className="kingdom__arcs" aria-hidden="true">
                <path d="M60 300 C -60 260, -60 460, 90 430" />
                <path d="M940 300 C 1060 260, 1060 460, 910 430" />
              </g>

              <g className="kingdom__outline">
                {KINGDOM_PATHS.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>

              {next.map((city) => {
                const point = marker(city.slug);
                if (!point) return null;
                return (
                  <g key={city.slug} className="kingdom__city kingdom__city--next" aria-hidden="true">
                    <circle cx={point.x} cy={point.y} r="6" />
                  </g>
                );
              })}

              {founding && marker(founding.slug) && (
                <g className="kingdom__city kingdom__city--founding" aria-hidden="true">
                  <circle className="kingdom__pulse" cx={marker(founding.slug)!.x} cy={marker(founding.slug)!.y} r="16" />
                  <circle cx={marker(founding.slug)!.x} cy={marker(founding.slug)!.y} r="8" />
                </g>
              )}
            </svg>

            <p className="kingdom__credit">
              <a href={KINGDOM_SOURCE.url} rel="noopener noreferrer nofollow" target="_blank">
                {KINGDOM_SOURCE.name}
              </a>
              {` — ${KINGDOM_SOURCE.detail}`}
            </p>
          </Reveal>

          {/* The legend is the text equivalent: it names every marker, in order. */}
          <Reveal as="dl" className="kingdom__legend" delay={1}>
            <div className="kingdom__row">
              <dt className="kingdom__dot kingdom__dot--founding" aria-hidden="true" />
              <dd>{t("madinah")}</dd>
            </div>
            <div className="kingdom__row">
              <dt className="kingdom__dot kingdom__dot--next" aria-hidden="true" />
              <dd>{t("next")}</dd>
            </div>
            <div className="kingdom__row">
              <dt className="kingdom__dot kingdom__dot--later" aria-hidden="true" />
              <dd>{t("abroad")}</dd>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
