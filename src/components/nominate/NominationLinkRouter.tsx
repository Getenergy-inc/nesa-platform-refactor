// Sends every on-site nomination button and link straight to the official
// Google nomination form. Mounted once in App so all ~170 nomination CTAs
// share the single link in officialGoogleForm.ts.

import { useEffect } from "react";
import {
  OFFICIAL_NOMINATION_FORM_URL,
  isNominationHref,
} from "@/config/nomination/officialGoogleForm";
import { trackEvent } from "@/lib/analytics";

export function NominationLinkRouter() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      // Links already pointing at the Google Form keep their normal behaviour.
      if (!href || href.startsWith(OFFICIAL_NOMINATION_FORM_URL)) return;
      if (!isNominationHref(href)) return;

      event.preventDefault();
      trackEvent("official_nomination_form_open", { from: href, page: window.location.pathname });
      const opened = window.open(OFFICIAL_NOMINATION_FORM_URL, "_blank", "noopener,noreferrer");
      if (!opened) window.location.assign(OFFICIAL_NOMINATION_FORM_URL);
    };
    // Capture phase runs before React Router's Link, which then skips navigation.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export default NominationLinkRouter;
