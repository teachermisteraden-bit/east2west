"use client";

import { useEffect } from "react";

/**
 * The gold ring (01 §2).
 *
 * A small ring that trails the pointer and opens over anything interactive.
 *
 * Three rules it must not break:
 *   - the system cursor is never hidden, so nothing is lost if this fails;
 *   - it runs only for a fine pointer that can hover, so a phone never pays for
 *     it and a touch target is never covered;
 *   - it does not exist at all under reduced motion.
 *
 * Deliberately raw DOM rather than React state: a pointermove handler that set
 * state would re-render the tree on every mouse movement. This writes one
 * transform to one element, on a rAF, and touches nothing else.
 */
export function Cursor() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    const ring = document.createElement("div");
    ring.className = "cursorring";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);

    let x = -100;
    let y = -100;
    let frame = 0;

    const draw = () => {
      frame = 0;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    // Position comes from any pointer event, not only pointermove. If the
    // visitor's pointer is already resting over the page when this mounts, no
    // pointermove will ever arrive until they happen to move -- and the ring
    // would sit dead at -100,-100. pointerover fires when the element beneath a
    // still pointer changes, which is exactly the hydration case, and it
    // carries the current coordinates.
    const track = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
      if (ring.dataset.on !== "true") ring.dataset.on = "true";
    };

    // The ring opens over anything the visitor can act on.
    const INTERACTIVE = "a, button, summary, input, select, textarea, label, [role='button'], [tabindex]:not([tabindex='-1'])";
    const onOver = (event: PointerEvent) => {
      track(event);
      const target = event.target as Element | null;
      ring.dataset.open = target?.closest?.(INTERACTIVE) ? "true" : "";
    };
    const onLeave = () => {
      ring.dataset.on = "";
    };

    window.addEventListener("pointermove", track, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", track);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      ring.remove();
    };
  }, []);

  return null;
}
