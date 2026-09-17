import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";
import "./admin.css";

/**
 * The owner's workspace.
 *
 * Deliberately outside the [locale] routes: it is a tool rather than part of the
 * site, so it carries no hreflang, never appears in the sitemap, and is not
 * duplicated per language. It is written in English, which the owner reads; if
 * that changes it moves under [locale] like everything else.
 */
export const metadata: Metadata = {
  title: "Admin · East to West",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-script="latin" className={fontVariables}>
      <body>
        <div className="admin">
          <header className="admin__bar">
            <Link href="/admin" className="admin__brand">
              East to West — admin
            </Link>
            <nav className="admin__nav">
              <Link href="/admin">Submissions</Link>
              <Link href="/admin/opportunities">Opportunities</Link>
              <a href="/admin/export.csv">Export CSV</a>
            </nav>
          </header>
          <main className="admin__main">{children}</main>
        </div>
      </body>
    </html>
  );
}
