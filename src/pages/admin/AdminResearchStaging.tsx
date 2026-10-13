import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { dedupeResearchCandidates, researchManifestSchema, type ResearchCandidate } from "@/lib/researchStaging";

const BATCH_ID = "281d09c3-2e7f-4ea1-a542-065be7edb419";
export default function AdminResearchStaging() {
  const { user, loading, hasRole } = useAuth();
  const [manifest, setManifest] = useState<ResearchCandidate[]>([]);
  const [rows, setRows] = useState<ResearchCandidate[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const isAdmin = !!user && hasRole("admin");
  async function readBack() {
    const result: ResearchCandidate[] = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await supabase.from("import_review_queue").select("raw_row").eq("batch_id", BATCH_ID).order("id").range(offset, offset + 499);
      if (error) throw error;
      for (const row of data ?? []) {
        const parsed = researchManifestSchema.element.safeParse(row.raw_row);
        if (parsed.success) result.push(parsed.data);
      }
      if (!data || data.length < 500) break;
    }
    setRows(result);
    return result;
  }
  useEffect(() => { if (isAdmin) readBack().catch((error) => setError(error.message)); }, [isAdmin]);
  if (loading) return <p className="p-8">Checking access…</p>;
  if (!isAdmin) return <Navigate to="/login" replace />;
  async function stage() {
    if (!user) return;
    setBusy(true); setError("");
    try {
      const existing = await readBack();
      const keys = new Set(existing.map((row) => row.dedupe_key));
      const pending = manifest.filter((row) => !keys.has(row.dedupe_key));
      for (let offset = 0; offset < pending.length; offset += 100) {
        const { error } = await supabase.from("import_review_queue").insert(pending.slice(offset, offset + 100).map((row) => ({
          batch_id: BATCH_ID, source_file: row.source_file, row_number: row.source_row,
          raw_row: JSON.parse(JSON.stringify(row)), suggested_name: row.name, suggested_region: row.source_region,
          reason: "Identifiable research candidate: NRC evidence and legacy-taxonomy mapping required; do not publish.",
          status: "pending", created_by: user.id,
        })));
        if (error) throw error;
      }
      await readBack(); setManifest([]);
    } catch (error) { setError(error instanceof Error ? error.message : "Staging failed; reload to check saved records before retrying."); }
    finally { setBusy(false); }
  }
  const filtered = rows.filter((row) => `${row.name} ${row.category_slug} ${row.pathway_slug} ${row.source_region}`.toLowerCase().includes(query.toLowerCase()));
  return <DashboardLayout title="Research review staging"><div className="space-y-6">
    <h1 className="font-serif text-3xl">Attached award research</h1>
    <p className="text-muted-foreground">{rows.length} private candidates · NRC review pending · No publication or verification changes</p>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    <div className="flex flex-wrap items-center gap-4">
      <Input type="file" accept=".json" aria-label="Upload private research manifest" disabled={busy} onChange={async (event) => {
        const file = event.target.files?.[0]; if (!file) return;
        try { const parsed = researchManifestSchema.parse(JSON.parse(await file.text())); setManifest(dedupeResearchCandidates(parsed)); setError(""); }
        catch { setError("Invalid manifest. Every candidate must include source provenance and private, unverified review status."); setManifest([]); }
      }} className="max-w-md" />
      <Button disabled={!manifest.length || busy} onClick={stage}>{busy ? "Staging…" : `Stage ${manifest.length} candidates for NRC review`}</Button>
    </div>
    <Input aria-label="Search research candidates" placeholder="Search name, category, pathway or region" value={query} onChange={(event) => setQuery(event.target.value)} />
    <p className="text-sm text-muted-foreground">{filtered.length} matching candidates</p>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border"><th className="p-3">Candidate</th><th className="p-3">Category / pathway</th><th className="p-3">Research region</th><th className="p-3">Provenance</th></tr></thead><tbody>
      {filtered.slice(0, 100).map((row) => <tr key={row.dedupe_key} className="border-b border-border"><td className="p-3">{row.name}</td><td className="p-3">{row.category_slug}<br />{row.pathway_slug}</td><td className="p-3">{row.source_region}</td><td className="max-w-xs break-words p-3"><details><summary>{row.source_file} · page {row.source_page} · row {row.source_row}</summary><p className="mt-2">{row.raw_text.join(" ")}</p></details></td></tr>)}
    </tbody></table></div>
    {filtered.length > 100 && <p className="text-sm text-muted-foreground">Showing the first 100 matches. Refine your search for a specific candidate.</p>}
  </div></DashboardLayout>;
}