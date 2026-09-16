/**
 * TEMPORARY WORDMARK — replaced by the logo in brand/ when Claude Design delivers it.
 *
 * Deliberately typographic: the society's name set in the display faces, divided by
 * a hairline. The retired arch mark is not recreated here or anywhere else.
 *
 * The lockup keeps its designed orientation in both languages (non-negotiable 3):
 * the Latin name always sits above the Arabic, whatever the page direction.
 */
export function Wordmark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const scale = size === "lg" ? 1.5 : size === "sm" ? 0.72 : 1;

  return (
    <span className={`wordmark ${className}`} style={{ "--wm-scale": String(scale) } as React.CSSProperties} data-temporary="true">
      <span className="wordmark__latin">East to West</span>
      <span className="wordmark__rule" aria-hidden="true" />
      <span className="wordmark__arabic" lang="ar" dir="rtl">
        الشرق إلى الغرب
      </span>
    </span>
  );
}
