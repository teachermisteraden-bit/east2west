import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";
import { programmes } from "@/content/programmes";

/**
 * Scene IV — The nine programmes.
 *
 * A 3×3 grid grouped by the stage of the journey each one serves, so nine tiles
 * read as one path rather than a menu. Hover and focus lift a card; on touch
 * every description is simply visible, because there is no hover to discover it
 * with (01 §4).
 */
export async function Programmes() {
  const t = await getTranslations("home.programmes");
  const tp = await getTranslations("programmes");

  return (
    <section className="scene programmes-scene" aria-labelledby="programmes-title">
      <div className="shell">
        <Reveal className="scene__head">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="scene__title" id="programmes-title">
            {t("title")}
          </h2>
        </Reveal>

        <ul className="progtiles">
          {programmes.map((p, i) => (
            <Reveal as="li" className="progtiles__item" key={p.key} delay={i}>
              <p className="eyebrow progtiles__stage">{t(`groups.${p.stage}`)}</p>
              <h3 className="progtiles__name">{tp(`items.${p.key}.name`)}</h3>
              <p className="progtiles__body">{tp(`items.${p.key}.body`)}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
