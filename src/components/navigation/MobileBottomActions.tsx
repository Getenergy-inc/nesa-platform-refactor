// Four persistent mobile shortcuts: Home · Recognition · Nominate · Get Involved.
import { Link, useLocation } from "react-router-dom";
import { Award, FileCheck, Heart, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOBILE_QUICK_ACTIONS } from "@/config/siteNavigation";
import { trackNav } from "@/lib/analytics";

export const MOBILE_MENU_OPEN_EVENT = "nesa:mobile-menu-open";

const ACTION_ICONS = {
  Home,
  Recognition: Award,
  Nominate: FileCheck,
  "Get Involved": Heart,
} as const;

export function MobileBottomActions() {
  const { pathname } = useLocation();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Mobile quick actions" className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/20 bg-charcoal/95 pb-[env(safe-area-inset-bottom)] backdrop-blur min-[1360px]:hidden">
      <div className="grid grid-cols-4">
        {MOBILE_QUICK_ACTIONS.map((item) => {
          const Icon = ACTION_ICONS[item.label as keyof typeof ACTION_ICONS];
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              data-preserve-nomination-route={item.href === "/nominate" ? "true" : undefined}
              aria-current={active ? "page" : undefined}
              onClick={() => trackNav("mobile_bottom_action_click", { label: item.label, href: item.href, device: "mobile" })}
              className={cn(
                "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[11px] font-semibold leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset",
                active ? "text-gold" : "text-white/80 hover:text-gold",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomActions;
