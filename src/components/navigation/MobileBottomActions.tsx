// Two persistent phone shortcuts: Nominate · Support a School.
import { Link, useLocation } from "react-router-dom";
import { FileCheck, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { MOBILE_QUICK_ACTIONS } from "@/config/siteNavigation";
import { trackNav } from "@/lib/analytics";

export const MOBILE_MENU_OPEN_EVENT = "nesa:mobile-menu-open";

const ACTION_ICONS = {
  Nominate: FileCheck,
  "Support a School": Heart,
} as const;

export function MobileBottomActions() {
  const { pathname } = useLocation();
  const { t } = useTranslation("pages");
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label={t("mobileActions.label", "Mobile quick actions")} className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/20 bg-charcoal/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-2">
        {MOBILE_QUICK_ACTIONS.map((item) => {
          const Icon = ACTION_ICONS[item.label as keyof typeof ACTION_ICONS];
          const active = isActive(item.href);
          const external = /^https?:\/\//.test(item.href);
          const label = t(`mobileActions.${item.analyticsId}`, item.label);
          const className = cn(
            "flex min-h-14 min-w-0 items-center justify-center gap-2 px-2 py-2 text-center text-xs font-semibold leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset",
            active ? "text-gold" : "text-white/80 hover:text-gold",
          );
          const content = <><Icon className="h-4 w-4 shrink-0" aria-hidden /><span>{label}</span></>;
          const onClick = () => trackNav("mobile_bottom_action_click", { label: item.label, href: item.href, device: "mobile" });
          return external ? (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>{content}</a>
          ) : (
            <Link key={item.href} to={item.href} aria-current={active ? "page" : undefined} onClick={onClick} className={className}>{content}</Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomActions;
