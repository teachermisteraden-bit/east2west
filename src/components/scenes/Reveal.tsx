import type { ReactNode, ElementType } from "react";

/**
 * A scroll reveal.
 *
 * CSS scroll-driven animations do the work where they exist (`animation-timeline:
 * view()`), which costs no JavaScript and runs off the main thread. Browsers
 * without support get a small IntersectionObserver fallback — see RevealScript.
 *
 * Under reduced motion the element is simply in its final state: no fade waiting
 * to happen, nothing that needs a scroll to become readable.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger position. Multiplied by --stagger, capped so a long list never crawls. */
  delay?: number;
  className?: string;
}) {
  return (
    <Tag className={`reveal ${className}`} data-reveal="" style={{ "--reveal-index": delay } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
