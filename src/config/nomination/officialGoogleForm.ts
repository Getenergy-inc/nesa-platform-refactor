// Official NESA-Africa 2026 nomination Google Form — the single destination
// for every public nomination button and CTA. Change the link here only.

export const OFFICIAL_NOMINATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeBqubtaJlGCsc6n_NUuL3j_o2DVPWhIrq8ifm7-W3Vn1GxtQ/viewform";

export const OFFICIAL_NOMINATION_FORM_EMBED_URL = `${OFFICIAL_NOMINATION_FORM_URL}?embedded=true`;

/** True for any in-site link that starts or continues a nomination. */
export function isNominationHref(href: string | null | undefined): boolean {
  if (!href) return false;
  let path = href;
  try {
    const url = new URL(href, "https://nesa.africa");
    if (url.origin !== "https://nesa.africa" && !href.startsWith("/")) {
      return url.href.startsWith(OFFICIAL_NOMINATION_FORM_URL);
    }
    path = `${url.pathname}${url.hash}`;
  } catch {
    return false;
  }
  if (path === "/nominate/pages" || path.startsWith("/nominate/help-me-choose")) return false;
  return path === "/nominate" || path.startsWith("/nominate/") || path.startsWith("/nominate#") || path.endsWith("#nominate");
}
