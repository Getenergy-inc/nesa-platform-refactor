// Mobile-only sticky Nominate CTA bar.
// Sits ABOVE the MobileBottomNav (which is ~64px tall) so it never covers
// primary navigation. Only rendered on mobile via `lg:hidden`. Use this on
// high-conversion pages (homepage, category pages) — not site-wide.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  /** Pre-selected category slug, if used on a category page. */
  categorySlug?: string;
  /** Where the CTA was placed, for analytics. */
  source?: string;
}

export function MobileStickyNominateCTA({ categorySlug, source = "homepage" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = categorySlug ? `/nominate?category=${categorySlug}` : "/nominate";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="lg:hidden fixed left-0 right-0 z-40 px-3"
          style={{ bottom: "calc(4rem + env(safe-area-inset-bottom))" }}
          role="region"
          aria-label="Quick nominate"
        >
          <Link
            to={href}
            onClick={() =>
              trackEvent("nominate_mobile_click", {
                location: "sticky_cta",
                source,
                category: categorySlug ?? null,
              })
            }
            className="group flex items-center justify-center gap-2 h-12 w-full rounded-full bg-gold text-charcoal font-semibold text-sm shadow-[0_8px_24px_-6px_hsl(var(--gold)/0.6)] active:scale-[0.99] transition"
          >
            <Trophy className="h-4 w-4" />
            <span>Nominate for 2026</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileStickyNominateCTA;
