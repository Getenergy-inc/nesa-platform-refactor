import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NRCArenaLayout } from "@/components/nrc/arena/NRCArenaLayout";
import { getNrcTeam, NRC_TIER_META } from "@/config/nrc/arenaTeams";

export default function NRCTeamDetail() {
  const { teamSlug = "" } = useParams();
  const team = getNrcTeam(teamSlug);
  if (!team) return <Navigate to="/nrc/teams" replace />;
  const meta = NRC_TIER_META[team.tier];

  return (
    <NRCArenaLayout>
      <Helmet><title>{team.name} · NRC Team · NESA-Africa</title></Helmet>

      <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-gold mb-4">
        <Link to="/nrc/teams"><ArrowLeft className="mr-1.5 h-4 w-4" /> All teams</Link>
      </Button>

      <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 mb-6">
        <Badge variant="outline" className={`border-white/20 ${meta.accent}`}>{meta.label}</Badge>
        <h1 className="mt-2 font-display text-2xl font-bold">{team.name}</h1>
        <p className="text-white/60 text-sm mt-1">{team.category}{team.pathway ? ` · ${team.pathway}` : ""}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="border-white/20 text-white/70">
            <Users className="h-3 w-3 mr-1" /> {team.memberSlots} member slots
          </Badge>
          <Badge variant="outline" className="border-emerald-400/40 text-emerald-300">Slots open</Badge>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Block title="Team roles">
            <ul className="space-y-2">
              {team.roles.map((role) => (
                <li key={role} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                  <span className="text-sm text-white/85">{role}</span>
                  <Badge variant="outline" className="border-white/20 text-white/50 text-[10px]">Unassigned</Badge>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Team queue">
            <p className="text-sm text-white/60">
              Cases routed to this category or pathway will appear here once nominations open
              and the team has been staffed.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3 border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/nrc/cases">Open team queue</Link>
            </Button>
          </Block>
        </div>

        <aside className="space-y-6">
          <Block title="Members">
            <p className="text-sm text-white/60">No members appointed yet.</p>
          </Block>
          <Block title="Handover destination">
            <p className="text-sm text-white/70">
              {team.tier === "icon"
                ? "Verified dossiers hand over to the Judges Arena for scoring and final voting."
                : "Verified cases hand over to Governance for approval and public profile publication."}
            </p>
          </Block>
        </aside>
      </section>
    </NRCArenaLayout>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="font-display font-semibold text-gold text-sm uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
