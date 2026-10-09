import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

/** Fires a `page_view` analytics event once on mount. */
export function usePageView(path: string, title?: string) {
  useEffect(() => {
    trackPageView(path, title);
  }, [path, title]);
}
