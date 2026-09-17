import { getTranslations } from "next-intl/server";
import { lines } from "@/lib/messages";
import { Reveal } from "./Reveal";

/**
 * Scene V — The six-week challenge. Sticky scene 2 of 2.
 *
 * Four stations along a path, lighting in turn as the page scrolls. Below
 * 1024px, and whenever motion is reduced, it is a plain vertical timeline with
 * every station visible.
 *
 * The brief originally pinned this scene and scrolled it sideways. The kit
 * replaces that: the page always moves with the wheel or the swipe, and nothing
 * here is horizontal.
 */
export async function Challenge() {
  const t = await getTranslations("home.challenge");
  const steps = lines(t, "steps");

  return (
    <section className="scene challenge" aria-labelledby="challenge-title">
      <div className="challenge__sticky">
        <div className="shell">
          <Reveal className="scene__head">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="scene__title" id="challenge-title">
              {t("title")}
            </h2>
            <p className="scene__lead">{t("intro")}</p>
          </Reveal>

          <ol className="stations">
            {steps.map((step, i) => (
              <li className="stations__item" key={i} style={{ "--i": i } as React.CSSProperties}>
                <span className="stations__week" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="stations__rail" aria-hidden="true" />
                <p className="stations__text">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
