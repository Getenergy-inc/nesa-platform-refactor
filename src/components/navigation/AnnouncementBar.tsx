// Slim announcement bar above the site header. Rotates through up to 3
// messages, supports clickable links, dismissible for the session.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { ANNOUNCEMENTS, ANNOUNCEMENT_ROTATE_MS } from "@/config/announcements";
import { trackEvent } from "@/lib/analytics";

const DISMISS_KEY = "nesa:announcement-dismissed";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const items = ANNOUNCEMENTS.slice(0, 3);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const mq = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq && mq.matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % items.length), ANNOUNCEMENT_ROTATE_MS);
    return () => window.clearInterval(t);
  }, [items.length]);

  if (dismissed || items.length === 0) return null;
  const current = items[index];

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    trackEvent("announcement_dismiss", {});
  };

  const inner = (
    <span className="truncate">{current.text}</span>
  );

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="w-full bg-gold text-charcoal text-xs sm:text-[13px]"
    >
      <div className="container mx-auto px-4 h-8 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 flex items-center justify-center">
          {current.href ? (
            <Link
              to={current.href}
              onClick={() => trackEvent(current.analyticsId ?? "announcement_click", { href: current.href, id: current.id })}
              className="font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal rounded"
            >
              {inner}
            </Link>
          ) : inner}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 p-1 rounded hover:bg-charcoal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;
