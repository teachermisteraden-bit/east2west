import { getTranslations } from "next-intl/server";
import { lines } from "@/lib/messages";
import { Reveal } from "./Reveal";

/**
 * Scene III — The flywheel. Sticky scene 1 of 2.
 *
 * Four nodes on a ring, each one making the next more valuable. The active node
 * follows scroll position on desktop; below 1024px and under reduced motion the
 * ring is a static diagram with every node lit, which is the whole point anyway.
 *
 * The wrapper is 200vh — the ceiling 01 §3 sets — and the page always moves with
 * the wheel. Nothing is trapped: scrolling past simply scrolls past.
 *
 * Accessibility: the ring is decorative. The cycle itself is an ordered list,
 * read in order, so the story does not depend on seeing the diagram.
 */
export async function Flywheel() {
  const t = await getTranslations("home.flywheel");
  const nodes = lines(t, "nodes");

  return (
    <section className="scene flywheel" aria-labelledby="flywheel-title">
      <div className="flywheel__sticky">
        <div className="shell">
          <Reveal className="scene__head">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="scene__title" id="flywheel-title">
              {t("title")}
            </h2>
          </Reveal>

          <div className="flywheel__stage">
            {/* The ring. Decorative — the list below carries the meaning. */}
            <div className="flywheel__ring" aria-hidden="true">
              <svg viewBox="0 0 400 400" className="flywheel__svg" focusable="false">
                <circle className="flywheel__track" cx="200" cy="200" r="150" />
                <circle className="flywheel__sweep" cx="200" cy="200" r="150" />
              </svg>

              <div className="flywheel__centre">
                <span className="flywheel__centrename">{t("centre")}</span>
                <span className="flywheel__centresub">{t("centreSub")}</span>
              </div>

              {nodes.map((node, i) => (
                <span className="flywheel__node" key={i} style={{ "--i": i } as React.CSSProperties}>
                  <span className="flywheel__dot" />
                  <span className="flywheel__label">{node}</span>
                </span>
              ))}
            </div>

            {/* The text equivalent, and the only version that exists for
                assistive technology and for anyone with motion turned off. */}
            <ol className="flywheel__list">
              {nodes.map((node, i) => (
                <li key={i} className="flywheel__listitem" style={{ "--i": i } as React.CSSProperties}>
                  <span className="flywheel__listnum" aria-hidden="true">
                    {i + 1}
                  </span>
                  {node}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
