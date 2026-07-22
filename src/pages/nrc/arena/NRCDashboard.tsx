// /nrc/dashboard — Individual NRC operational dashboard.

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Inbox,
  Clock3,
  FileSearch,
  ClipboardCheck,
  ArrowRightLeft,
  AlertTriangle,
  ShieldCheck,
  MessageSquareText,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { NRCArenaLayout } from "@/components/nrc/arena/NRCArenaLayout";

interface StatCard {
  label: string;
  value: number | string;
  icon: typeof Inbox;
  tone?: "default" | "warn" | "ok";
  href?: string;
}

const PRIMARY: StatCard[] = [
  { label: "New Cases", value: 0, icon: Inbox, href: "/nrc/cases?status=new" },
  { label: "Cases Not Started", value: 0, icon: Clock3, href: "/nrc/cases?status=pending" },
  { label: "Cases In Progress", value: 0, icon: FileSearch, href: "/nrc/cases?status=in_progress" },
  { label: "Evidence Requests Pending", value: 0, icon: MessageSquareText, href: "/nrc/evidence" },
  { label: "Secondary Reviews Required", value: 0, icon: Users, href: "/nrc/cases?role=secondary" },
  { label: "Quality Checks Required", value: 0, icon: ShieldCheck, href: "/nrc/cases?stage=quality" },
  { label: "Ready for Handover", value: 0, icon: ArrowRightLeft, tone: "ok", href: "/nrc/handover/judges" },
  { label: "Overdue Cases", value: 0, icon: AlertTriangle, tone: "warn", href: "/nrc/cases?status=overdue" },
];

const SECONDARY: StatCard[] = [
  { label: "Possible Duplicates", value: 0, icon: ShieldCheck, href: "/nrc/duplicates" },
  { label: "Nominee Acceptance Pending", value: 0, icon: ClipboardCheck },
  { label: "Conflict Declarations", value: 0, icon: AlertTriangle },
  { label: "Public Endorsements Pending", value: 0, icon: MessageSquareText, href: "/nrc/endorsements" },
  { label: "Cases Returned by Governance", value: 0, icon: ArrowRightLeft },
  { label: "Clarifications from Judges", value: 0, icon: MessageSquareText },
  { label: "Completed Cases", value: 0, icon: ClipboardCheck, tone: "ok" },
];

function Card({ card }: { card: StatCard }) {
  const toneCls =
    card.tone === "warn"
      ? "border-amber-400/40"
      : card.tone === "ok"
        ? "border-emerald-400/30"
        : "border-white/10";
  const inner = (
    <div className={`rounded-xl border ${toneCls} bg-white/[0.04] p-4 hover:bg-white/[0.07] transition-colors h-full`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-wider text-white/55">{card.label}</p>
        <card.icon className="h-4 w-4 text-gold/80" aria-hidden />
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-white">{card.value}</p>
    </div>
  );
  return card.href ? <Link to={card.href}>{inner}</Link> : inner;
}

export default function NRCDashboard() {
  const { user } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "NRC Member";

  return (
    <NRCArenaLayout>
      <Helmet>
        <title>NRC Dashboard · NESA-Africa 2026</title>
      </Helmet>

      {/* Identity block */}
      <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-white/[0.06] to-transparent p-6 mb-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-gold/15 flex items-center justify-center border border-gold/40">
            <span className="font-display text-xl font-bold text-gold">
              {displayName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wider text-gold/80">NESA-Africa 2026 · NRC Member</p>
            <h1 className="font-display text-2xl font-bold mt-0.5">Welcome, {displayName}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <Badge variant="outline" className="border-white/20 text-white/80">Reference pending</Badge>
              <Badge variant="outline" className="border-emerald-400/40 text-emerald-300">MFA required</Badge>
              <Badge variant="outline" className="border-gold/40 text-gold">Appointment: Active</Badge>
            </div>
          </div>
          <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <Link to="/nrc/profile">View Profile</Link>
          </Button>
        </div>
      </section>

      {/* Next required action */}
      <section className="mb-6 rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-wider text-gold/80">Next required action</p>
        <p className="mt-1 text-white/85">
          Complete NRC onboarding to unlock case assignments.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to="/nrc/onboarding">Continue Onboarding</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="text-white/70 hover:text-gold">
            <Link to="/nrc/directory">View Directory</Link>
          </Button>
        </div>
      </section>

      {/* Primary cards */}
      <section aria-labelledby="primary-metrics" className="mb-8">
        <h2 id="primary-metrics" className="font-display text-lg font-bold mb-3">Primary queue</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PRIMARY.map((c) => <Card key={c.label} card={c} />)}
        </div>
      </section>

      {/* Secondary cards */}
      <section aria-labelledby="secondary-metrics">
        <h2 id="secondary-metrics" className="font-display text-lg font-bold mb-3">Watchlist</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {SECONDARY.map((c) => <Card key={c.label} card={c} />)}
        </div>
      </section>
    </NRCArenaLayout>
  );
}
