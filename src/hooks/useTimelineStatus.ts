// Live status feed for the /timeline "Where Things Stand Right Now" tracker.
// Counts only — served by the public.timeline_public_status() database function.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TimelineStatus {
  nominationsTotal: number | null;
  nrcQueued: number | null;
  nrcVerified: number | null;
  judgePanels: number | null;
  activeJudges: number | null;
  judgeAssignments: number | null;
  loading: boolean;
}

const EMPTY: TimelineStatus = {
  nominationsTotal: null,
  nrcQueued: null,
  nrcVerified: null,
  judgePanels: null,
  activeJudges: null,
  judgeAssignments: null,
  loading: true,
};

export function useTimelineStatus(): TimelineStatus {
  const [state, setState] = useState<TimelineStatus>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase.rpc("timeline_public_status" as never);
      if (cancelled) return;
      if (error || !data) {
        setState({ ...EMPTY, loading: false });
        return;
      }
      const d = data as Record<string, number>;
      setState({
        nominationsTotal: num(d.nominations_total),
        nrcQueued: num(d.nrc_queued),
        nrcVerified: num(d.nrc_verified),
        judgePanels: num(d.judge_panels),
        activeJudges: num(d.active_judges),
        judgeAssignments: num(d.judge_assignments),
        loading: false,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export function formatCount(v: number | null): string {
  return v === null ? "—" : v.toLocaleString("en-GB");
}
