// /nrc/applications — NRC leadership review of real public applications.
// Approve mints a 14-day invitation and sends the email via the nrc-invite function.

import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Search, AlertTriangle, Mail, Check, X, Inbox } from "lucide-react";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  organization: string | null;
  professional_title: string | null;
  motivation: string;
  expertise_areas: string[];
  linkedin_url: string | null;
  cv_url: string | null;
  weekly_hours: number | null;
  status: string;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

const STATUSES = ["submitted", "under_review", "approved", "rejected"] as const;

function useNRCApplications(status: string) {
  return useQuery({
    queryKey: ["nrc-applications", status],
    queryFn: async (): Promise<Application[]> => {
      const { data, error } = await supabase
        .from("nrc_applications")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Application[];
    },
  });
}

export default function NRCApplications() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>("submitted");
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useNRCApplications(status);

  const filtered = (data ?? []).filter((a) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      a.full_name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.country ?? "").toLowerCase().includes(q) ||
      (a.organization ?? "").toLowerCase().includes(q)
    );
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["nrc-applications"] });
    qc.invalidateQueries({ queryKey: ["nrc-stats"] });
  };

  const approve = async (app: Application) => {
    setBusyId(app.id);
    const { data: result, error: fnError } = await supabase.functions.invoke("nrc-invite", {
      body: { applicationId: app.id, notes: notes[app.id] || undefined },
    });
    setBusyId(null);
    const failure = (fnError as Error | null)?.message || (result as { error?: string })?.error;
    if (failure) {
      toast.error(failure);
      invalidate();
      return;
    }
    toast.success(`Approved — invitation emailed to ${app.email}`);
    invalidate();
  };

  const reject = async (app: Application) => {
    setBusyId(app.id);
    const { error: rpcError } = await supabase.rpc("reject_nrc_application", {
      p_application_id: app.id,
      p_notes: notes[app.id] || null,
    });
    setBusyId(null);
    if (rpcError) return toast.error(rpcError.message);
    toast.success("Application rejected");
    invalidate();
  };

  const markUnderReview = async (app: Application) => {
    setBusyId(app.id);
    const { error: updateError } = await supabase
      .from("nrc_applications")
      .update({ status: "under_review" })
      .eq("id", app.id);
    setBusyId(null);
    if (updateError) return toast.error(updateError.message);
    invalidate();
  };

  return (
    <NRCLayout>
      <Helmet><title>NRC Applications · NESA-Africa 2026</title></Helmet>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">NRC Applications</h2>
            <p className="text-muted-foreground">
              Public applications from <Link to="/nrc/apply" className="underline">/nrc/apply</Link>.
              Approving issues a real 14-day invitation and emails it to the applicant.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/nrc/members">Members</Link>
          </Button>
        </div>

        <Tabs value={status} onValueChange={setStatus}>
          <TabsList>
            {STATUSES.map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">
                {s.replace("_", " ")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, country or organisation…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Could not load applications</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{(error as Error).message}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden />
              <p className="font-medium">No {status.replace("_", " ")} applications</p>
              <p className="text-sm text-muted-foreground">
                Nothing here yet — this list only shows real submitted applications.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <Card key={app.id}>
                <CardContent className="space-y-3 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{app.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {app.email}
                        {app.country ? ` · ${app.country}` : ""}
                        {app.organization ? ` · ${app.organization}` : ""}
                        {app.professional_title ? ` · ${app.professional_title}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">{app.status.replace("_", " ")}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {app.expertise_areas.map((a) => (
                      <Badge key={a} variant="outline" className="text-[11px]">{a}</Badge>
                    ))}
                  </div>

                  <p className="whitespace-pre-wrap text-sm">{app.motivation}</p>

                  <p className="text-xs text-muted-foreground">
                    {app.weekly_hours ? `${app.weekly_hours} hrs/week available. ` : ""}
                    {app.linkedin_url ? (
                      <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>
                    ) : null}
                    {app.cv_url ? (
                      <>
                        {" · "}
                        <a href={app.cv_url} target="_blank" rel="noreferrer" className="underline">CV</a>
                      </>
                    ) : null}
                  </p>

                  {app.review_notes && (
                    <p className="rounded-md bg-muted p-2 text-xs">
                      <strong>Review notes:</strong> {app.review_notes}
                    </p>
                  )}

                  {(app.status === "submitted" || app.status === "under_review") && (
                    <div className="space-y-3 border-t pt-3">
                      <Textarea
                        placeholder="Review notes (optional, stored on the application)"
                        value={notes[app.id] ?? ""}
                        onChange={(e) => setNotes((n) => ({ ...n, [app.id]: e.target.value }))}
                        rows={2}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={busyId === app.id}
                          onClick={() => approve(app)}
                        >
                          {busyId === app.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="mr-2 h-4 w-4" />
                          )}
                          Approve &amp; email invitation
                        </Button>
                        {app.status === "submitted" && (
                          <Button size="sm" variant="outline" disabled={busyId === app.id} onClick={() => markUnderReview(app)}>
                            <Check className="mr-2 h-4 w-4" />
                            Mark under review
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" disabled={busyId === app.id} onClick={() => reject(app)}>
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </NRCLayout>
  );
}
