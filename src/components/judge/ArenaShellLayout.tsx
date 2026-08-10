import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ArenaSeo } from "@/components/arena/ArenaSeo";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  BarChart3,
  Scale,
  FileText,
  Menu,

} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArenaBrand,
  ArenaRailBadge,
  ArenaTopBar,
  ArenaFooter,
} from "@/components/arena/ArenaChrome";

const navItems = [
  { title: "Dashboard", url: "/judges-arena", icon: LayoutDashboard, end: true },
  { title: "My Assignments", url: "/judges-arena/nominees", icon: Users, badge: "12" },
  { title: "Discussion Arena", url: "/judges-arena/discussion", icon: MessageSquare, badge: "3" },
  { title: "Scoring Rubrics", url: "/judges/scoring", icon: Scale },
  { title: "Calendar & Deadlines", url: "/events/calendar", icon: Calendar },
  { title: "Reports & Analytics", url: "/judges/results", icon: BarChart3 },
  { title: "Resources", url: "/resources", icon: BookOpen },
  { title: "Guidelines", url: "/judges/help", icon: FileText },
];

function ArenaNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Judges Arena" className="flex-1 space-y-1 px-3">
      {navItems.map((item) => {
        const active = item.end ? pathname === item.url : pathname.startsWith(item.url);
        return (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.end}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gradient-to-r from-gold/25 to-transparent text-gold border-l-2 border-gold"
                : "text-white/70 hover:bg-white/5 hover:text-gold",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge variant="outline" className="h-5 border-gold/40 text-gold text-[10px]">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

function ArenaRail({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-arena-rail">
      <ArenaBrand workspace="Judges Arena" to="/judges-arena" />
      <ArenaNav onNavigate={onNavigate} />
      <ArenaRailBadge />
    </div>
  );
}

export default function JudgesArenaLayout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-arena-bg text-arena-text">
      <ArenaSeo workspace="Judges Arena" />

      <div className="flex min-h-screen w-full">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <ArenaRail />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <ArenaTopBar
            title="NESA-Africa Judges Arena"
            subtitle="Private Deliberation · Audit Enabled"
            leading={
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open Judges Arena navigation"
                    className="lg:hidden text-white hover:bg-white/10"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 border-r border-white/10 bg-arena-rail p-0">
                  <ArenaRail onNavigate={() => setOpen(false)} />
                </SheetContent>
              </Sheet>
            }
            statusLabel="Judging Live"
            statusDetail="2026 Cycle"
            statusTone="live"
            identityName={user?.email ?? "Judge"}
            identityRole="Panel Judge"
            notifications={3}
          />

          <main className="relative flex-1 overflow-x-hidden">
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-0 flex select-none items-center justify-center"
            >
              <div className="rotate-[-22deg] whitespace-nowrap text-[120px] font-black tracking-widest text-gold/[0.03] md:text-[180px]">
                CONFIDENTIAL · JUDGES ARENA
              </div>
            </div>
            <div className="relative z-10 mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
            <div className="relative z-10 mx-auto max-w-[1600px]">
              <ArenaFooter workspace="Judges Arena" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

