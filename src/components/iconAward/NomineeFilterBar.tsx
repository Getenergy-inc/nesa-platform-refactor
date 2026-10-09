import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  ICON_CLASSIFICATIONS,
  IconClassificationSlug,
  IconNominee,
} from "@/data/iconAward";

export interface NomineeFilterState {
  q: string;
  country: string;
  region: string;
  verification: string;
  jury: string;
  classification: string;
}

export function useNomineeFilters(all: IconNominee[], opts?: { showClassification?: boolean }) {
  const [params, setParams] = useSearchParams();
  const state: NomineeFilterState = {
    q: params.get("q") || "",
    country: params.get("country") || "all",
    region: params.get("region") || "all",
    verification: params.get("verification") || "all",
    jury: params.get("jury") || "all",
    classification: params.get("classification") || "all",
  };

  const countries = useMemo(
    () => Array.from(new Set(all.map((n) => n.country))).sort(),
    [all]
  );
  const regions = useMemo(
    () => Array.from(new Set(all.map((n) => n.region))).sort(),
    [all]
  );

  const filtered = useMemo(() => {
    const q = state.q.trim().toLowerCase();
    return all.filter((n) => {
      if (state.country !== "all" && n.country !== state.country) return false;
      if (state.region !== "all" && n.region !== state.region) return false;
      if (state.verification !== "all" && n.verification_status !== state.verification) return false;
      if (state.jury !== "all" && n.jury_status !== state.jury) return false;
      if (
        opts?.showClassification &&
        state.classification !== "all" &&
        n.classification_slug !== state.classification
      )
        return false;
      if (q) {
        const hay = `${n.name} ${n.impact_summary} ${n.country} ${n.region} ${(n.impact_area || []).join(" ")} ${(n.tags || []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [all, state, opts?.showClassification]);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v || v === "all") next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

  const clear = () => setParams(new URLSearchParams(), { replace: true });
  const activeCount = Object.entries(state).filter(
    ([, v]) => v && v !== "all"
  ).length;

  return { state, filtered, countries, regions, setParam, clear, activeCount };
}

export function NomineeFilterBar({
  state,
  countries,
  regions,
  setParam,
  clear,
  activeCount,
  showClassification,
  total,
  filteredCount,
  sticky = true,
}: {
  state: NomineeFilterState;
  countries: string[];
  regions: string[];
  setParam: (k: string, v: string) => void;
  clear: () => void;
  activeCount: number;
  showClassification?: boolean;
  total: number;
  filteredCount: number;
  sticky?: boolean;
}) {
  return (
    <section
      className={`border-y border-gold/15 bg-charcoal-light/50 py-4 backdrop-blur ${
        sticky ? "sticky top-0 z-20" : ""
      }`}
    >
      <div className="container mx-auto px-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div className={showClassification ? "lg:col-span-2" : "lg:col-span-2"}>
            <Input
              placeholder="Search by name, impact, country…"
              value={state.q}
              onChange={(e) => setParam("q", e.target.value)}
              className="bg-charcoal border-gold/20 text-white placeholder:text-white/40"
              aria-label="Search nominees"
            />
          </div>

          {showClassification && (
            <Select
              value={state.classification}
              onValueChange={(v) => setParam("classification", v)}
            >
              <SelectTrigger className="bg-charcoal border-gold/20 text-white">
                <SelectValue placeholder="Classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All classifications</SelectItem>
                {ICON_CLASSIFICATIONS.map((c) => (
                  <SelectItem key={c.slug} value={c.slug as IconClassificationSlug}>
                    {c.short}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={state.country} onValueChange={(v) => setParam("country", v)}>
            <SelectTrigger className="bg-charcoal border-gold/20 text-white">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={state.region} onValueChange={(v) => setParam("region", v)}>
            <SelectTrigger className="bg-charcoal border-gold/20 text-white">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={state.verification}
            onValueChange={(v) => setParam("verification", v)}
          >
            <SelectTrigger className="bg-charcoal border-gold/20 text-white">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any verification</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {!showClassification && (
            <Select value={state.jury} onValueChange={(v) => setParam("jury", v)}>
              <SelectTrigger className="bg-charcoal border-gold/20 text-white">
                <SelectValue placeholder="Jury status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any jury status</SelectItem>
                <SelectItem value="nominated">Nominated</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="jury_reviewed">Jury reviewed</SelectItem>
                <SelectItem value="laureate">Laureate</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-white/60">
          <span>
            Showing <span className="text-gold font-medium">{filteredCount}</span> of {total} nominees
          </span>
          {activeCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clear}
              className="h-7 text-white/70 hover:text-gold hover:bg-gold/10"
            >
              <X className="mr-1 h-3 w-3" /> Clear filters ({activeCount})
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
