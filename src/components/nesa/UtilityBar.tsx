// Slim governance / quick-action strip rendered above the primary NESA-Africa header.
// Compact, mobile-aware, never oversized. Uses charcoal/gold tokens (no navy per brand rules).

import { Link } from "react-router-dom";
import {
  Heart,
  Handshake,
  Users,
  Gavel,
  LayoutDashboard,
  Wallet,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/i18n";
import { cn } from "@/lib/utils";

type UtilityItem = {
  label: string;
  short?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  emphasize?: boolean;
};

const PUBLIC_ITEMS: UtilityItem[] = [
  { label: "Donate", href: "/donate", icon: Heart, emphasize: true },
  { label: "Sponsor", href: "/sponsorship-packages", icon: Handshake },
  { label: "Volunteer", short: "Volunteer", href: "/volunteer", icon: Users },
  { label: "Judge", short: "Judge", href: "/judges", icon: Gavel },
];

export function UtilityBar() {
  const { user } = useAuth();

  return (
    <div className="hidden md:block w-full bg-charcoal/95 border-b border-gold/15 text-[11px] lg:text-[12px]">
      <div className="container mx-auto px-4 flex items-center justify-between h-8">
        {/* Left: governance quick-actions */}
        <nav aria-label="Quick actions" className="flex items-center gap-1 lg:gap-2">
          {PUBLIC_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors",
                "text-white/70 hover:text-gold hover:bg-gold/10",
                item.emphasize && "text-gold/90 font-semibold",
              )}
            >
              <item.icon className="h-3 w-3" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: account + language */}
        <div className="flex items-center gap-1 lg:gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-white/70 hover:text-gold hover:bg-gold/10"
              >
                <LayoutDashboard className="h-3 w-3" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/wallet"
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-white/70 hover:text-gold hover:bg-gold/10"
              >
                <Wallet className="h-3 w-3" aria-hidden="true" />
                <span>Wallet</span>
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-white/70 hover:text-gold hover:bg-gold/10"
            >
              <LogIn className="h-3 w-3" aria-hidden="true" />
              <span>Login</span>
            </Link>
          )}
          <span className="h-3 w-px bg-gold/20 mx-1" aria-hidden="true" />
          <LanguageSwitcher className="text-[11px]" />
        </div>
      </div>
    </div>
  );
}

export default UtilityBar;
