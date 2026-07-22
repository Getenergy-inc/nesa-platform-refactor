// /nrc — Public NRC Arena introduction. Signed-in members auto-forward to
// their dashboard.

import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, FileSearch, ShieldCheck, Users, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { NRC_TOTALS } from "@/config/nrc/arenaTeams";

const PILLARS = [
  { icon: FileSearch, title: "Verification", body: "Independent identity, eligibility and evidence review for every nominee." },
  { icon: ClipboardCheck, title: "Research", body: "Structured dossiers built from independent, primary and secondary sources." },
  { icon: ShieldCheck, title: "Governance-grade", body: "Audit-trailed decisions, dual-review quorum and traced handover." },
  { icon: Users, title: "28 NRC teams", body: `${NRC_TOTALS.slots} approved members across ${NRC_TOTALS.teams} operational teams.` },
];

export default function NRCArenaIndex() {
  const { user, roles, loading } = useAuth();

  if (!loading && user && (roles ?? []).some((r) => r === "nrc" || r === "admin")) {
    return <Navigate to="/nrc/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Helmet>
        <title>NRC Arena · NESA-Africa 2026</title>
        <meta
          name="description"
          content="The NESA-Africa Nominee Research Corps (NRC) Arena — verification, evidence and dossier preparation for the 2026 recognition cycle."
        />
      </Helmet>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/80">NESA-Africa · Secure Portal</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
            NRC Arena
          </h1>
          <p className="mt-2 text-lg text-white/70">
            Verification · Research · Evidence · Dossier · Handover
          </p>
          <p className="mt-6 max-w-2xl text-white/70">
            The Nominee Research Corps is the independent verification backbone of the
            NESA-Africa 2026 recognition cycle. NRC members verify identity and eligibility,
            build evidence-backed dossiers, and hand cases to the Judges Arena or Governance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/nrc/sign-in">
                NRC Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/nrc/directory">View NRC Directory</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-white/80 hover:text-gold">
              <Link to="/judgeapply/nrc">About the NRC</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p.icon className="h-6 w-6 text-gold" aria-hidden />
              <h3 className="mt-3 font-display font-semibold text-lg">{p.title}</h3>
              <p className="mt-1 text-sm text-white/65">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-gold">Two separate arenas · one identity</h2>
            <p className="mt-3 text-white/70">
              The NRC Arena and Judges Arena share NESA-Africa authentication and visual
              identity but operate as fully separated systems. NRC handles verification;
              Judges handle independent scoring and final voting.
            </p>
          </div>
          <div className="grid gap-3">
            <Link to="/nrc/sign-in" className="rounded-lg border border-gold/30 bg-charcoal p-4 hover:border-gold">
              <p className="text-gold font-semibold">NRC Arena →</p>
              <p className="text-sm text-white/60">Verification · Evidence · Dossier · Handover</p>
            </Link>
            <Link to="/judges" className="rounded-lg border border-white/15 bg-charcoal p-4 hover:border-gold">
              <p className="text-white font-semibold">Judges Arena →</p>
              <p className="text-sm text-white/60">Independent Review · Scoring · Deliberation · Final Voting</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
