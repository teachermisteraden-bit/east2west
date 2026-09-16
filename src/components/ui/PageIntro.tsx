import type { ReactNode } from "react";

/**
 * The opening of every page below the home story: eyebrow, title, standfirst.
 * Generous space and a hairline, per the noble register (01 §2).
 */
export function PageIntro({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="pageintro">
      <div className="shell">
        {eyebrow && <p className="eyebrow pageintro__eyebrow">{eyebrow}</p>}
        <h1 className="pageintro__title">{title}</h1>
        {subtitle && <p className="pageintro__subtitle measure">{subtitle}</p>}
        {children}
      </div>
      <hr className="hairline" />
    </section>
  );
}
