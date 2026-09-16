import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale negotiation. Next 16 calls this file `proxy`; it is the same request
 * hook that used to be `middleware`.
 *
 * Arabic browsers land on /ar, everyone else on /en, and the choice is
 * remembered. `/go/*` is excluded so campaign links resolve their own locale.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|go|_next|_vercel|.*\\..*).*)"],
};
