// /nrc — Public NRC Arena introduction. Signed-in members auto-forward to
// their dashboard.

import { Navigate } from "react-router-dom";
import { SmartLink as Link } from "@/components/navigation/SmartLink";
import { ArenaExitButton } from "@/components/arena/ArenaExitLink";
import { PublicNRCDirectorySection } from "@/components/nrc/PublicNRCDirectorySection";
import { Helmet } from "react-helmet-async";
import { ArrowRight, FileSearch, ShieldCheck, Users, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { NRC_TOTALS } from "@/config/nrc/arenaTeams";
import { ArenaSeal, ArenaStatStrip } from "@/components/arena/ArenaChrome";
import { useArenaPublicStats, arenaCount } from "@/hooks/useArenaPublicStats";

const PILLARS = [
  { icon: FileSearch, title: "Verification", body: "Independent identity, eligibility and evidence review for every nominee." },
  { icon: ClipboardCheck, title: "Research", body: "Structured dossiers built from independent, primary and secondary sources." },
  { icon: ShieldCheck, title: "Governance-grade", body: "Audit-trailed decisions, dual-review quorum and traced handover." },
  { icon: Users, title: "Team structure", body: `${NRC_TOTALS.teams} operational teams with ${NRC_TOTALS.slots} approved member slots across the 2026 tiers.` },
];

export default function NRCArenaIndex() {
  const { user, roles, loading } = useAuth();
  const { data: publicStats, isLoading: statsLoading } = useArenaPublicStats();

  if (!loading && user && (roles ?? []).some((r) => r === "nrc" || r === "admin")) {
    return <Navigate to="/nrrc/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text">
      <Helmet>
        <title>Nominee Research and Review Corps | NESA-Africa</title>
        <meta
          name="description"
          content="The Nominee Research and Review Corps provides research, verification and preliminary review for NESA-Africa recognition."
        />
      </Helmet>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <ArenaExitButton className="mb-5" />
          <div className="flex items-center gap-4">
            <ArenaSeal className="h-14 w-14" />
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80">
              NESA-Africa · Secure Portal
            </p>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold">
            Nominee Research and Review Corps
          </h1>
          <p className="mt-2 text-lg text-white/70">
            Verification · Research · Evidence · Dossier · Handover
          </p>
          <p className="mt-6 max-w-2xl text-white/70">
            The Nominee Research and Review Corps provides the research, verification and preliminary-review foundation for NESA-Africa recognition. The NRRC does not make the final Africa Education Icon recognition decisions. Eligible Icon dossiers proceed to the nine independent judges.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/nrrc/sign-in">
                NRRC Member Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/nrrc/research-standards">View Research and Review Standards</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/about/how-recognition-works">How Recognition Works</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-white/80 hover:text-gold">
              <Link to="/nrrc/research-standards">Read the Research and Review Standards</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-arena-rail">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <ArenaStatStrip
            stats={[
              {
                icon: Users,
                value: arenaCount(publicStats?.publicNrcMembers, statsLoading),
                label: "NRRC researchers listed",
                detail: "Published only after onboarding & consent",
              },
              {
                icon: FileSearch,
                value: arenaCount(publicStats?.nominees, statsLoading),
                label: "Nominees in the directory",
                detail: "Cases eligible for verification",
              },
              {
                icon: ClipboardCheck,
                value: NRC_TOTALS.teams,
                label: "Operational teams",
                detail: `${NRC_TOTALS.slots} approved member slots`,
              },
              {
                icon: ShieldCheck,
                value: "Dual",
                label: "Review quorum",
                detail: "Every case audit-trailed",
              },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-xl border border-white/10 bg-arena-panel p-5 transition-colors hover:border-gold/40">
              <p.icon className="h-6 w-6 text-gold" aria-hidden />
              <h3 className="mt-3 font-display font-semibold text-lg">{p.title}</h3>
              <p className="mt-1 text-sm text-white/65">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicNRCDirectorySection />

      <section className="border-t border-white/10 bg-arena-rail">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-gold">Two separate arenas · one identity</h2>
            <p className="mt-3 text-white/70">
              The NRRC checks completeness, contacts nominees, obtains consent, conducts interviews, reviews evidence, prepares neutral profiles and organises dossiers. It does not select Icon recipients, promise recognition, alter judge scores, accept payments, treat sponsorship as evidence or publish unapproved information.
            </p>
          </div>
          <div className="grid gap-3">
            <Link to="/nrrc/sign-in" className="rounded-lg border border-gold/30 bg-arena-panel p-4 hover:border-gold">
              <p className="text-gold font-semibold">NRRC Arena →</p>
              <p className="text-sm text-white/60">Verification · Evidence · Dossier · Handover</p>
            </Link>
            <Link to="/judges" className="rounded-lg border border-white/15 bg-arena-panel p-4 hover:border-gold">
              <p className="text-white font-semibold">Judges Arena →</p>
              <p className="text-sm text-white/60">Independent Assessment · Conflict Controls · Moderated Outcome</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
