import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { activeLocales } from "@/i18n/locales";
import { allRoutes } from "@/config/nav";

/** Every route in every shipped locale, with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return allRoutes.flatMap((route) =>
    activeLocales.map((l) => ({
      url: `${site.url}/${l.code}${route === "/" ? "" : route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          activeLocales.map((alt) => [alt.code, `${site.url}/${alt.code}${route === "/" ? "" : route}`]),
        ),
      },
    })),
  );
}
