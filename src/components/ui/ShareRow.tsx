"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Sharing. Native share where the device offers it, then WhatsApp, LinkedIn and
 * X, then copy-to-clipboard as the fallback that always works.
 *
 * No share-count widgets, no third-party SDKs — these are plain links, so there
 * is no tracking and nothing to load.
 */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked: the URL is visible beside the button anyway.
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
        return true;
      } catch {
        // Cancelled or unsupported: fall through to the explicit links.
      }
    }
    return false;
  }

  return (
    <div className="share">
      <p className="share__url">
        <code>{url}</code>
      </p>
      <ul className="share__list">
        <li>
          <button type="button" className="btn btn--quiet btn--sm" onClick={copy}>
            {copied ? t("copied") : t("copy")}
          </button>
        </li>
        <li>
          <button type="button" className="btn btn--quiet btn--sm" onClick={nativeShare}>
            {t("title")}
          </button>
        </li>
        <li>
          <a
            className="navlink"
            href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("whatsapp")}
          </a>
        </li>
        <li>
          <a
            className="navlink"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("linkedin")}
          </a>
        </li>
        <li>
          <a
            className="navlink"
            href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("x")}
          </a>
        </li>
      </ul>
    </div>
  );
}
