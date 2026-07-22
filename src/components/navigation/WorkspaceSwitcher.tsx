// Global authenticated Workspace switcher.
// Displays only workspaces the current user is authorised for; the switcher
// itself never grants a role — it merely navigates to authorised areas.

import { Link, useLocation } from "react-router-dom";
import { ChevronDown, LayoutDashboard, ShieldCheck, ScrollText, Gavel, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { trackNav } from "@/lib/analytics";

type Workspace = {
  key: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  match: (roles: string[]) => boolean;
};

const WORKSPACES: Workspace[] = [
  {
    key: "nrc",
    label: "NRC Dashboard",
    href: "/nrc/dashboard",
    icon: Search,
    match: (r) => r.includes("nrc") || r.includes("admin"),
  },
  {
    key: "judges",
    label: "Judges Dashboard",
    href: "/judge/dashboard",
    icon: Gavel,
    match: (r) => r.includes("jury") || r.includes("admin"),
  },
  {
    key: "governance",
    label: "Governance Dashboard",
    href: "/dashboard/governance",
    icon: ScrollText,
    match: (r) => r.includes("admin"),
  },
  {
    key: "admin",
    label: "Administration",
    href: "/admin",
    icon: ShieldCheck,
    match: (r) => r.includes("admin"),
  },
  {
    key: "account",
    label: "My Account",
    href: "/account",
    icon: LayoutDashboard,
    match: () => true,
  },
];

export function WorkspaceSwitcher({ className }: { className?: string }) {
  const { user, roles } = useAuth();
  const { pathname } = useLocation();

  if (!user) return null;

  const authorised = WORKSPACES.filter((w) => w.match(roles ?? []));
  if (authorised.length <= 1) return null;

  const current =
    authorised.find((w) => pathname.startsWith(w.href.split("?")[0])) ?? authorised[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch workspace"
          onClick={() => trackNav("workspace_menu_open", { current: current.key })}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs sm:text-sm",
            "text-white/85 hover:text-gold hover:bg-gold/10 transition-colors",
            "border border-white/10 hover:border-gold/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            className,
          )}
        >
          <current.icon className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Workspace:</span>
          <span className="font-medium">{current.label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 bg-charcoal border-gold/20 text-white/90"
      >
        <DropdownMenuLabel className="text-gold/80 text-xs uppercase tracking-wider">
          Authorised Workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {authorised.map((w) => (
          <DropdownMenuItem key={w.key} asChild>
            <Link
              to={w.href}
              onClick={() =>
                trackNav("workspace_switch", { from: current.key, to: w.key, href: w.href })
              }
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                w.key === current.key && "text-gold",
              )}
            >
              <w.icon className="h-4 w-4" aria-hidden />
              <span>{w.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkspaceSwitcher;
