import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";
import { getLocale } from "@/i18n/locales";
import { toWords, hasRtl } from "./bidi";

/**
 * Open Graph cards.
 *
 * Drawn from the same tokens and the same approved copy as the site, so a link
 * shared into WhatsApp looks like the page it opens. Nothing is claimed here
 * that the page does not already say.
 *
 * Replaced by the artwork in brand/ when Claude Design delivers it — see
 * docs/brand-swap.md.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const TOKENS = {
  obsidian: "#101315",
  ivory: "#F5F1E8",
  gold: "#D9B878",
  goldSoft: "rgba(217,184,120,0.25)",
  muted: "#A9ADA6",
};

/** Satori reads real font data; .woff is supported, .woff2 is not. */
async function fontFile(pkg: string, file: string): Promise<ArrayBuffer> {
  const path = join(process.cwd(), "node_modules", pkg, "files", file);
  const buffer = await readFile(path);
  return new Uint8Array(buffer).buffer as ArrayBuffer;
}

export async function renderOgImage({
  locale,
  title,
  eyebrow,
}: {
  locale: string;
  title: string;
  eyebrow: string;
}): Promise<ImageResponse> {
  const isArabic = getLocale(locale).script === "arabic";

  // Satori shapes Arabic but does not reorder it, so the words are placed by
  // flexbox instead — see src/lib/bidi.ts.
  const Line = ({ text, style }: { text: string; style: React.CSSProperties }) => {
    if (!hasRtl(text)) return <div style={{ display: "flex", ...style }}>{text}</div>;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          ...style,
        }}
      >
        {toWords(text).map((word, i) => (
          <span key={i} style={{ display: "flex" }}>
            {word}
          </span>
        ))}
      </div>
    );
  };

  // IBM Plex Sans Arabic covers both scripts, so one face serves either card;
  // Bodoni gives the Latin card its display serif.
  const [plex, plexBold, bodoni] = await Promise.all([
    fontFile("@fontsource/ibm-plex-sans-arabic", "ibm-plex-sans-arabic-arabic-400-normal.woff"),
    fontFile("@fontsource/ibm-plex-sans-arabic", "ibm-plex-sans-arabic-arabic-600-normal.woff"),
    fontFile("@fontsource/bodoni-moda", "bodoni-moda-latin-400-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: TOKENS.obsidian,
          padding: 72,
          // The dawn light, rising from the eastern edge as it does on the page.
          backgroundImage:
            "radial-gradient(120% 90% at 100% 80%, rgba(233,201,160,0.30) 0%, rgba(217,184,120,0.10) 34%, rgba(16,19,21,0) 66%)",
          direction: isArabic ? "rtl" : "ltr",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Line
            text={eyebrow}
            style={{
              fontFamily: "Plex",
              fontSize: 22,
              fontWeight: 600,
              color: TOKENS.gold,
              letterSpacing: isArabic ? 0 : 3,
              textTransform: isArabic ? "none" : "uppercase",
              gap: isArabic ? 8 : 0,
            }}
          />
        </div>

        <Line
          text={title}
          style={{
            fontFamily: isArabic ? "Plex" : "Bodoni",
            fontSize: isArabic ? 58 : 70,
            lineHeight: 1.25,
            color: TOKENS.ivory,
            maxWidth: 1000,
            gap: isArabic ? 16 : 0,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", width: "100%", height: 1, background: TOKENS.goldSoft }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            {/* The lockup keeps its designed orientation in both languages. */}
            <div style={{ display: "flex", flexDirection: "column", direction: "ltr" }}>
              <div style={{ fontFamily: "Bodoni", fontSize: 30, color: TOKENS.ivory }}>East to West</div>
              <Line
                text="الشرق إلى الغرب"
                style={{ fontFamily: "Plex", fontSize: 20, color: TOKENS.muted, gap: 6 }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Plex", data: plex, weight: 400, style: "normal" },
        { name: "Plex", data: plexBold, weight: 600, style: "normal" },
        { name: "Bodoni", data: bodoni, weight: 400, style: "normal" },
      ],
    },
  );
}

/** Builds the card for a page from its own approved copy. */
export async function ogForPage(locale: string, namespace: string, titleKey: string): Promise<ImageResponse> {
  const t = await getTranslations({ locale, namespace });
  const tc = await getTranslations({ locale, namespace: "common" });
  return renderOgImage({ locale, title: t(titleKey), eyebrow: tc("founded") });
}
