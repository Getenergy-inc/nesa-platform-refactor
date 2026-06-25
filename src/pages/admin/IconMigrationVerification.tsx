import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ICON_MERGE_STATS,
  ICON_SUBCATEGORIES,
  type IconSubcategorySlug,
} from "@/data/iconAward";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const subTitle = (slug: string) =>
  ICON_SUBCATEGORIES.find((s) => s.slug === (slug as IconSubcategorySlug))?.short ?? slug;

export default function IconMigrationVerification() {
  const s = ICON_MERGE_STATS;

  const kpis = [
    { label: "Legacy roster", value: s.legacyCount, hint: "Pre-merge ICON_NOMINEES" },
    { label: "Refactored candidates", value: s.refactoredCandidates, hint: "Secretariat 2005–2025 shortlist" },
    { label: "Added", value: s.added, hint: "New slugs merged in" },
    { label: "Deduplicated", value: s.deduplicated, hint: "Slug collisions skipped" },
    { label: "Final roster", value: s.finalCount, hint: "ICON_NOMINEES after merge" },
  ];

  return (
    <PublicLayout showFAQ={false} showExploreNomineesCTA={false}>
      <Helmet>
        <title>Icon Nominee Migration Verification | NESA-Africa Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
        <header className="space-y-2">
          <Badge className="bg-gold/15 text-gold border border-gold/30">Migration audit</Badge>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            Africa Education Icon — Migration Verification
          </h1>
          <p className="text-white/70 max-w-3xl">
            Live diff between the legacy 2014–2024 ICON archive and the refactored 2005–2025
            secretariat shortlist. Counts are computed at module load from the same data the app ships.
          </p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {kpis.map((k) => (
            <Card key={k.label} className="bg-charcoal-light border-white/10">
              <CardContent className="p-4">
                <div className="text-3xl font-serif text-gold">
                  <AnimatedCounter value={k.value} />
                </div>
                <div className="text-sm text-white font-medium mt-1">{k.label}</div>
                <div className="text-xs text-white/50">{k.hint}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sources */}
        <Card className="bg-charcoal-light border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-xl">Data sources</CardTitle>
            <CardDescription className="text-white/60">
              Files merged at runtime in <code className="text-gold">src/data/iconAward/index.ts</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md bg-black/30 border border-white/10 p-3">
              <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Legacy (authoritative on collision)</div>
              <div className="text-white/90">{s.sources.legacy}</div>
            </div>
            <div className="rounded-md bg-black/30 border border-white/10 p-3">
              <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Refactored roster</div>
              <div className="text-white/90">{s.sources.refactored}</div>
            </div>
          </CardContent>
        </Card>

        {/* Per-subcategory */}
        <Card className="bg-charcoal-light border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-xl">By subcategory (refactored input)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/60 text-left border-b border-white/10">
                    <th className="py-2 pr-4">Subcategory</th>
                    <th className="py-2 pr-4 text-right">Candidates</th>
                    <th className="py-2 pr-4 text-right">Added</th>
                    <th className="py-2 pr-4 text-right">Deduplicated</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(s.bySubcategoryRefactored).map(([slug, row]) => (
                    <tr key={slug} className="border-b border-white/5 text-white/90">
                      <td className="py-2 pr-4">{subTitle(slug)}</td>
                      <td className="py-2 pr-4 text-right">{row.candidates}</td>
                      <td className="py-2 pr-4 text-right text-emerald-400">{row.added}</td>
                      <td className="py-2 pr-4 text-right text-amber-400">{row.deduped}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Collisions */}
        <Card className="bg-charcoal-light border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Slug collisions ({s.collisions.length})
            </CardTitle>
            <CardDescription className="text-white/60">
              When a refactored slug matches a legacy slug, the legacy entry wins. The refactored
              candidate is dropped from the merged roster.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {s.collisions.length === 0 ? (
              <div className="text-white/60 text-sm">No slug collisions detected.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/60 text-left border-b border-white/10">
                      <th className="py-2 pr-4">Slug</th>
                      <th className="py-2 pr-4">Refactored entry</th>
                      <th className="py-2 pr-4">Legacy entry kept</th>
                      <th className="py-2 pr-4">Refactored subcategory</th>
                      <th className="py-2 pr-4">Legacy subcategory</th>
                      <th className="py-2 pr-4">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.collisions.map((c) => (
                      <tr key={c.slug} className="border-b border-white/5 text-white/90">
                        <td className="py-2 pr-4 font-mono text-xs text-gold">
                          <Link to={`/nominee/${c.slug}`} className="hover:underline">
                            {c.slug}
                          </Link>
                        </td>
                        <td className="py-2 pr-4">{c.name}</td>
                        <td className="py-2 pr-4">{c.legacyName}</td>
                        <td className="py-2 pr-4">{subTitle(c.refactoredSubcategory)}</td>
                        <td className="py-2 pr-4">{subTitle(c.legacySubcategory)}</td>
                        <td className="py-2 pr-4 text-white/60">
                          {c.refactoredSource} → kept {c.legacySource}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-xs text-white/40">
          Computed live from <code>ICON_MERGE_STATS</code>. Refresh after editing the data files to re-run the diff.
        </div>
      </section>
    </PublicLayout>
  );
}
