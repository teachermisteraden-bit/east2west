import { getTranslations } from "next-intl/server";
import { namedItems } from "@/lib/messages";
import { Reveal } from "./Reveal";

/**
 * Scene VI — The member journey.
 *
 * Join, Learn, Connect, Build, Earn, Lead along a gold thread that fills as you
 * read. The last node glows: the goal-gradient effect says people accelerate as
 * a goal feels closer, so the destination is visible from the start.
 */
export async function Journey() {
  const t = await getTranslations("home.journey");
  const steps = namedItems(t, "steps");

  return (
    <section className="scene journey" aria-labelledby="journey-title">
      <div className="shell">
        <Reveal className="scene__head">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="scene__title maskreveal" id="journey-title">
            {t("title")}
          </h2>
        </Reveal>

        <ol className="journeyline">
          {/* The thread itself. Decorative: the steps are an ordered list. */}
          <span className="journeyline__track" aria-hidden="true">
            <span className="journeyline__fill" />
          </span>

          {steps.map((step, i) => (
            <li
              className="journeyline__item"
              key={step.name}
              data-last={i === steps.length - 1 ? "true" : undefined}
            >
              <span className="journeyline__dot" aria-hidden="true" />
              <h3 className="journeyline__name">{step.name}</h3>
              <p className="journeyline__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
