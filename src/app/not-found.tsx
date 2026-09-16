import { defaultLocale, getLocale } from "@/i18n/locales";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

/**
 * Reached only for paths that carry no usable locale prefix, which is outside
 * the [locale] layout — so this renders its own document.
 *
 * It does not redirect: sending an unknown path to /<locale>/404 would need a
 * /404 route to exist, and without one the redirect simply loops.
 */
export default function RootNotFound() {
  const def = getLocale(defaultLocale);

  return (
    <html lang={defaultLocale} dir={def.dir} data-script={def.script} className={fontVariables}>
      <body>
        <main id="main">
          <section className="notfound">
            <div className="shell">
              <h1 className="notfound__title">This path hasn&apos;t been built yet.</h1>
              <a href={`/${defaultLocale}`} className="btn btn--quiet notfound__cta">
                Return home
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
