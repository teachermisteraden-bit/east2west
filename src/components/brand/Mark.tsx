/**
 * The E2W DS badge.
 *
 * Built from the supplied mock rather than traced from it: the mock is a raster
 * at one size, and a logo has to survive a 16px favicon and a 300px press sheet.
 * So the motifs are rebuilt as geometry -- oval field, laurel, three figures
 * linked over an open book, a raised standard -- and the palette is mapped onto
 * the site's own tokens rather than importing a second green.
 *
 * Two things in the mock were changed deliberately, both for the same reason
 * (Madinah -> Saudi -> the wider Muslim world):
 *
 *   - The pennant carries an eight-point star, not a star-and-crescent. A
 *     crescent pennant reads as a particular country's flag (Turkey, Pakistan,
 *     Tunisia), which is exactly the wrong signal for a society that intends to
 *     open chapters across several. The eight-point star is the same geometry
 *     the site already uses in its lattice, so the mark and the site agree.
 *   - The figures are unsexed and unfeatured. The mock's figures read as men;
 *     the society serves women graduates equally, and a logo is the one asset
 *     that cannot be caveated.
 *
 * `detail` is a real part of the system, not an optimisation. At header size the
 * laurel and the standard collapse into noise, so they are not drawn at all --
 * better an honest simpler mark than a smudge of one.
 */
export type MarkDetail = "full" | "compact";

export function Mark({
  detail = "full",
  className = "",
  uid,
}: {
  detail?: MarkDetail;
  className?: string;
  /**
   * Distinguishes this instance's gradient from every other one on the page.
   * Required rather than defaulted: the footer and the press sheet both render
   * the full badge on the same document, and two `id="e2w-field"` would be
   * invalid markup resolved by document order -- which is to say, by luck.
   * Generating it with useId() would make this a client component and ship
   * JavaScript for a logo, so the call site names it.
   */
  uid: string;
}) {
  const full = detail === "full";
  const fieldId = `e2w-field-${uid}`;

  return (
    <svg
      viewBox="0 0 128 112"
      className={`mark mark--${detail} ${className}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={fieldId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--mark-field-a)" />
          <stop offset="1" stopColor="var(--mark-field-b)" />
        </linearGradient>
      </defs>

      {/* The field. */}
      <ellipse cx="64" cy="56" rx="62" ry="54" fill={`url(#${fieldId})`} />
      <ellipse
        cx="64"
        cy="56"
        rx="56.5"
        ry="48.5"
        fill="none"
        stroke="var(--mark-ivory)"
        strokeWidth="3"
      />

      {full && (
        /* Laurel. One branch, drawn once and mirrored, so the two sides can
           never drift apart under edits. It hugs the ring and sweeps in beneath
           the book -- in the mock a pair of hands cradles the book there, but a
           pair of hands at favicon scale is a blob, and the laurel already
           carries the cradling gesture. */
        <g fill="var(--mark-gold)">
          {[null, "translate(128 0) scale(-1 1)"].map((mirror, i) => (
            <g key={i} transform={mirror ?? undefined}>
              <path
                d="M28 94c-8-6-11.5-16-11-26 .3-7 2.6-13 6.5-18"
                fill="none"
                stroke="var(--mark-gold)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path d="M18.5 70.5c-3.6-1.2-6-4.3-6.2-8 3.7-.7 7.2 1.3 8.5 4.7zM18.6 60c-3.4-1.6-5.4-5-5.2-8.7 3.6-.2 6.7 2.2 7.7 5.6zM21.4 50.2c-3-2.2-4.4-6-3.5-9.6 3.5.5 6.2 3.4 6.6 7zM33 85.6c-3.3-1.9-5.2-5.6-4.6-9.3 3.6.4 6.4 3.2 6.9 6.9z" />
              <path d="M24.6 73.5c3.5-1.7 7.6-1.3 10.3 1-2.2 3-6.2 4.2-9.6 2.9zM24.4 62.6c3.3-2.2 7.4-2.3 10.4-.2-1.9 3.2-5.8 4.6-9.2 3.4zM27.2 52c3-2.7 7-3.3 10.2-1.5-1.5 3.3-5.2 5.2-8.6 4.5z" />
            </g>
          ))}
        </g>
      )}

      {full && (
        /* The raised standard: a rallying point, not a nation. */
        <g>
          <path
            d="M64 17v24"
            stroke="var(--mark-gold)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path d="M65.6 17.5h21l-4.6 6 4.6 6h-21z" fill="var(--mark-gold)" />
          {/* Eight-point star: two squares, the site's own lattice geometry. */}
          <g fill="var(--mark-field-a)">
            <rect x="70.4" y="19.9" width="7.2" height="7.2" />
            <rect x="70.4" y="19.9" width="7.2" height="7.2" transform="rotate(45 74 23.5)" />
          </g>
        </g>
      )}

      {/* Three figures, linked. The centre one stands a little forward: a
          society has conveners, not a hierarchy. */}
      <g fill="var(--mark-ivory)">
        {/* Linked arms, drawn under the torsos so the joins stay clean. */}
        <path
          d="M47 62c5-3.4 8.6-3.4 12 0M69 62c3.4-3.4 7-3.4 12 0"
          fill="none"
          stroke="var(--mark-ivory)"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <circle cx="42" cy="50" r="5.4" />
        <path d="M42 57.5c5 0 8 3.2 8 8.2V74a2.6 2.6 0 0 1-2.6 2.6h-10.8A2.6 2.6 0 0 1 34 74v-8.3c0-5 3-8.2 8-8.2z" />
        <circle cx="86" cy="50" r="5.4" />
        <path d="M86 57.5c5 0 8 3.2 8 8.2V74a2.6 2.6 0 0 1-2.6 2.6H80.6A2.6 2.6 0 0 1 78 74v-8.3c0-5 3-8.2 8-8.2z" />
        <circle cx="64" cy="45.5" r="6.4" />
        <path d="M64 54.4c5.9 0 9.4 3.8 9.4 9.7V74a2.8 2.8 0 0 1-2.8 2.8H57.4A2.8 2.8 0 0 1 54.6 74V64.1c0-5.9 3.5-9.7 9.4-9.7z" />
      </g>

      {/* The open book: what the society actually hands over. */}
      <g>
        <path
          d="M64 84.5c-6.6-4.6-15-6-22.6-5.3a1.1 1.1 0 0 0-1 1.1v10.4c0 .7.5 1.2 1.2 1.1 7.4-.6 15.7.8 22.4 5.3z"
          fill="var(--mark-ivory)"
        />
        <path
          d="M64 84.5c6.6-4.6 15-6 22.6-5.3a1.1 1.1 0 0 1 1 1.1v10.4c0 .7-.5 1.2-1.2 1.1-7.4-.6-15.7.8-22.4 5.3z"
          fill="var(--mark-ivory)"
        />
        <path
          d="M64 84.5v12.6"
          stroke="var(--mark-field-a)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
