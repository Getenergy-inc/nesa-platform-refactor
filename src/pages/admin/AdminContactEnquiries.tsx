import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT_ENQUIRY_STATUSES, CONTACT_ENQUIRY_TYPES } from "@/config/contactEnquiries";

interface Enquiry {
  id: string;
  reference: string;
  name: string;
  email: string;
  organisation: string | null;
  enquiry_type: string;
  country: string;
  phone: string | null;
  preferred_contact: string;
  subject: string;
  message: string;
  related_reference: string | null;
  status: (typeof CONTACT_ENQUIRY_STATUSES)[number];
  created_at: string;
}

export default function AdminContactEnquiries() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase.from("contact_enquiries").select("id, reference, name, email, organisation, enquiry_type, country, phone, preferred_contact, subject, message, related_reference, status, created_at").order("created_at", { ascending: false }).limit(100);
    if (queryError) setError("Enquiries could not be loaded. Your administrator permissions may be unavailable.");
    else setRows((data as unknown as Enquiry[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (id: string, status: Enquiry["status"]) => {
    const { error: updateError } = await supabase.from("contact_enquiries").update({ status, updated_at: new Date().toISOString() } as never).eq("id", id);
    if (updateError) { setError("The status could not be updated."); return; }
    setRows((current) => current.map((row) => row.id === id ? { ...row, status } : row));
  };

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (typeFilter !== "all" && row.enquiry_type !== typeFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!needle) return true;
      return [row.reference, row.name, row.email, row.organisation, row.subject, row.message, row.related_reference]
        .some((value) => value?.toLowerCase().includes(needle));
    });
  }, [query, rows, statusFilter, typeFilter]);
  const enquiryTypes = useMemo(() => Array.from(new Set([...CONTACT_ENQUIRY_TYPES, ...rows.map((row) => row.enquiry_type)])), [rows]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Helmet><title>Contact Enquiries | Administration</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-display text-3xl text-gold">Contact enquiries</h1><p className="mt-2 text-sm text-white/65">Private administrator view. Do not copy sensitive enquiry content into public pages.</p></div><Button variant="outline" onClick={() => void load()}>Refresh</Button></div>
      <div className="mb-6 grid gap-3 rounded-xl border border-gold/20 p-4 md:grid-cols-3" aria-label="Filter contact enquiries">
        <label className="text-xs">Search enquiries<input className="mt-1 min-h-10 w-full rounded-md border bg-background px-3 text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Reference, sender, subject or message" /></label>
        <label className="text-xs">Enquiry type<select className="mt-1 min-h-10 w-full rounded-md border bg-background px-2 text-sm" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">All types</option>{enquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <label className="text-xs">Status<select className="mt-1 min-h-10 w-full rounded-md border bg-background px-2 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option>{CONTACT_ENQUIRY_STATUSES.map((status) => <option key={status} value={status}>{status.replace(/_/g, " ")}</option>)}</select></label>
      </div>
      {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/40 p-4 text-sm">{error}</p>}
      {loading ? <p role="status">Loading enquiries…</p> : rows.length === 0 ? <Card><CardContent className="p-6">No contact enquiries have been recorded.</CardContent></Card> : visibleRows.length === 0 ? <Card><CardContent className="p-6">No enquiries match these filters.</CardContent></Card> : <div className="space-y-4">{visibleRows.map((row) => <Card key={row.id}><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{row.subject}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{row.reference} · {new Date(row.created_at).toLocaleString("en-GB")}</p></div><label className="text-xs">Status<select className="ml-2 min-h-9 rounded-md border bg-background px-2" value={row.status} onChange={(event) => void updateStatus(row.id, event.target.value as Enquiry["status"])}>{CONTACT_ENQUIRY_STATUSES.map((status) => <option key={status} value={status}>{status.replace(/_/g, " ")}</option>)}</select></label></div></CardHeader><CardContent className="space-y-3 text-sm"><p><strong>{row.enquiry_type}</strong> · {row.name} · {row.country}</p><p><a className="text-gold underline" href={`mailto:${row.email}`}>{row.email}</a>{row.phone ? ` · ${row.phone}` : ""} · prefers {row.preferred_contact.toLowerCase()}</p>{row.organisation && <p>Organisation: {row.organisation}</p>}{row.related_reference && <p>Related reference: {row.related_reference}</p>}<p className="whitespace-pre-wrap border-t pt-3 leading-relaxed">{row.message}</p></CardContent></Card>)}</div>}
    </div>
  );
}
