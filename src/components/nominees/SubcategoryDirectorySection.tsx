// ============================================================================
// SubcategoryDirectorySection — filterable directory of every subcategory
// across the 4-tier NESA-Africa 2026 architecture. Section 4 of the spec.
// Each card deep-links to the canonical subcategory page and a pre-selected
// nomination route.
// ============================================================================
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Sparkles, Filter } from "lucide-react";
import { RECOGNITION_TIERS_2026 } from "@/config/recognitionArchitecture2026";
import { hasFormForCategory } from "@/config/awards/categoryToFormMap";
import { trackEvent } from "@/lib/analytics";

type FlatSub = {
  tierSlug: string;
  tierLabel: string;
  categorySlug: string;
  categoryName: string;
  subSlug: string;
  subName: string;
  description?: string;
  hasForm: boolean;
};

const TIER_FILTERS = [
  { id: "all", label: "All Tiers" },
  { id: "africa-education-icon", label: "Icon" },
  { id: "gold-blue-garnet", label: "Gold-Blue Garnet" },
  { id: "platinum", label: "Platinum" },
  { id: "influencer-education-impact", label: "Influencer" },
];

export function SubcategoryDirectorySection() {
  const [tier, setTier] = useState<string>("all");
  const [query, setQuery] = useState("");

  const all = useMemo<FlatSub[]>(() => {
    const out: FlatSub[] = [];
    RECOGNITION_TIERS_2026.forEach((t) => {
      t.categories.forEach((c) => {
        const formAvailable = hasFormForCategory(c.slug);
        if (!c.subcategories?.length) {
          out.push({
            tierSlug: t.slug,
            tierLabel: t.shortLabel,
            categorySlug: c.slug,
            categoryName: c.name,
            subSlug: "",
            subName: c.name,
            description: c.tagline,
            hasForm: formAvailable,
          });
          return;
        }
        c.subcategories.forEach((s) => {
          out.push({
            tierSlug: t.slug,
            tierLabel: t.shortLabel,
            categorySlug: c.slug,
            categoryName: c.name,
            subSlug: s.slug,
            subName: s.name,
            description: s.description,
            hasForm: formAvailable,
          });
        });
      });
    });
    return out;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((s) => {
      if (tier !== "all" && s.tierSlug !== tier) return false;
      if (q && !`${s.subName} ${s.categoryName} ${s.tierLabel} ${s.description ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [all, tier, query]);

  return (
    <div>
      <div className="rounded-2xl border border-gold/20 bg-charcoal-light/40 p-4 md:p-5 mb-6">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory/40" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              trackEvent("directory_subcategory_search", { q: e.target.value });
            }}
            placeholder="Search subcategories, categories, tiers…"
            aria-label="Search subcategories"
            className="pl-10 bg-charcoal/60 border-gold/20 text-ivory placeholder:text-ivory/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] text-ivory/55 mr-1 self-center">
            <Filter className="h-3 w-3 inline mr-1" /> Filter by tier:
          </span>
          {TIER_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setTier(f.id);
                trackEvent("directory_subcategory_filter", { tier: f.id });
              }}
              className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                tier === f.id
                  ? "bg-gold text-charcoal border-gold font-semibold"
                  : "border-gold/25 bg-charcoal/40 text-ivory/70 hover:border-gold/55"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-ivory/55 mt-3">
          {filtered.length} of {all.length} subcategories
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.slice(0, 60).map((s) => {
          const categoryHref = `/awards/${s.tierSlug}/category/${s.categorySlug}`;
          const subHref = s.subSlug ? `${categoryHref}/${s.subSlug}` : categoryHref;
          const nominateHref = s.subSlug
            ? `/nominate/${s.categorySlug}?subcategory=${s.subSlug}`
            : `/nominate/${s.categorySlug}`;
          return (
            <div
              key={`${s.tierSlug}-${s.categorySlug}-${s.subSlug || "root"}`}
              className="rounded-xl border border-gold/20 bg-charcoal-light/30 p-4 hover:border-gold/55 transition-all flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline" className="border-gold/30 text-gold text-[10px]">
                  {s.tierLabel}
                </Badge>
                {!s.hasForm && (
                  <Badge className="bg-ivory/10 text-ivory/70 border border-ivory/20 text-[10px]">
                    Opening Soon
                  </Badge>
                )}
              </div>
              <h3 className="font-playfair text-base text-ivory leading-snug mb-1">{s.subName}</h3>
              <p className="text-[11px] text-gold/70 mb-2 uppercase tracking-wide">
                {s.categoryName}
              </p>
              {s.description && (
                <p className="text-xs text-ivory/65 leading-relaxed line-clamp-3 mb-4">
                  {s.description}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <Link
                  to={subHref}
                  onClick={() =>
                    trackEvent("directory_subcategory_view", {
                      tier: s.tierSlug,
                      category: s.categorySlug,
                      subcategory: s.subSlug,
                    })
                  }
                  className="text-xs text-gold hover:underline flex items-center gap-1"
                >
                  View <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  to={nominateHref}
                  onClick={() =>
                    trackEvent("directory_subcategory_nominate", {
                      tier: s.tierSlug,
                      category: s.categorySlug,
                      subcategory: s.subSlug,
                    })
                  }
                  className="text-xs px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Nominate
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > 60 && (
        <p className="text-center text-xs text-ivory/55 mt-6">
          Showing 60 of {filtered.length} subcategories — refine the filter or search to narrow.
        </p>
      )}
    </div>
  );
}

export default SubcategoryDirectorySection;
