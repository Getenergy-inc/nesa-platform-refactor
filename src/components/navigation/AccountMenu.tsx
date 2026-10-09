// Account dropdown for the desktop SiteHeader.
// Signed-out: Sign In · Create Account
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
  Coins,
  Settings,
  UserPlus,
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

const SIGNED_IN = [
  { label: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Nominations", href: "/dashboard/nominations", icon: ClipboardList },
  { label: "Saved Enablers", href: "/dashboard/profile", icon: Bookmark },
  { label: "AGC Activity", href: "/wallet", icon: Coins },
  { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function AccountMenu({ className }: { className?: string }) {
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
          <button
            type="button"
            className={triggerCls}
            aria-label="Sign in menu"
            onClick={() => trackNav("account_menu_open", { device: "desktop", state: "signed_out" })}
          >
            <UserCircle2 className="h-4 w-4" aria-hidden /> Sign In
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-charcoal border-gold/20 text-white/90">
          <DropdownMenuLabel className="text-gold/80 text-xs uppercase tracking-wider">
            Welcome
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              to="/login"
              onClick={() =>
                trackNav("account_menu_item_click", { label: "Sign In", href: "/login" })
              }
              className="flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4" aria-hidden /> Sign In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/signup"
              onClick={() =>
                trackNav("account_menu_item_click", { label: "Create Account", href: "/signup" })
              }
              className="flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" aria-hidden /> Create Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={triggerCls}
          aria-label="Account menu"
          onClick={() => trackNav("account_menu_open", { device: "desktop", state: "signed_in" })}
        >
          <UserCircle2 className="h-4 w-4" aria-hidden />
          <span className="max-w-[8rem] truncate">My Account</span>
        </button>
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
