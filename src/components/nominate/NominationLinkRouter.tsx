// Sends every on-site nomination button and link straight to the official
// Google nomination form. Real anchor hrefs preserve keyboard, modified-click
// and middle-click behavior; the click handler remains a legacy safety net.

import { useEffect } from "react";
import {
  OFFICIAL_NOMINATION_FORM_URL,
  isNominationHref,
} from "@/config/nomination/officialGoogleForm";
import { trackEvent } from "@/lib/analytics";

function upgradeNominationAnchors(root: ParentNode) {
  const anchors = root instanceof HTMLAnchorElement
    ? [root]
    : Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href]"));
  for (const anchor of anchors) {
    if (anchor.dataset.preserveNominationRoute === "true") continue;
    const href = anchor.getAttribute("href");
    if (!href || !isNominationHref(href)) continue;
    if (!href.startsWith(OFFICIAL_NOMINATION_FORM_URL)) {
      anchor.dataset.nominationOriginalHref = href;
      anchor.href = OFFICIAL_NOMINATION_FORM_URL;
    }
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
}

export function NominationLinkRouter() {
  useEffect(() => {
    const upgrade = () => upgradeNominationAnchors(document);
    upgrade();
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          if (node instanceof Element) upgradeNominationAnchors(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.dataset.preserveNominationRoute === "true") return;
      const href = anchor.dataset.nominationOriginalHref ?? anchor.getAttribute("href");
      if (!href || !isNominationHref(href)) return;
      trackEvent("official_nomination_form_open", { from: href, page: window.location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}

export default NominationLinkRouter;
