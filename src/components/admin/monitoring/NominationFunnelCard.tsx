/**
 * Admin-only nomination funnel + attribution panel (last 30 days).
 *
 * Reads `nomination_funnel_events` (admin-only SELECT) plus recent
 * `nomination_intake` rows for submissions-by-day and channel breakdown.
 */

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { NominationTrendsCard } from "./NominationTrendsCard";
import { Filter, Megaphone } from "lucide-react";

interface FunnelEventRow {
  step: string;
  session_id: string;
  utm_source: string | null;
  referral_code: string | null;
  created_at: string;
}

interface IntakeRow {
  ingested_at: string;
  utm_source: string | null;
  referral_code: string | null;
}

const WINDOW_DAYS = 30;

export function NominationFunnelCard() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<FunnelEventRow[]>([]);
  const [intake, setIntake] = useState<IntakeRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    const since = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString();

    (async () => {
      const [ev, ik] = await Promise.all([
        supabase
          .from("nomination_funnel_events")
          .select("step, session_id, utm_source, referral_code, created_at")
          .gte("created_at", since)
          .order("created_at", { ascending: true })
          .limit(5000),
        supabase
          .from("nomination_intake")
          .select("ingested_at, utm_source, referral_code")
          .gte("ingested_at", since)
          .order("ingested_at", { ascending: true })
          .limit(5000),
      ]);
      if (cancelled) return;
      setEvents((ev.data as FunnelEventRow[]) ?? []);
      setIntake((ik.data as IntakeRow[]) ?? []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const submissionsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of intake) {
      const day = row.ingested_at.slice(0, 10);
      map.set(day, (map.get(day) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [intake]);

  /** Unique sessions per step, ordered by first appearance of the step id. */
  const funnelSteps = useMemo(() => {
    const order: string[] = [];
    const sessions = new Map<string, Set<string>>();
    for (const e of events) {
      if (!sessions.has(e.step)) {
        sessions.set(e.step, new Set());
        order.push(e.step);
      }
      sessions.get(e.step)!.add(e.session_id);
    }
    order.sort((a, b) => {
      if (a === "wizard_started") return -1;
      if (b === "wizard_started") return 1;
      if (a === "nomination_submitted") return 1;
      if (b === "nomination_submitted") return -1;
      return a.localeCompare(b);
    });
    const rows = order.map((step) => ({ step, count: sessions.get(step)!.size }));
    const top = rows[0]?.count ?? 0;
    return rows.map((r) => ({ ...r, pct: top ? Math.round((r.count / top) * 100) : 0 }));
  }, [events]);

  const channels = useMemo(() => {
    const tally = new Map<string, number>();
    for (const row of intake) {
      const key = row.utm_source
        ? `utm:${row.utm_source}`
        : row.referral_code
          ? `ref:${row.referral_code}`
          : "direct";
      tally.set(key, (tally.get(key) ?? 0) + 1);
    }
    return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [intake]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[260px] w-full" />
        <Skeleton className="h-[220px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NominationTrendsCard data={submissionsByDay} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-primary" />
              Wizard funnel — last {WINDOW_DAYS} days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {funnelSteps.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No funnel events recorded yet.
              </p>
            ) : (
              funnelSteps.map((s) => (
                <div key={s.step} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.step.replace(/_/g, " ")}</span>
                    <span className="text-muted-foreground">
                      {s.count} sessions · {s.pct}%
                    </span>
                  </div>
                  <Progress value={s.pct} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Megaphone className="h-5 w-5 text-primary" />
              Top channels by submission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {channels.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No attributed submissions in this window.
              </p>
            ) : (
              channels.map(([key, count]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{key}</Badge>
                  <span className="font-medium">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
