/**
 * FeaturedCategorySpotlight — light-theme, category-slug-parameterised
 * spotlight for up to 3 heuristically-selected nominees.
 *
 * "Featured" is derived from real data only (usable non-duplicate image,
 * profile completion >= 80, real narrative text). There is no editorial
 * is_featured flag on `nominees`, and nothing is fabricated: when no row
 * qualifies, the section renders nothing at all.
 */
import { Link } from "react-router-dom";
import { BadgeCheck, ShieldQuestion, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LightInitialsAvatar } from "./LightInitialsAvatar";
import {
  featuredSummary,
  nomineeImage,
  selectFeaturedNominees,
  SPOTLIGHT_EXCLUDED_CATEGORY_SLUGS,
  useCategoryNominees,
} from "./categoryNomineeData";
import { cn } from "@/lib/utils";

interface Props {
  categorySlug: string;
  className?: string;
}

export function FeaturedCategorySpotlight({ categorySlug, className }: Props) {
  const excluded = SPOTLIGHT_EXCLUDED_CATEGORY_SLUGS.has(categorySlug);
  const { data, isLoading } = useCategoryNominees(excluded ? "" : categorySlug);

  if (excluded) return null;

  if (isLoading) {
    return (
      <section className={cn("bg-background", className)}>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Skeleton className="mb-6 h-8 w-64" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featured = selectFeaturedNominees(data?.nominees ?? []);
  if (!data || featured.length === 0) return null;

  return (
    <section
      id="featured-nominees"
      aria-label="Featured nominees"
      className={cn("bg-background border-t border-border", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Badge
          variant="outline"
          className="mb-3 border-gold/50 bg-gold/10 text-gold text-[10px] uppercase tracking-[0.18em]"
        >
          <Sparkles className="mr-1.5 h-3 w-3" /> Featured Nominees
        </Badge>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">
          Spotlight — {data.category.name}
        </h2>
        <p className="mt-2 max-w-3xl text-sm md:text-base text-muted-foreground">
          Selected automatically from the public register: nominees with a verified
          photograph on file, a substantially complete profile, and a documented
          impact record. Selection is data-derived, not an award decision.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((n) => {
            const img = nomineeImage(n);
            const sub = data.subs.find((s) => s.id === n.subcategory_id);
            const summary = featuredSummary(n);
            const card = (
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-gold/50">
                <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                  {img ? (
                    <img
                      src={img}
                      alt={n.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <LightInitialsAvatar name={n.name} label={sub?.name} />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {n.nrc_verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
                        <BadgeCheck className="h-3 w-3" /> NRC verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        <ShieldQuestion className="h-3 w-3" /> Not yet NRC verified
                      </span>
                    )}
                    {typeof n.profile_completion_score === "number" && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                        Profile {n.profile_completion_score}%
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold leading-snug text-foreground group-hover:text-gold transition-colors">
                    {n.name}
                  </h3>
                  {n.organization && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {n.organization}
                    </p>
                  )}
                  {summary && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-4">{summary}</p>
                  )}
                  <div className="mt-auto pt-3 text-[11px] text-muted-foreground">
                    {[sub?.name, n.country, n.region].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </article>
            );
            return n.slug ? (
              <Link key={n.id} to={`/nominees/${n.slug}`} className="block h-full">
                {card}
              </Link>
            ) : (
              <div key={n.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategorySpotlight;
