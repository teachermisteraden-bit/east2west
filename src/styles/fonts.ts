/**
 * Font wiring.
 *
 * The faces themselves are declared in fonts.css and served from /fonts, not
 * loaded through next/font — see the note at the top of that file for why.
 * This module holds only what the layout needs: which file to preload for a
 * given script.
 */
export type Script = "latin" | "arabic";

/** The display face sets the h1, which is the LCP element on every page. */
export const displayFontFor = (script: Script): string =>
  script === "arabic" ? "/fonts/amiri-400.woff2" : "/fonts/bodoni-400.woff2";

/** The body face carries almost everything else, so it is worth the second preload. */
export const bodyFontFor = (script: Script): string =>
  script === "arabic" ? "/fonts/plex-ar-400.woff2" : "/fonts/plex-400.woff2";

/** No longer needed: the faces are global, not scoped by a generated class. */
export const fontVariables = "";
