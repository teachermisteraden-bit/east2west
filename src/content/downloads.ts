/**
 * Files offered on /downloads. No email gate, ever — free means free (02).
 *
 * Empty until the owner adds real PDFs to public/downloads/. An entry here must
 * correspond to a file that exists, or the page would offer a dead link, which
 * non-negotiable 5 forbids.
 */
export type Download = {
  /** Message key under `downloads` for the label. */
  key: "prospectus" | "onePager";
  /** Path under public/, e.g. "/downloads/prospectus-en.pdf". */
  href: string;
  /** Which locale the document is written in. */
  locale: "en" | "ar";
  sizeLabel?: string;
};

export const downloads: Download[] = [];
