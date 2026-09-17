import { Mark } from "@/components/brand/Mark";

/**
 * The lockup: the badge, then E2W, then DS beneath it.
 *
 * Orientation is a function of size, not a separate decision. Stacked, the
 * lockup needs vertical room the header band does not have (--header-band tops
 * out at 6rem), so the header lays the badge beside the letters and the footer
 * and press sheet stack them. Both are the same two components.
 *
 * The lockup never mirrors. It is a mark, not prose: `direction: ltr` is set on
 * it so an Arabic page shows the same logo a Latin page does, rather than a
 * reversed one. The full society name still sits beside it, in the page's own
 * language, as the accessible name.
 */
export function Wordmark({
  size = "md",
  name,
  className = "",
  uid,
}: {
  size?: "sm" | "md" | "lg";
  /**
   * The society's full name in the reader's language, for the accessible name.
   * The letters E2W DS are an abbreviation; a screen reader announcing "ee two
   * double-you dee ess" tells nobody what this organisation is.
   *
   * Omit it where an ancestor already names this thing -- the header wraps the
   * lockup in a link labelled "Home" -- and the lockup goes decorative instead,
   * so the link is announced once rather than as a link containing an image
   * that repeats the brand.
   */
  name?: string;
  className?: string;
  uid: string;
}) {
  const stacked = size !== "sm";

  return (
    <span
      className={`wordmark wordmark--${size} ${className}`}
      data-stacked={stacked ? "true" : "false"}
      {...(name ? { role: "img", "aria-label": name } : { "aria-hidden": true })}
    >
      <Mark detail={stacked ? "full" : "compact"} uid={uid} />
      <span className="wordmark__letters" aria-hidden="true">
        <span className="wordmark__primary">E2W</span>
        <span className="wordmark__secondary">DS</span>
      </span>
    </span>
  );
}
