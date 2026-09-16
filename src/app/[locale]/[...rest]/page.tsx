import { notFound } from "next/navigation";

/**
 * Catches any unmatched path under a locale so the translated, on-brand 404 in
 * [locale]/not-found.tsx renders — inside the normal layout, with the header,
 * footer and the visitor's language intact.
 */
export default function CatchAll(): never {
  notFound();
}
