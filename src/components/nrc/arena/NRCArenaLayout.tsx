// NESA-Africa NRC Arena layout — professional secure workspace shell.
// Header · Workspace switcher · Sidebar navigation · Content · Mobile-first.

import { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  FolderKanban,
  ShieldAlert,
  FileSearch,
  MessageSquareText,
  ArrowRightLeft,
  BarChart3,
  UserCircle2,
  BookOpen,
  History,
  LifeBuoy,
  Menu,
  Bell,
  ArrowLeft,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { WorkspaceSwitcher } from "@/components/navigation/WorkspaceSwitcher";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  group: "operations" | "review" | "you";
}

const NAV: NavItem[] = [
  { href: "/nrc/dashboard", label: "Overview", icon: LayoutDashboard, group: "operations" },
  { href: "/nrc/cases", label: "My Assignments", icon: FolderKanban, group: "operations" },
  { href: "/nrc/teams", label: "Team Queue", icon: UsersRound, group: "operations" },
  { href: "/nrc/automation", label: "Automation Engine", icon: Cpu, group: "operations" },
  { href: "/nrc/duplicates", label: "Duplicate Review", icon: ShieldAlert, group: "review" },
  { href: "/nrc/evidence", label: "Evidence Room", icon: FileSearch, group: "review" },
  { href: "/nrc/endorsements", label: "Public Endorsements", icon: MessageSquareText, group: "review" },
  { href: "/nrc/handover/judges", label: "Handover · Judges", icon: ArrowRightLeft, group: "review" },
  { href: "/nrc/handover/governance", label: "Handover · Governance", icon: ArrowRightLeft, group: "review" },
  { href: "/nrc/reports", label: "Reports", icon: BarChart3, group: "operations" },
  { href: "/nrc/directory", label: "NRC Directory", icon: Users, group: "you" },
  { href: "/nrc/profile", label: "My Profile", icon: UserCircle2, group: "you" },
  { href: "/nrc/onboarding", label: "Training & Onboarding", icon: BookOpen, group: "you" },
  { href: "/nrc/audit-log", label: "Audit History", icon: History, group: "you" },
];

const GROUP_LABEL: Record<NavItem["group"], string> = {
  operations: "Operations",
  review: "Review & Handover",
  you: "You",
};

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const groups = (["operations", "review", "you"] as const).map((g) => ({
    key: g,
    items: NAV.filter((n) => n.group === g),
  }));

  return (
    <nav aria-label="NRC Arena" className="space-y-6 text-sm">
      {groups.map((g) => (
        <div key={g.key}>
          <p className="px-3 pb-2 text-[11px] uppercase tracking-wider text-white/40">
            {GROUP_LABEL[g.key]}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/nrc/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors",
                      active
                        ? "bg-gold text-charcoal"
                        : "text-white/75 hover:bg-white/5 hover:text-gold",
                    )}
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function NRCArenaLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3 min-w-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:bg-white/10"
                  aria-label="Open NRC navigation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-charcoal border-r border-white/10 p-4">
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider text-gold/80">NESA-Africa</p>
                  <p className="font-display text-lg font-bold text-white">NRC Arena</p>
                </div>
                <SideNav />
              </SheetContent>
            </Sheet>

            <Link to="/nrc" className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gold/15 flex items-center justify-center">
                <FileSearch className="h-4 w-4 text-gold" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold leading-tight truncate">
                  NRC Arena
                </p>
                <p className="text-[11px] text-white/50 truncate hidden sm:block">
                  Verification · Research · Evidence · Handover
                </p>
              </div>
            </Link>
            <Badge variant="outline" className="hidden md:inline-flex border-gold/40 text-gold text-[10px]">
              NESA-Africa 2026
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <WorkspaceSwitcher />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold" />
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/5">
              <Link to="/">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Exit</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-20">
            {user && (
              <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gold/70">Signed in</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-[11px] text-white/50 mt-0.5">NRC Member · MFA required</p>
              </div>
            )}
            <SideNav />
            <Link
              to="/support"
              className="mt-6 flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-gold"
            >
              <LifeBuoy className="h-3.5 w-3.5" /> NRC Support
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-16 lg:pb-0">{children}</main>
      </div>
    </div>
  );
}

export default NRCArenaLayout;
