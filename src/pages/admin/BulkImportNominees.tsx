/**
 * Admin bulk-import tool.
 *
 * Accepts any CSV or XLSX file of nominee/organisation rows, parses it in the
 * browser, and hands the raw rows to the `bulk-import-nominees` edge function
 * which performs category/subcategory matching, duplicate detection and
 * insertion. Rows that cannot be matched are written to `import_review_queue`
 * instead of being dropped.
 */
import { useCallback, useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";

interface ImportSummary {
  rows_received: number;
  inserted: number;
  review_queue: number;
  duplicates: number;
  placeholders: number;
  errors: number;
}

interface ImportResponse {
  ok: boolean;
  dry_run: boolean;
  batch_id: string;
  filename: string;
  summary: ImportSummary;
  review_queue: { row_number: number; name: string; reason?: string }[];
  duplicates: { row_number: number; name: string; reason?: string }[];
  placeholders: { row_number: number; name: string }[];
  low_confidence: { row_number: number; name: string; note?: string }[];
  errors: { message: string }[];
}

type ParsedRow = Record<string, unknown>;

async function parseFile(file: File): Promise<{ headers: string[]; rows: ParsedRow[] }> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("The file contains no worksheets.");
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<ParsedRow>(sheet, { defval: "", raw: false });
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  return { headers, rows };
}

export default function BulkImportNominees() {
  const { user, hasRole, loading } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [dryRun, setDryRun] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);

  const handleFile = useCallback(async (selected: File | null) => {
    setResult(null);
    setFile(selected);
    setHeaders([]);
    setRows([]);
    if (!selected) return;
    try {
      const parsed = await parseFile(selected);
      if (parsed.rows.length === 0) {
        toast.error("No data rows found in that file.");
        return;
      }
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      toast.success(`Parsed ${parsed.rows.length} rows from ${selected.name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read that file");
    }
  }, []);

  const runImport = useCallback(async () => {
    if (!file || rows.length === 0) return;
    setBusy(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke<ImportResponse>(
        "bulk-import-nominees",
        { body: { filename: file.name, rows, dry_run: dryRun } },
      );
      if (error) throw error;
      if (!data?.ok) throw new Error("Import failed");
      setResult(data);
      toast.success(
        dryRun
          ? `Dry run complete — ${data.summary.inserted} rows would be imported`
          : `Imported ${data.summary.inserted} nominees`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }, [file, rows, dryRun]);

  const preview = useMemo(() => rows.slice(0, 5), [rows]);

  if (loading) return null;
  if (!user || !hasRole("admin")) return <Navigate to="/" replace />;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <header className="space-y-1">
          <h1 className="font-serif text-2xl font-bold md:text-3xl">Bulk Import Nominees</h1>
          <p className="text-sm text-muted-foreground">
            Upload a CSV or XLSX register. Rows are matched to categories and subcategories
            server-side, imported as <strong>draft</strong> records, and never publicly visible
            until they pass the NRC review workflow.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="h-5 w-5" /> 1. Choose a file
            </CardTitle>
            <CardDescription>
              Column names are flexible. Recognised fields: nominee/organisation name, award or
              category title, subcategory or classification, region, country,
              achievement/bio/contribution, primary email, additional emails, phone, source image
              path.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={() => inputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Select CSV / XLSX
              </Button>
              {file && (
                <span className="text-sm text-muted-foreground">
                  {file.name} — {rows.length} rows, {headers.length} columns
                </span>
              )}
            </div>

            {preview.length > 0 && (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      {headers.map((h) => (
                        <th key={h} className="whitespace-nowrap px-3 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((r, i) => (
                      <tr key={i} className="border-t">
                        {headers.map((h) => (
                          <td key={h} className="max-w-[220px] truncate px-3 py-2">
                            {String(r[h] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Run the import</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch id="dry-run" checked={dryRun} onCheckedChange={setDryRun} />
              <Label htmlFor="dry-run" className="cursor-pointer text-sm">
                Dry run (validate and preview matches without writing anything)
              </Label>
            </div>
            <Button onClick={runImport} disabled={busy || rows.length === 0}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {dryRun ? "Validate rows" : `Import ${rows.length} rows`}
            </Button>
            {!dryRun && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Live import</AlertTitle>
                <AlertDescription>
                  Matched rows will be written to the nominees table as draft records. Unmatched
                  rows go to the import review queue instead of being discarded.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                3. {result.dry_run ? "Dry run summary" : "Import summary"}
              </CardTitle>
              <CardDescription>Batch {result.batch_id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                {[
                  ["Rows read", result.summary.rows_received],
                  [result.dry_run ? "Would insert" : "Inserted", result.summary.inserted],
                  ["Review queue", result.summary.review_queue],
                  ["Duplicates", result.summary.duplicates],
                  ["Placeholders", result.summary.placeholders],
                  ["Errors", result.summary.errors],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-md border p-3">
                    <div className="text-2xl font-bold">{value as number}</div>
                    <div className="text-xs text-muted-foreground">{label as string}</div>
                  </div>
                ))}
              </div>

              <ResultList
                title="Sent to review queue"
                empty="No unmatched rows."
                items={result.review_queue.map((r) => ({
                  key: `${r.row_number}`,
                  label: `Row ${r.row_number} — ${r.name}`,
                  note: r.reason,
                }))}
              />
              <ResultList
                title="Likely duplicates (not inserted)"
                empty="No duplicates detected."
                items={result.duplicates.map((r) => ({
                  key: `${r.row_number}`,
                  label: `Row ${r.row_number} — ${r.name}`,
                  note: r.reason,
                }))}
              />
              <ResultList
                title="Placeholder names flagged"
                empty="No placeholder names found."
                items={result.placeholders.map((r) => ({
                  key: `${r.row_number}`,
                  label: `Row ${r.row_number} — ${r.name}`,
                  note: "PLACEHOLDER NAME - needs real nominee data",
                }))}
              />
              <ResultList
                title="Low-confidence matches (imported with review notes)"
                empty="All matches were confident."
                items={result.low_confidence.map((r) => ({
                  key: `${r.row_number}`,
                  label: `Row ${r.row_number} — ${r.name}`,
                  note: r.note,
                }))}
              />
              {result.errors.length > 0 && (
                <ResultList
                  title="Errors"
                  empty=""
                  items={result.errors.map((e, i) => ({ key: String(i), label: e.message }))}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function ResultList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: { key: string; label: string; note?: string }[];
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Badge variant="secondary">{items.length}</Badge>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">{empty}</p>
      ) : (
        <ul className="max-h-64 space-y-1 overflow-y-auto rounded-md border p-3 text-xs">
          {items.map((i) => (
            <li key={i.key}>
              <span className="font-medium">{i.label}</span>
              {i.note ? <span className="text-muted-foreground"> — {i.note}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
