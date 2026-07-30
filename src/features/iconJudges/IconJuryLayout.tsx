import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard, ClipboardList, Users, AlertTriangle,
  FileEdit, StickyNote, Trophy, UserCircle, LifeBuoy, LogOut, ShieldCheck, Vote, Layers,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArenaBrand,
  ArenaRailBadge,
  ArenaTopBar,
  ArenaFooter,
} from "@/components/arena/ArenaChrome";

const NAV = [
  { to: "/judges/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/judges/my-panel", label: "My Panel", icon: Layers },
  { to: "/judges/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/judges/nominees", label: "Nominees", icon: Users },
  { to: "/judges/conflicts", label: "Conflicts", icon: AlertTriangle },
  { to: "/judges/scoring", label: "Scoring Guide", icon: FileEdit },
  { to: "/judges/notes", label: "My Notes", icon: StickyNote },
  { to: "/judges/voting", label: "Voting Arena", icon: Vote },
  { to: "/judges/results", label: "Results", icon: Trophy },
  { to: "/judges/audit", label: "My Audit Trail", icon: ShieldCheck },
  { to: "/judges/profile", label: "Profile", icon: UserCircle },
  { to: "/judges/help", label: "Help", icon: LifeBuoy },
];

export function IconJuryLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/judges/sign-in", { replace: true });
  };
  return (
    <div className="min-h-screen bg-arena-bg text-arena-text flex flex-col lg:flex-row">
      <Helmet>
        <title>Africa Education Icon Judges Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 bg-arena-rail flex flex-col">
        <ArenaBrand workspace="Judges Arena" to="/judges/dashboard" />
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-gold/25 to-transparent text-gold border-l-2 border-gold"
                    : "text-white/70 hover:bg-white/5 hover:text-gold"
                }`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
        <ArenaRailBadge />
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <ArenaTopBar
          title="Africa Education Icon Judges Portal"
          subtitle="Independent Jury · Private Deliberation · Audit Enabled"
          statusLabel="Judging Live"
          statusDetail="2026 Cycle"
          statusTone="live"
          identityName={user?.email ?? "Judge"}
          identityRole="Panel Judge"
          notifications={3}
        />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
        <ArenaFooter workspace="Judges Arena" />
      </div>
    </div>
  );
}

export default IconJuryLayout;
