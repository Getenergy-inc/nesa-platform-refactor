// Two persistent mobile actions: Nominate · Explore Awards.
import { Link, useLocation } from "react-router-dom";
import { Compass, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { NOMINATE_CTA } from "@/config/campaignPhase";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { trackNav } from "@/lib/analytics";

export const MOBILE_MENU_OPEN_EVENT = "nesa:mobile-menu-open";

export function MobileBottomActions() {
  const { pathname } = useLocation();
  const awardsActive = pathname === "/awards" || pathname.startsWith("/awards/");
  const linkCls = (active = false) => cn(
    "flex min-h-14 items-center justify-center gap-2 px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset",
    active ? "text-gold" : "text-white/80 hover:text-gold",
  );

  return (
    <nav aria-label="Mobile quick actions" className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/20 bg-charcoal/95 pb-[env(safe-area-inset-bottom)] backdrop-blur min-[1360px]:hidden">
      <div className="grid grid-cols-2">
        <a
          href={NOMINATE_CTA.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackNav("mobile_bottom_action_click", { label: "Nominate", href: NOMINATE_CTA.href, device: "mobile" })}
          className={cn(linkCls(), "bg-gold text-charcoal hover:bg-gold/90 hover:text-charcoal")}
        >
          <Award className="h-5 w-5" aria-hidden />
          <span>Nominate</span>
        </a>
        <Link
          to={PUBLIC_ACTIONS_2026.exploreAwards.href}
          aria-current={awardsActive ? "page" : undefined}
          onClick={() => trackNav("mobile_bottom_action_click", { label: "Explore Awards", href: PUBLIC_ACTIONS_2026.exploreAwards.href, device: "mobile" })}
          className={linkCls(awardsActive)}
        >
          <Compass className="h-5 w-5" aria-hidden />
          <span>Explore Awards</span>
        </Link>
      </div>
    </nav>
  );
}

export default MobileBottomActions;
