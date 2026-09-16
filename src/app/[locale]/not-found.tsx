import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

/** Finished to the same standard as every other page (04). */
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="notfound">
      <div className="shell">
        <h1 className="notfound__title">{t("title")}</h1>
        <Link href="/" className="btn btn--quiet notfound__cta">
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
