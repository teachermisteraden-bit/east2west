import type { ReactNode } from "react";

/**
 * A content section: optional eyebrow, optional title, generous space, and a
 * closing hairline. The building block for every page below the home story.
 */
export function Section({
  eyebrow,
  title,
  lead,
  children,
  id,
  tone = "default",
  rule = true,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  children?: ReactNode;
  id?: string;
  tone?: "default" | "quiet" | "dark";
  rule?: boolean;
}) {
  return (
    <section id={id} className={`section section--${tone} grain${tone === "dark" ? " on-dark" : ""}`}>
      <div className="shell">
        {(eyebrow || title || lead) && (
          <header className="section__head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="section__title maskreveal">{title}</h2>}
            {lead && <p className="section__lead measure">{lead}</p>}
          </header>
        )}
        {children}
      </div>
      {rule && tone !== "dark" && <hr className="hairline section__rule" />}
    </section>
  );
}
