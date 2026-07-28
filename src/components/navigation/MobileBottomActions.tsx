// Mobile bottom actions bar — 4 actions only: Explore · Nominate · Vote · Menu.
// Menu opens the same mobile drawer used in SiteHeader (dispatches a
// window-level event that SiteHeader listens for).

import { Link, useLocation } from "react-router-dom";
import { Compass, Award, Vote, Menu as MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_PHASE, NOMINATE_CTA } from "@/config/campaignPhase";
import { trackNav } from "@/lib/analytics";

export const MOBILE_MENU_OPEN_EVENT = "nesa:mobile-menu-open";

interface Action {
  id: string;
  label: string;
  href?: string;
  icon: typeof Compass;
  onClick?: () => void;
  matchPrefix?: string;
}

export function MobileBottomActions() {
  const { pathname } = useLocation();

  // Vote action uses the phase-driven primary/secondary from campaignPhase.
  const voteTarget =
    CURRENT_PHASE.phase === "nomination"
      ? { label: "Vote", href: "/awards/gold-blue-garnet" } // still surface Vote even in nomination phase
      : CURRENT_PHASE.phase === "voting"
      ? { label: "Vote", href: CURRENT_PHASE.primary.href }
      : { label: "Vote", href: "/awards/gold-blue-garnet" };

  const actions: Action[] = [
    {
      id: "explore",
      label: "Explore",
      href: "/nominees",
      icon: Compass,
      matchPrefix: "/nominees",
    },
    {
      id: "nominate",
      label: "Nominate",
      href: NOMINATE_CTA.href,
      icon: Award,
      matchPrefix: "/nominate",
    },
    {
      id: "vote",
      label: voteTarget.label,
      href: voteTarget.href,
      icon: Vote,
      matchPrefix: "/awards/gold-blue-garnet",
    },
    {
      id: "menu",
      label: "Menu",
      icon: MenuIcon,
      onClick: () => {
        trackNav("mobile_bottom_menu_click", { device: "mobile" });
        window.dispatchEvent(new CustomEvent(MOBILE_MENU_OPEN_EVENT));
      },
    },
  ];

  const isActive = (a: Action) =>
    !!a.matchPrefix &&
    (pathname === a.matchPrefix || pathname.startsWith(a.matchPrefix + "/"));

  return (
    <nav
      aria-label="Mobile quick actions"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 min-[1360px]:hidden",
        "bg-charcoal/95 backdrop-blur border-t border-gold/20",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <ul className="grid grid-cols-4">
        {actions.map((a) => {
          const active = isActive(a);
          const cls = cn(
            "flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-12",
            "text-[11px] font-medium",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset",
            active ? "text-gold" : "text-white/75 hover:text-gold",
          );
          const inner = (
            <>
              <a.icon className="h-5 w-5" aria-hidden />
              <span>{a.label}</span>
            </>
          );
          return (
            <li key={a.id} className="contents">
              {a.href ? (
                <Link
                  to={a.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() =>
                    trackNav("mobile_bottom_action_click", {
                      label: a.label,
                      href: a.href,
                      device: "mobile",
                    })
                  }
                  className={cls}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={a.onClick}
                  className={cls}
                  aria-label={a.label}
                >
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileBottomActions;
