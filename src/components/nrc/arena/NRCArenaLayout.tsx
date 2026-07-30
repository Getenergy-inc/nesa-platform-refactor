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
    <div className="min-h-screen bg-arena-bg text-arena-text">
      <div className="flex min-h-screen w-full">
        {/* Brand rail */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-arena-rail lg:block">
          <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
            <ArenaBrand workspace="NRC Arena" to="/nrc" />
            {user && (
              <div className="mx-3 mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gold/70">Signed in</p>
                <p className="truncate text-sm font-medium">{user.email}</p>
                <p className="mt-0.5 text-[11px] text-arena-muted">NRC Member · MFA required</p>
              </div>
            )}
            <div className="flex-1 px-1">
              <SideNav />
              <Link
                to="/support"
                className="mt-6 flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-gold"
              >
                <LifeBuoy className="h-3.5 w-3.5" /> NRC Support
              </Link>
            </div>
            <ArenaRailBadge lines={["2026 NESA-AFRICA", "NOMINEE RESEARCH", "CORPS ARENA"]} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <ArenaTopBar
            title="NESA-Africa NRC Arena"
            subtitle="Verification · Research · Evidence · Handover"
            leading={
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
                <SheetContent side="left" className="w-72 overflow-y-auto border-r border-white/10 bg-arena-rail p-0">
                  <ArenaBrand workspace="NRC Arena" to="/nrc" />
                  <div className="px-1 pb-6">
                    <SideNav />
                  </div>
                </SheetContent>
              </Sheet>
            }
            statusLabel="Verification Live"
            statusDetail="2026 Cycle"
            statusTone="live"
            identityName={user?.email ?? "NRC Member"}
            identityRole="NRC Member"
            notifications={3}
            actions={
              <div className="hidden lg:flex items-center gap-2">
                <WorkspaceSwitcher />
                <Button variant="ghost" size="sm" asChild className="text-white/70 hover:bg-white/5 hover:text-gold">
                  <Link to="/">
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Exit
                  </Link>
                </Button>
              </div>
            }
          />

          <main className="min-w-0 flex-1 px-4 py-6 pb-16 sm:px-6">{children}</main>
          <ArenaFooter workspace="NRC Arena" />
        </div>
      </div>
    </div>
  );
}


export default NRCArenaLayout;
