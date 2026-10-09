import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck, Download, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface IconAuditRow {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

/**
 * Curated action + entity taxonomy for the Icon jury audit trail.
 * Keep in sync with server-side logger.
 */
const ACTION_OPTIONS = [
  { value: "__all__", label: "All actions" },
  { value: "sign_in", label: "Sign-in" },
  { value: "sign_out", label: "Sign-out" },
  { value: "otp_verified", label: "OTP verified" },
  { value: "assignment_viewed", label: "Assignment access" },
  { value: "score_created", label: "Score created" },
  { value: "score_updated", label: "Score edited" },
  { value: "score_submitted", label: "Score submitted" },
  { value: "conflict_declared", label: "Conflict declared" },
  { value: "conflict_resolved", label: "Conflict resolved" },
  { value: "note_created", label: "Note created" },
  { value: "note_updated", label: "Note edited" },
  { value: "note_deleted", label: "Note deleted" },
  { value: "moderation_action", label: "Moderation action" },
  { value: "results_computed", label: "Results computed" },
  { value: "results_locked", label: "Results locked" },
  { value: "results_unlocked", label: "Results unlocked" },
];

const ENTITY_OPTIONS = [
  { value: "__all__", label: "All entities" },
  { value: "session", label: "Session" },
  { value: "assignment", label: "Assignment" },
  { value: "review", label: "Review" },
  { value: "score", label: "Score" },
  { value: "conflict", label: "Conflict" },
  { value: "note", label: "Note" },
  { value: "moderation", label: "Moderation" },
  { value: "result_snapshot", label: "Result snapshot" },
];

const ACTION_TONE: Record<string, string> = {
  sign_in: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  sign_out: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  otp_verified: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  assignment_viewed: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  score_created: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  score_updated: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  score_submitted: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  conflict_declared: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  conflict_resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  note_created: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  note_updated: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  note_deleted: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  moderation_action: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  results_computed: "bg-gold/20 text-gold border-gold/40",
  results_locked: "bg-gold/25 text-gold border-gold/50",
  results_unlocked: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

interface Props {
  /** Admin mode shows the actor column and no scoping; judge mode is scoped by RLS. */
  scope: "self" | "all";
  /** Optional page-size override. */
  pageSize?: number;
}

export function IconJuryAuditTrail({ scope, pageSize = 50 }: Props) {
  const [rows, setRows] = useState<IconAuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [action, setAction] = useState<string>("__all__");
  const [entity, setEntity] = useState<string>("__all__");
  const [actorSearch, setActorSearch] = useState("");
  const [selected, setSelected] = useState<IconAuditRow | null>(null);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("icon_jury_audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * pageSize, page * pageSize + pageSize - 1);

    if (action !== "__all__") q = q.eq("action", action);
    if (entity !== "__all__") q = q.eq("entity_type", entity);
    if (scope === "all" && actorSearch.trim()) {
      q = q.eq("actor_user_id", actorSearch.trim());
    }

    const { data, count, error } = await q;
    if (!error) {
      setRows((data ?? []) as IconAuditRow[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, action, entity, actorSearch, scope]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const exportCsv = () => {
    const header = ["created_at", "action", "entity_type", "entity_id", "actor_user_id", "ip_address", "metadata"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [header.join(",")].concat(
      rows.map((r) => [
        r.created_at, r.action, r.entity_type, r.entity_id ?? "",
        r.actor_user_id ?? "", r.ip_address ?? "",
        r.metadata ? JSON.stringify(r.metadata) : "",
      ].map(escape).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `icon-jury-audit-${scope}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const helperText = useMemo(
    () =>
      scope === "self"
        ? "Every action you take in the jury portal is logged. This is your personal audit trail — sign-ins, assignment access, score edits, conflict declarations, and note changes."
        : "Governance view of all jury activity: sign-ins, assignment access, score edits, conflict declarations, note changes, moderation actions, and result locking.",
    [scope]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gold/15 p-2 border border-gold/30">
            <ShieldCheck className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Audit Trail</h2>
            <p className="text-xs text-white/60 max-w-xl leading-relaxed">{helperText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => load()} className="border-white/15 text-white/80">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv} className="border-gold/40 text-gold hover:bg-gold/10">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-3">
        <Filter className="h-4 w-4 text-white/50" />
        <Select value={action} onValueChange={(v) => { setPage(0); setAction(v); }}>
          <SelectTrigger className="w-[190px] bg-black/40 border-white/15 text-white text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={entity} onValueChange={(v) => { setPage(0); setEntity(v); }}>
          <SelectTrigger className="w-[170px] bg-black/40 border-white/15 text-white text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ENTITY_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {scope === "all" && (
          <Input
            value={actorSearch}
            onChange={(e) => { setPage(0); setActorSearch(e.target.value); }}
            placeholder="Filter by actor user id (UUID)"
            className="w-[280px] bg-black/40 border-white/15 text-white text-sm placeholder:text-white/40"
          />
        )}
        <span className="ml-auto text-xs text-white/50">
          {loading ? "Loading…" : `${total.toLocaleString()} event${total === 1 ? "" : "s"}`}
        </span>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/50 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">When</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Entity</th>
                <th className="px-4 py-2 text-left">Entity ID</th>
                {scope === "all" && <th className="px-4 py-2 text-left">Actor</th>}
                <th className="px-4 py-2 text-left">IP</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={scope === "all" ? 7 : 6} className="px-4 py-10 text-center text-white/50">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={scope === "all" ? 7 : 6} className="px-4 py-10 text-center text-white/50">
                  No audit events match these filters.
                </td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 text-white/70 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${ACTION_TONE[r.action] ?? "bg-white/5 text-white/70 border-white/15"}`}>
                      {r.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-white/70">{r.entity_type}</td>
                  <td className="px-4 py-2.5 text-white/50 font-mono text-xs">
                    {r.entity_id ? r.entity_id.slice(0, 8) : "—"}
                  </td>
                  {scope === "all" && (
                    <td className="px-4 py-2.5 text-white/60 font-mono text-xs">
                      {r.actor_user_id ? r.actor_user_id.slice(0, 8) : "system"}
                    </td>
                  )}
                  <td className="px-4 py-2.5 text-white/50 text-xs">{r.ip_address ?? "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-gold hover:bg-gold/10" onClick={() => setSelected(r)}>
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-charcoal border-gold/20 text-white">
                        <DialogHeader><DialogTitle className="text-gold">Audit event</DialogTitle></DialogHeader>
                        {selected && (
                          <ScrollArea className="max-h-[60vh] pr-2">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <Detail k="Action" v={selected.action} />
                              <Detail k="Entity" v={selected.entity_type} />
                              <Detail k="Entity ID" v={selected.entity_id ?? "—"} mono />
                              <Detail k="Actor" v={selected.actor_user_id ?? "system"} mono />
                              <Detail k="When" v={new Date(selected.created_at).toLocaleString()} />
                              <Detail k="IP" v={selected.ip_address ?? "—"} mono />
                              <div className="col-span-2">
                                <p className="text-xs uppercase tracking-wide text-white/50 mb-1">User agent</p>
                                <p className="text-xs text-white/70 break-all">{selected.user_agent ?? "—"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs uppercase tracking-wide text-white/50 mb-1">Metadata</p>
                                <pre className="text-xs bg-black/50 border border-white/10 rounded p-3 overflow-auto text-white/80">
                                  {selected.metadata ? JSON.stringify(selected.metadata, null, 2) : "—"}
                                </pre>
                              </div>
                            </div>
                          </ScrollArea>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-white/60">
        <span>Page {page + 1} of {pageCount}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-white/15 text-white/80"
            disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button>
          <Button size="sm" variant="outline" className="border-white/15 text-white/80"
            disabled={page + 1 >= pageCount} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}

function Detail({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-white/50 mb-1">{k}</p>
      <p className={`text-white/85 ${mono ? "font-mono text-xs break-all" : ""}`}>{v}</p>
    </div>
  );
}

export default IconJuryAuditTrail;
