import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Users, ArrowRight, ShieldAlert } from "lucide-react";
import { useIconTaxonomy, useIconPanels, useMyPanelIds, useGrandJuryGroups } from "@/hooks/useIconArena";
import { getResultVisibility } from "@/lib/judges/resultVisibility";
import { Badge } from "@/components/ui/badge";

/**
 * /judges/pathways — the 9 judging pathways (3 categories x 3 regional groups).
 * Every judge can see the structure; only their own panels are enterable.
 */
export default function IconPathwayIndex() {
  const taxonomy = useIconTaxonomy();
  const panels = useIconPanels();
  const mine = useMyPanelIds();
  const groups = useGrandJuryGroups();

  const loading = taxonomy.isLoading || panels.isLoading;
  const myPanelIds = new Set((mine.data ?? []).map((m: any) => m.panel_id));
  const groupByPanel = new Map((groups.data ?? []).map((g: any) => [g.panel_id, g]));

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Judging Pathways — Judges Arena</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header>
        <p className="text-xs uppercase tracking-widest text-gold">Judges Arena</p>
        <h1 className="mt-2 font-serif text-3xl text-white">Judging pathways</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/60">
          Nine pathways run in parallel: three recognition categories judged across three regional
          groupings. Each pathway seats its own independent panel and produces its own shortlist of
          three finalists plus one reserve.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-gold" aria-label="Loading pathways" />
        </div>
      ) : (
        <div className="space-y-10">
          {(taxonomy.data?.pathways ?? []).map((pathway) => (
            <section key={pathway.id}>
              <h2 className="font-serif text-xl text-white">{pathway.name}</h2>
              {pathway.description && (
                <p className="mt-1 text-sm text-white/50 max-w-3xl">{pathway.description}</p>
              )}

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {(taxonomy.data?.classifications ?? []).map((cls) => {
                  const panel = (panels.data ?? []).find(
                    (p) => p.pathway_id === pathway.id && p.classification_id === cls.id,
                  );
                  const isMine = panel ? myPanelIds.has(panel.id) : false;
                  const vis = getResultVisibility(panel ? (groupByPanel.get(panel.id) as any) : null);

                  return (
                    <div
                      key={cls.id}
                      className={`rounded-xl border p-4 transition ${
                        isMine
                          ? "border-gold/40 bg-gold/5"
                          : "border-white/10 bg-arena-rail"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white">{cls.name}</h3>
                        <Badge variant="outline" className="border-white/20 text-[10px] text-white/60">
                          {vis.badgeLabel}
                        </Badge>
                      </div>
                      {cls.description && (
                        <p className="mt-2 text-xs text-white/50 leading-relaxed">{cls.description}</p>
                      )}

                      <div className="mt-4">
                        {!panel ? (
                          <p className="text-xs text-white/40">Panel not yet convened.</p>
                        ) : isMine ? (
                          <Link
                            to={`/judges/pathways/${pathway.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline"
                          >
                            Enter your panel workspace
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                          </Link>
                        ) : (
                          <p className="inline-flex items-center gap-1.5 text-xs text-white/40">
                            <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                            You are not seated on this panel
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 flex items-start gap-3">
        <Users className="h-4 w-4 text-gold mt-0.5 shrink-0" aria-hidden />
        <p className="text-xs text-white/60">
          Panels are firewalled from one another. Deliberations, notes and scores are visible only
          to the judges seated on that pathway.
        </p>
      </div>
    </div>
  );
}
