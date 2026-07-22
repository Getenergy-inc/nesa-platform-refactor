import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { getArea, type PortalAreaId } from "@/config/judgeapply/portalRegistry";
import { cn } from "@/lib/utils";

interface Props {
  areaId?: PortalAreaId;
}

export default function AreaLanding({ areaId: areaProp }: Props) {
  const params = useParams<{ areaId: PortalAreaId }>();
  const areaId = areaProp ?? params.areaId;
  const area = areaId ? getArea(areaId) : undefined;

  if (!area) return <Navigate to="/judgeapply" replace />;

  return (
    <>
      <Helmet>
        <title>{`${area.label} | NESA-Africa Judges & NRC Portal`}</title>
        <meta name="description" content={area.intro} />
      </Helmet>

      <section className="border-b border-gold/15 bg-charcoal-light">
        <div className="container py-14 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            <area.icon className="h-3.5 w-3.5" />
            {area.label}
          </div>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold">
            {area.tagline}
          </h1>
          <p className="mt-4 max-w-3xl text-white/75">{area.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {area.landing.ctas.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                  c.variant === "primary"
                    ? "bg-gold text-charcoal hover:bg-gold-dark"
                    : "border border-gold/40 text-gold hover:bg-gold/10",
                )}
              >
                {c.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {area.landing.highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-gold/15 bg-charcoal-light p-6"
            >
              <h.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-3 font-display text-lg text-white">{h.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <h2 className="font-display text-2xl text-white mb-6">
          Explore {area.label}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {area.pages.map((p) => (
            <Link
              key={p.slug}
              to={`${area.path}/${p.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-gold/15 bg-charcoal-light p-5 hover:border-gold/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0">
                <p.icon className="h-5 w-5 text-gold" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white">{p.title}</div>
                <div className="text-sm text-white/60 mt-0.5">{p.short}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gold">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
