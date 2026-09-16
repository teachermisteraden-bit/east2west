/**
 * Campaign attribution.
 *
 * Read from the URL and from the first-party cookie that /go/[campaign] sets, so
 * a visitor who arrives from a poster QR code and browses for a while is still
 * attributed when they eventually apply.
 *
 * None of this is a tracker: no third-party script, no cross-site identifier,
 * nothing personal. It records which poster or link brought someone in.
 */
export type Tracking = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  campaign?: string;
  ref?: string;
};

function cookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function readTracking(): Tracking {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const get = (key: string) => params.get(key) ?? undefined;

  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    // The URL wins; the cookie remembers an earlier visit.
    campaign: get("campaign") ?? cookie("e2w_campaign"),
    ref: get("ref") ?? cookie("e2w_ref"),
  };
}

/** Remember a referral code so it survives a browse before applying. */
export function rememberRef(): void {
  if (typeof window === "undefined") return;
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (!ref) return;
  const maxAge = 60 * 60 * 24 * 30;
  document.cookie = `e2w_ref=${encodeURIComponent(ref)}; max-age=${maxAge}; path=/; samesite=lax`;
}
