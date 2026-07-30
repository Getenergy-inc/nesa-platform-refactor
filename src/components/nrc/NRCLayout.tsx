// NRC portal shell — branded with the shared ArenaChrome so every NRC route
// renders the same navy/gold secure-workspace identity. Navigation items and
// page content are unchanged.

import { Link, useLocation } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArenaBrand,
  ArenaRailBadge,
  ArenaTopBar,
  ArenaFooter,
} from "@/components/arena/ArenaChrome";
import { ArenaSeo } from "@/components/arena/ArenaSeo";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  ArrowLeft,
} from "lucide-react";

interface NRCLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/nrc", label: "Dashboard", icon: LayoutDashboard },
  { href: "/nrc/my-queue", label: "My Queue", icon: ClipboardList },
  { href: "/nrc/members", label: "Members", icon: Users },
  { href: "/nrc/settings", label: "Settings", icon: Settings },
];

export function NRCLayout({ children }: NRCLayoutProps) {
  const location = useLocation();
  const { currentEdition } = useSeason();
  const { user } = useAuth();

  const isActive = (href: string) =>
    location.pathname === href ||
    (href !== "/nrc" && location.pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text">
      <ArenaSeo workspace="NRC Arena" />
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-arena-rail lg:block">
          <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
            <ArenaBrand workspace="NRC Arena" to="/nrc" />
            <nav aria-label="NRC portal" className="flex-1 space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-gold/25 to-transparent text-gold border-l-2 border-gold"
                      : "text-white/70 hover:bg-white/5 hover:text-gold",
                  )}
                >
                  <item.icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              ))}
            </nav>
            <ArenaRailBadge lines={["2026 NESA-AFRICA", "NOMINEE RESEARCH", "CORPS ARENA"]} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <ArenaTopBar
            title="NESA-Africa NRC Arena"
            subtitle="Verification · Research · Evidence · Handover"
            statusLabel="Verification Live"
            statusDetail={currentEdition.name}
            statusTone="live"
            identityName={user?.email ?? "NRC Member"}
            identityRole="NRC Member"
            notifications={3}
            actions={
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden text-white/70 hover:bg-white/5 hover:text-gold lg:inline-flex"
              >
                <Link to="/dashboard">
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Exit
                </Link>
              </Button>
            }
          />

          <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-16">{children}</main>
          <ArenaFooter workspace="NRC Arena" />
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-arena-rail lg:hidden">
        <nav aria-label="NRC portal (mobile)" className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs transition-colors",
                isActive(item.href) ? "text-gold" : "text-white/60 hover:text-gold",
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden />
              <span className="sr-only sm:not-sr-only">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
