// Account dropdown for the desktop SiteHeader.
// Signed-out: destination selector; existing route guards remain authoritative.
// Signed-in : My Dashboard · My Nominations · Saved Enablers · My Voting Activity
//             AGC Activity · Account Settings · Sign Out
// One click → one analytics event via trackNav.

import { Link } from "react-router-dom";
import {
  UserCircle2,
  LogIn,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  Bookmark,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { trackNav } from "@/lib/analytics";
import { SIGN_IN_WORKSPACES } from "@/config/siteNavigation";

const SIGNED_IN = [
  { label: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Nominations", href: "/dashboard/nominations", icon: ClipboardList },
  { label: "Saved Enablers", href: "/dashboard/profile", icon: Bookmark },
  { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function AccountMenu({ className, label, menuLabel }: { className?: string; label?: string; menuLabel?: string }) {
  const { user, signOut } = useAuth();

  const triggerCls = cn(
    "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-white/85",
    "hover:text-gold hover:bg-gold/10 transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
    className,
  );

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            className={triggerCls}
            aria-label={menuLabel ?? "Sign in menu"}
            onClick={() => trackNav("account_menu_open", { device: "desktop", state: "signed_out" })}
          >
            {!label && <UserCircle2 className="h-4 w-4" aria-hidden />} {label ?? "Sign In"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-charcoal border-gold/20 text-white/90">
          <DropdownMenuLabel className="text-gold/80 text-xs uppercase tracking-wider">
            Select Your Workspace
          </DropdownMenuLabel>
          {SIGN_IN_WORKSPACES.map(({ label, href, description }) => (
            <DropdownMenuItem asChild key={href}>
              <Link to={href} onClick={() => trackNav("account_menu_item_click", { label, href })}
                className="flex items-start gap-2 cursor-pointer">
                <LogIn className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
                <span>{label}{description && <span className="block text-xs text-muted-foreground">{description}</span>}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className={triggerCls}
          aria-label={menuLabel ?? "Account menu"}
          onClick={() => trackNav("account_menu_open", { device: "desktop", state: "signed_in" })}
        >
          {!label && <UserCircle2 className="h-4 w-4" aria-hidden />}
          <span className="max-w-[8rem] truncate">{label ?? "My Account"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 bg-charcoal border-gold/20 text-white/90">
        <DropdownMenuLabel className="text-gold/80 text-xs uppercase tracking-wider">
          Signed in
        </DropdownMenuLabel>
        {SIGNED_IN.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem asChild key={href}>
            <Link
              to={href}
              onClick={() => trackNav("account_menu_item_click", { label, href })}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-gold/15" />
        <DropdownMenuItem
          onSelect={async (e) => {
            e.preventDefault();
            trackNav("account_menu_item_click", { label: "Sign Out" });
            await signOut();
          }}
          className="flex items-center gap-2 cursor-pointer text-white/85 focus:text-gold"
        >
          <LogOut className="h-4 w-4" aria-hidden /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AccountMenu;
