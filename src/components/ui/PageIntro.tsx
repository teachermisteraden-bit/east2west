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
  /**
   * Matches the `view-transition-name` on the door card that leads here, so the
   * browser morphs the card into this heading across the navigation — the door
   * opening into its page (01 §3). Omitted on pages with no door.
   */
  door,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  door?: string;
}) {
  return (
    <section className="pageintro grain">
      <div className="shell">
        {eyebrow && <p className="eyebrow pageintro__eyebrow">{eyebrow}</p>}
        <h1
          className="pageintro__title maskreveal"
          style={door ? ({ viewTransitionName: `door-${door}` } as React.CSSProperties) : undefined}
        >
          {title}
        </h1>
        {subtitle && <p className="pageintro__subtitle measure">{subtitle}</p>}
        {children}
      </div>
      <hr className="hairline" />
    </section>
  );
}
