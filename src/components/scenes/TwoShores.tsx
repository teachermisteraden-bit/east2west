import { getTranslations } from "next-intl/server";
import { lines } from "@/lib/messages";
import { Reveal } from "./Reveal";

/**
 * Scene I — The two shores.
 *
 * Graduates on the East, businesses on the West, joined by a gold thread that
 * draws across the divide as you scroll. That thread is the bridge the approved
 * copy names ("Two shores. One bridge.") — the word stays, the retired arch mark
 * does not.
 *
 * The shores sit inside .compass-fixed: east and west are geography, so they do
 * not swap when the page mirrors for Arabic (01 §7).
 *
 * Self-reference (02): each audience sees itself first, and sees that the other
 * side needs it.
 */
export async function TwoShores() {
  const t = await getTranslations("home.shores");

  return (
    <section className="scene shores" aria-labelledby="shores-title">
      <div className="shell">
        <Reveal className="scene__head">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="scene__title maskreveal" id="shores-title">
            {t("title")}
          </h2>
        </Reveal>

        <div className="shores__grid compass-fixed">
          <Reveal as="article" className="shores__side shores__side--east" delay={0}>
            <h3 className="shores__name">{t("east.title")}</h3>
            <ul className="shores__lines">
              {lines(t, "east.lines").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </Reveal>

          {/* The thread. Decorative: the joining is stated in the copy. */}
          <div className="shores__thread" aria-hidden="true">
            <span className="shores__threadline" />
          </div>

          <Reveal as="article" className="shores__side shores__side--west" delay={1}>
            <h3 className="shores__name">{t("west.title")}</h3>
            <ul className="shores__lines">
              {lines(t, "west.lines").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
