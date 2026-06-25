import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Building2, Globe2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PARTNERSHIP_PROSPECT_GROUPS,
  PARTNERSHIP_PROSPECT_TOTAL,
  PARTNERSHIP_PROSPECT_UNIQUE_COUNT,
  slugifyProspect,
} from "@/data/partnershipProspects";


/**
 * Public directory of NESA-Africa 2026 prospective partners & endorsers.
 * Source list preserved exactly as supplied (519 entries across 23 groups).
 */
export function PartnershipProspectsSection() {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const visibleGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PARTNERSHIP_PROSPECT_GROUPS.filter(
      (g) => groupFilter === "all" || g.id === groupFilter,
    )
      .map((g) => ({
        ...g,
        organizations: q
          ? g.organizations.filter((o) => o.toLowerCase().includes(q))
          : g.organizations,
      }))
      .filter((g) => g.organizations.length > 0);
  }, [query, groupFilter]);

  const visibleCount = visibleGroups.reduce(
    (sum, g) => sum + g.organizations.length,
    0,
  );

  return (
    <section className="py-16 bg-card/30" id="prospective-partners">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-4">
              <Globe2 className="h-4 w-4 text-gold" />
              <span className="text-xs font-medium text-gold uppercase tracking-wider">
                Partnership Outreach Directory
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Prospective Partners &amp; Endorsers
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              A consolidated directory of {PARTNERSHIP_PROSPECT_TOTAL.toLocaleString()}+
              organizations across {PARTNERSHIP_PROSPECT_GROUPS.length} sub-categories
              that NESA-Africa is engaging for partnership, endorsement, sponsorship and
              advisory roles toward the 2026 Awards Cycle.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-md">
              <Info className="h-3.5 w-3.5" />
              <span>
                Inclusion in this directory indicates outreach intent and does not imply
                confirmed sponsorship or endorsement.
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard label="Total Entries" value={PARTNERSHIP_PROSPECT_TOTAL} />
            <StatCard label="Unique Organizations" value={PARTNERSHIP_PROSPECT_UNIQUE_COUNT} />
            <StatCard label="Sub-Categories" value={PARTNERSHIP_PROSPECT_GROUPS.length} />
            <StatCard label="Showing" value={visibleCount} highlight />
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search organizations (e.g. UNESCO, Mastercard, MTN)…"
                className="pl-9"
              />
            </div>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="md:w-[320px]">
                <SelectValue placeholder="Filter by sub-category" />
              </SelectTrigger>
              <SelectContent className="max-h-[60vh]">
                <SelectItem value="all">All sub-categories</SelectItem>
                {PARTNERSHIP_PROSPECT_GROUPS.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.code}. {g.title} ({g.organizations.length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          {visibleGroups.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No organizations match your search.
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={query ? visibleGroups.map((g) => g.id) : []}
              className="space-y-2"
            >
              {visibleGroups.map((g) => (
                <AccordionItem
                  key={g.id}
                  value={g.id}
                  className="border border-border rounded-lg bg-background/50 px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge variant="outline" className="border-gold/40 text-gold">
                        {g.code}
                      </Badge>
                      <span className="font-display font-semibold">{g.title}</span>
                      <Badge variant="secondary" className="ml-auto md:ml-2">
                        {g.organizations.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 pb-3 pt-1 list-decimal list-inside text-sm text-foreground/90">
                      {g.organizations.map((org, i) => (
                        <li key={`${g.id}-${i}`} className="leading-relaxed">
                          <Link
                            to={`/partners/prospects/${slugifyProspect(org)}`}
                            className="hover:text-gold hover:underline underline-offset-2 transition-colors"
                          >
                            <Highlight text={org} query={query} />
                          </Link>
                        </li>
                      ))}

                    </ol>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${
        highlight
          ? "border-gold/40 bg-gold/5"
          : "border-border bg-background/50"
      }`}
    >
      <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs mb-1">
        <Building2 className="h-3 w-3" />
        {label}
      </div>
      <div
        className={`font-display text-2xl font-bold ${
          highlight ? "text-gold" : "text-foreground"
        }`}
      >
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-gold/30 text-foreground rounded px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default PartnershipProspectsSection;
