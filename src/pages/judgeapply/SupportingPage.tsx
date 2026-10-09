import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { getArea, getPage, type PortalAreaId } from "@/config/judgeapply/portalRegistry";
import { cn } from "@/lib/utils";

interface Props {
  areaId?: PortalAreaId;
}

export default function SupportingPage({ areaId: areaProp }: Props) {
  const params = useParams<{ areaId: PortalAreaId; slug: string }>();
  const areaId = areaProp ?? params.areaId;
  const slug = params.slug;
  const area = areaId ? getArea(areaId) : undefined;
  const page = areaId && slug ? getPage(areaId, slug) : undefined;

  // Invalid slug → redirect to area landing (or portal home if no area)
  if (!area) return <Navigate to="/judgeapply" replace />;
  if (!page) return <Navigate to={area.path} replace />;

  return (
    <>
      <Helmet>
        <title>{`${page.title} | ${area.label} | NESA-Africa`}</title>
        <meta name="description" content={page.short} />
      </Helmet>

      <section className="border-b border-gold/15 bg-charcoal-light">
        <div className="container py-10 md:py-14">
          <Link
            to={area.path}
            className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-gold"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to {area.label}
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            <page.icon className="h-3.5 w-3.5" />
            {area.label}
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold">{page.title}</h1>
          <p className="mt-3 max-w-3xl text-white/70">{page.short}</p>
        </div>
      </section>

      <section className="container py-12 max-w-3xl">
        <div className="space-y-8">
          {page.sections.map((s) => (
            <article key={s.heading}>
              <h2 className="font-display text-xl text-gold mb-2">{s.heading}</h2>
              <p className="text-white/80 leading-relaxed">{s.body}</p>
              {s.bullets && (
                <ul className="mt-3 space-y-1.5 text-sm text-white/70 list-disc pl-5">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        {page.cta && page.cta.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {page.cta.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                  c.variant === "secondary"
                    ? "border border-gold/40 text-gold hover:bg-gold/10"
                    : "bg-gold text-charcoal hover:bg-gold-dark",
                )}
              >
                {c.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        )}

        {/* Sibling nav */}
        <div className="mt-14 border-t border-gold/15 pt-6">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-3">
            More from {area.label}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {area.pages
              .filter((p) => p.slug !== page.slug)
              .map((p) => (
                <Link
                  key={p.slug}
                  to={`${area.path}/${p.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-gold/10 px-3 py-2 text-sm text-white/80 hover:border-gold/40 hover:text-white"
                >
                  <p.icon className="h-4 w-4 text-gold" />
                  {p.title}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
