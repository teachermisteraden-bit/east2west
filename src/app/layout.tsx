import type { ReactNode } from "react";

/**
 * Passthrough root. The real document shell — <html lang dir> — lives in
 * app/[locale]/layout.tsx, because direction and fonts depend on the locale.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
