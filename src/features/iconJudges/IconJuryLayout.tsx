import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard, ClipboardList, Users, AlertTriangle,
  FileEdit, StickyNote, Trophy, UserCircle, LifeBuoy, LogOut, Gavel,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/icon-jury/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/icon-jury/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/icon-jury/nominees", label: "Nominees", icon: Users },
  { to: "/icon-jury/conflicts", label: "Conflicts", icon: AlertTriangle },
  { to: "/icon-jury/scoring", label: "Scoring Guide", icon: FileEdit },
  { to: "/icon-jury/notes", label: "My Notes", icon: StickyNote },
  { to: "/icon-jury/results", label: "Results", icon: Trophy },
  { to: "/icon-jury/profile", label: "Profile", icon: UserCircle },
  { to: "/icon-jury/help", label: "Help", icon: LifeBuoy },
];

export function IconJuryLayout() {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/icon-jury/sign-in", { replace: true });
  };
  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col lg:flex-row">
      <Helmet>
        <title>Africa Education Icon Judges Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gold/15 bg-black/40">
        <div className="px-5 py-5 border-b border-gold/15 flex items-center gap-3">
          <Gavel className="h-6 w-6 text-gold" />
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gold/80">Africa Education Icon</p>
            <h1 className="text-sm font-semibold text-white leading-tight">Judges Portal</h1>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
        <p className="px-5 py-4 text-[10px] text-white/40 leading-relaxed border-t border-gold/10">
          Confidential jury environment. All access is logged.
        </p>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default IconJuryLayout;
