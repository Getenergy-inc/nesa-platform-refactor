import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ICON_CALENDAR,
  ICON_PHASE_TIMELINE,
  getCurrentIconPhase,
  type IconPhase,
} from "@/config/iconAward/calendar";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  Crown,
  Feather,
  ArrowRight,
  Lock,
  CheckCircle2,
  Clock,
  FileText,
  Vote,
  ClipboardList,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface PanelMember {
  id: string;
  role: string;
  judge: { id: string; display_name: string | null } | null;
}

interface PanelData {
  id: string;
  title: string;
  status: string;
  chair_judge_id: string | null;
  secretary_judge_id: string | null;
  pathway: { name: string } | null;
  classification: { name: string } | null;
  members: PanelMember[];
  myRole: string;
  group: {
    id: string;
    title: string;
    voting_status: string;
    finalist_count: number;
    my_ballot_id: string | null;
  } | null;
  shortlist: {
    id: string;
    status: string;
    submitted_at: string | null;
    chair_signed_at: string | null;
    secretary_signed_at: string | null;
  } | null;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(d: Date) {
  const diff = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  return diff;
}

const PHASE_ORDER: IconPhase[] = [
  "pre_screening",
  "screening",
  "grand_jury",
  "governance_review",
  "post_gala",
];

function phaseUnlocked(current: IconPhase, required: IconPhase) {
  return PHASE_ORDER.indexOf(current) >= PHASE_ORDER.indexOf(required);
}

export default function MyPanel() {
  const { user } = useAuth();
  const phase = getCurrentIconPhase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelData | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Resolve current icon judge id
        const { data: judgeRow, error: jErr } = await supabase
          .from("icon_judges")
          .select("id, display_name")
          .eq("user_id", user.id)
          .maybeSingle();
        if (jErr) throw jErr;
        if (!judgeRow) {
          setPanel(null);
          return;
        }
        const judgeId = (judgeRow as any).id;

        // 2) Find panel membership
        const { data: membership, error: mErr } = await supabase
          .from("icon_judge_panel_members")
          .select("role, panel_id")
          .eq("judge_id", judgeId)
          .maybeSingle();
        if (mErr) throw mErr;
        if (!membership) {
          setPanel(null);
          return;
        }
        const panelId = (membership as any).panel_id;

        // 3) Panel details
        const { data: panelRow, error: pErr } = await supabase
          .from("icon_judge_panels")
          .select(
            "id, title, status, chair_judge_id, secretary_judge_id, pathway:icon_pathways(name), classification:icon_classifications(name)"
          )
          .eq("id", panelId)
          .maybeSingle();
        if (pErr) throw pErr;

        // 4) Panel members
        const { data: memberRows } = await supabase
          .from("icon_judge_panel_members")
          .select("id, role, judge:icon_judges(id, display_name)")
          .eq("panel_id", panelId);

        // 5) Grand jury group + finalists + my ballot
        const { data: groupRow } = await supabase
          .from("icon_grand_jury_groups")
          .select("id, title, voting_status")
          .eq("panel_id", panelId)
          .maybeSingle();

        let groupData: PanelData["group"] = null;
        if (groupRow) {
          const gid = (groupRow as any).id;
          const [{ count: finalistCount }, { data: ballotRow }] = await Promise.all([
            supabase
              .from("icon_grand_jury_finalists")
              .select("id", { count: "exact", head: true })
              .eq("group_id", gid),
            supabase
              .from("icon_grand_jury_ballots")
              .select("id")
              .eq("group_id", gid)
              .eq("judge_id", judgeId)
              .maybeSingle(),
          ]);
          groupData = {
            id: gid,
            title: (groupRow as any).title,
            voting_status: (groupRow as any).voting_status,
            finalist_count: finalistCount ?? 0,
            my_ballot_id: (ballotRow as any)?.id ?? null,
          };
        }

        // 6) Panel shortlist
        const { data: shortRow } = await supabase
          .from("icon_panel_shortlists")
          .select(
            "id, status, submitted_at, chair_signed_at, secretary_signed_at"
          )
          .eq("panel_id", panelId)
          .maybeSingle();

        setPanel({
          id: (panelRow as any).id,
          title: (panelRow as any).title,
          status: (panelRow as any).status,
          chair_judge_id: (panelRow as any).chair_judge_id,
          secretary_judge_id: (panelRow as any).secretary_judge_id,
          pathway: (panelRow as any).pathway ?? null,
          classification: (panelRow as any).classification ?? null,
          members: (memberRows ?? []) as any,
          myRole: (membership as any).role,
          group: groupData,
          shortlist: (shortRow as any) ?? null,
        });
      } catch (e: any) {
        setError(e?.message ?? "Failed to load your panel");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-gold animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-red-200 text-sm">
          <AlertTriangle className="h-5 w-5 mb-2" /> {error}
        </div>
      </div>
    );
  }

  if (!panel) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Helmet><title>My Panel · Africa Education Icon Judges</title></Helmet>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <Users className="h-10 w-10 text-gold mx-auto mb-3" />
          <h1 className="text-white text-xl font-semibold mb-2">No panel assigned</h1>
          <p className="text-white/60 text-sm">
            You have not yet been placed on a Specialist Panel. Panel assignments are
            confirmed by the Governance Secretariat prior to 14 September 2026.
          </p>
        </div>
      </div>
    );
  }

  const isChair = panel.chair_judge_id && panel.myRole === "chair";
  const isSecretary = panel.secretary_judge_id && panel.myRole === "secretary";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Helmet><title>My Panel · Africa Education Icon Judges</title></Helmet>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#c9a24a]">Specialist Panel</p>
          <h1 className="mt-2 font-serif text-3xl text-white leading-tight">{panel.title}</h1>
          <p className="mt-2 text-sm text-white/60">
            {panel.pathway?.name ?? "Pathway"} · {panel.classification?.name ?? "Classification"}
            {" · "}
            <span className="capitalize">{panel.status.replace(/_/g, " ")}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs text-gold uppercase tracking-widest">
          Your role: {panel.myRole}
        </div>
      </header>

      {/* Current phase banner */}
      <div className="rounded-xl border border-[#c9a24a]/30 bg-[#c9a24a]/[0.06] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#c9a24a]">Current phase</p>
          <p className="text-white font-medium mt-1">{phase.label}</p>
          {phase.nextLabel && phase.nextStart && (
            <p className="text-xs text-white/60 mt-1">
              Next: {phase.nextLabel} · {fmtDate(phase.nextStart)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Calendar className="h-4 w-4 text-gold" />
          Gala: {fmtDate(ICON_CALENDAR.gala)}
        </div>
      </div>

      {/* Actions grid */}
      <section>
        <h2 className="text-white font-medium mb-3 text-sm uppercase tracking-widest">
          Phase-gated actions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            title="Review Evidence"
            description="Read nominee dossiers, evidence bundles, and reviewer notes for your panel's assigned nominees."
            icon={FileText}
            to="/judges/assignments"
            cta="Open assignments"
            unlocked={phaseUnlocked(phase.phase, "screening")}
            phaseLabel="Opens 14 Sept 2026"
          />
          <ActionCard
            title="Score & Shortlist"
            description={
              isChair || isSecretary
                ? "Score nominees and, as panel chair/secretary, sign off the panel's 3 finalists + reserve."
                : "Score nominees against the 8 weighted criteria and add your reviewer recommendation."
            }
            icon={ClipboardList}
            to="/judges/scoring"
            cta={panel.shortlist?.submitted_at ? "View shortlist" : "Enter scores"}
            unlocked={phaseUnlocked(phase.phase, "screening")}
            phaseLabel="Screening 14 – 30 Sept 2026"
            badge={
              panel.shortlist?.submitted_at
                ? "Shortlist submitted"
                : panel.shortlist
                ? "Draft in progress"
                : undefined
            }
          />
          <ActionCard
            title="Grand Jury Ballot"
            description="Cast your ranked-choice vote (3-2-1) for the finalists in your panel's Grand Jury group."
            icon={Vote}
            to={panel.group ? `/judges/voting/${panel.group.id}` : "/judges/voting"}
            cta={panel.group?.my_ballot_id ? "Review receipt" : "Open ballot"}
            unlocked={phaseUnlocked(phase.phase, "grand_jury")}
            phaseLabel="Voting 1 – 7 Oct 2026"
            badge={
              panel.group?.my_ballot_id
                ? "Ballot locked"
                : panel.group
                ? `${panel.group.finalist_count} finalists`
                : "Awaiting shortlist"
            }
          />
        </div>
      </section>

      {/* Panel members */}
      <section>
        <h2 className="text-white font-medium mb-3 text-sm uppercase tracking-widest">
          Panel members ({panel.members.length})
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
          {panel.members.map((m) => {
            const isRoleChair = m.role === "chair";
            const isRoleSec = m.role === "secretary";
            return (
              <div key={m.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  {isRoleChair ? (
                    <Crown className="h-4 w-4 text-gold" />
                  ) : isRoleSec ? (
                    <Feather className="h-4 w-4 text-gold/80" />
                  ) : (
                    <Users className="h-4 w-4 text-white/40" />
                  )}
                  <span className="text-sm text-white">
                    {m.judge?.display_name ?? "Confidential judge"}
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-widest text-white/50">
                  {m.role}
                </span>
              </div>
            );
          })}
          {panel.members.length === 0 && (
            <div className="px-5 py-6 text-sm text-white/50">
              Panel roster not yet published.
            </div>
          )}
        </div>
      </section>

      {/* Deadlines */}
      <section>
        <h2 className="text-white font-medium mb-3 text-sm uppercase tracking-widest">
          Upcoming deadlines
        </h2>
        <ol className="space-y-2">
          {ICON_PHASE_TIMELINE.map((t) => {
            const past = t.date.getTime() < Date.now();
            const dLeft = daysUntil(t.date);
            return (
              <li
                key={t.key}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                  past
                    ? "border-white/5 bg-white/[0.02] text-white/40"
                    : "border-gold/20 bg-gold/[0.04] text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {past ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400/70" />
                  ) : (
                    <Clock className="h-4 w-4 text-gold" />
                  )}
                  <span className="text-sm">{t.label}</span>
                </div>
                <div className="text-xs">
                  {fmtDate(t.date)}
                  {!past && dLeft >= 0 && (
                    <span className="ml-2 text-gold/80">· in {dLeft}d</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Shortlist status */}
      {panel.shortlist && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-white font-medium mb-3 text-sm uppercase tracking-widest">
            Panel shortlist
          </h2>
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <ShortlistStat
              label="Status"
              value={panel.shortlist.status.replace(/_/g, " ")}
            />
            <ShortlistStat
              label="Chair signature"
              value={panel.shortlist.chair_signed_at ? "Signed" : "Pending"}
              ok={!!panel.shortlist.chair_signed_at}
            />
            <ShortlistStat
              label="Secretary signature"
              value={panel.shortlist.secretary_signed_at ? "Signed" : "Pending"}
              ok={!!panel.shortlist.secretary_signed_at}
            />
          </div>
        </section>
      )}
    </div>
  );
}

function ActionCard({
  title,
  description,
  icon: Icon,
  to,
  cta,
  unlocked,
  phaseLabel,
  badge,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  cta: string;
  unlocked: boolean;
  phaseLabel: string;
  badge?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col ${
        unlocked
          ? "border-white/10 bg-[#08122b]/70 hover:border-[#c9a24a]/40 transition"
          : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between">
        <Icon className={`h-5 w-5 ${unlocked ? "text-gold" : "text-white/30"}`} />
        {unlocked ? (
          badge && (
            <span className="text-[10px] uppercase tracking-widest text-emerald-300/90">
              {badge}
            </span>
          )
        ) : (
          <Lock className="h-4 w-4 text-white/30" />
        )}
      </div>
      <h3 className={`mt-3 font-medium ${unlocked ? "text-white" : "text-white/50"}`}>
        {title}
      </h3>
      <p className={`mt-1 text-xs ${unlocked ? "text-white/60" : "text-white/40"}`}>
        {description}
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-widest text-white/40">
        {phaseLabel}
      </p>
      <div className="mt-4">
        {unlocked ? (
          <Button
            asChild
            size="sm"
            className="w-full bg-[#c9a24a] text-[#050b1a] hover:bg-[#e0b96b]"
          >
            <Link to={to}>
              {cta} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button
            size="sm"
            disabled
            className="w-full bg-white/5 text-white/40 cursor-not-allowed"
          >
            Locked until phase opens
          </Button>
        )}
      </div>
    </div>
  );
}

function ShortlistStat({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-widest text-white/40">{label}</p>
      <p
        className={`mt-1 capitalize ${
          ok === undefined ? "text-white" : ok ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
