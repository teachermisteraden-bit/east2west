import type { ReactNode } from "react";

/**
 * Social proof ships hidden until it is real (non-negotiable 1).
 *
 * These components render NOTHING when their data is empty — no "coming soon"
 * placeholder where a testimonial would go, no greyed-out logo strip, nothing
 * that could be mistaken for a claim the society cannot yet make. When the owner
 * adds real, consented data, the section appears on its own.
 */
export function ProofSlot<T>({
  items,
  children,
}: {
  items: readonly T[] | undefined | null;
  children: (items: readonly T[]) => ReactNode;
}) {
  if (!items || items.length === 0) return null;
  return <>{children(items)}</>;
}

/** Real, consented quotes only. No stock faces, no invented words. */
export type Testimonial = { quote: string; name: string; role?: string };
/** Confirmed partners only. No logo appears before an agreement exists. */
export type PartnerLogo = { name: string; src: string; href?: string };
/** Speakers who have agreed to appear. */
export type Speaker = { name: string; role: string; org?: string };

export const testimonials: Testimonial[] = [];
export const partnerLogos: PartnerLogo[] = [];
export const speakers: Speaker[] = [];
