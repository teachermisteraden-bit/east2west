/**
 * Funnel events.
 *
 * Plausible is cookieless and stores nothing that identifies a person, and it
 * loads only when ANALYTICS_ENABLED is true. When it is off — the default —
 * `track` is a no-op, so call sites never need to check.
 *
 * Nothing here records what anyone typed. Events carry the step reached and the
 * campaign that brought them, never field values.
 */
export type FunnelEvent =
  | "Door Click"
  | "Form Start"
  | "Form Step"
  | "Form Submit"
  | "Form Error"
  | "WhatsApp Click"
  | "Download"
  | "Share"
  | "Newsletter Signup";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: FunnelEvent, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Measurement must never break the thing being measured.
  }
}

/**
 * Plausible's tagged-events script reads these class names straight from the
 * markup, so a link can report itself without any JavaScript of ours.
 */
export function tagEvent(event: FunnelEvent, props?: Record<string, string>): string {
  const parts = [`plausible-event-name=${event.replace(/ /g, "+")}`];
  for (const [key, value] of Object.entries(props ?? {})) {
    parts.push(`plausible-event-${key}=${String(value).replace(/ /g, "+")}`);
  }
  return parts.join(" ");
}
