import { getTranslations } from "next-intl/server";
import { namedItems } from "@/lib/messages";
import { Reveal } from "./Reveal";

/** Roman numerals in the display serif, per the craft details in 01 §2. */
const NUMERALS = ["I", "II", "III"] as const;

/**
 * Scene II — Three pillars.
 *
 * Tall panels that rise in sequence. The numerals are decorative: the pillars
 * are already an ordered list, so a screen reader hears "1, 2, 3" from the
 * markup rather than "I, II, III" read as letters.
 */
export async function Pillars() {
  const t = await getTranslations("home.pillars");
  const items = namedItems(t, "items");

  return (
    <section className="scene pillars" aria-labelledby="pillars-title">
      <div className="shell">
        <Reveal className="scene__head">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="scene__title maskreveal" id="pillars-title">
            {t("title")}
          </h2>
        </Reveal>

        <ol className="pillars__grid">
          {items.map((item, i) => (
            <Reveal as="li" className="pillars__item" key={item.name} delay={i}>
              <span className="pillars__numeral" aria-hidden="true">
                {NUMERALS[i]}
              </span>
              <h3 className="pillars__name">{item.name}</h3>
              <p className="pillars__body">{item.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
