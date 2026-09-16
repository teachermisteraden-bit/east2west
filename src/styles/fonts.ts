import { Bodoni_Moda, Amiri, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";

/**
 * Self-hosted and subset by next/font at build time. Each exposes a CSS variable
 * that tokens.css consumes, so swapping a face later touches only this file.
 */

// Display, Latin — the high-contrast serif.
export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-bodoni",
});

// Display, Arabic — classical naskh. Real weights only; never faux-bolded.
export const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

// Body, Latin.
export const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex",
});

// Body, Arabic.
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-arabic",
});

export const fontVariables = [bodoni.variable, amiri.variable, plex.variable, plexArabic.variable].join(" ");
