import { Helmet } from "react-helmet-async";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronRight, ShieldCheck } from "lucide-react";
import {
  TIER_SUBPAGES,
  TIER_INTEGRITY_LINE,
  type TierClusterConfig,
  type TierSubpage,
} from "@/config/awards/tierCluster";

const CANONICAL_HOST = "https://nesaafrica.lovable.app";

const accentClasses: Record<TierClusterConfig["accent"], { badge: string; ring: string; text: string }> = {
  gold: {
    badge: "bg-gold/15 text-gold border-gold/40",
    ring: "focus-visible:ring-gold/60",
    text: "text-gold",
  },
  "blue-garnet": {
    badge: "bg-blue-500/15 text-blue-300 border-blue-400/40",
    ring: "focus-visible:ring-blue-400/60",
    text: "text-blue-300",
  },
  platinum: {
    badge: "bg-slate-200/10 text-slate-200 border-slate-200/40",
    ring: "focus-visible:ring-slate-200/60",
    text: "text-slate-200",
  },
  coral: {
    badge: "bg-orange-500/15 text-orange-300 border-orange-400/40",
    ring: "focus-visible:ring-orange-400/60",
    text: "text-orange-300",
  },
};

interface Props {
  tier: TierClusterConfig;
  subpage: Exclude<TierSubpage, "overview">;
  children: React.ReactNode;
}

export function TierClusterLayout({ tier, subpage, children }: Props) {
  const location = useLocation();
  const accent = accentClasses[tier.accent];
  const seo = tier.seo[subpage];
  const canonical = `${CANONICAL_HOST}/awards/${tier.slug}/${subpage}`;
  const subpageLabel = TIER_SUBPAGES.find((s) => s.key === subpage)?.label ?? subpage;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${CANONICAL_HOST}/` },
      { "@type": "ListItem", position: 2, name: "Awards", item: `${CANONICAL_HOST}/awards` },
      { "@type": "ListItem", position: 3, name: tier.name, item: `${CANONICAL_HOST}/awards/${tier.slug}` },
      { "@type": "ListItem", position: 4, name: subpageLabel, item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="container pt-6 text-xs sm:text-sm text-white/60">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5 inline" /></li>
            <li><Link to="/awards" className="hover:text-white">Awards</Link></li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5 inline" /></li>
            <li>
              <Link to={`/awards/${tier.slug}`} className="hover:text-white">
                {tier.shortName}
              </Link>
            </li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5 inline" /></li>
            <li className={accent.text} aria-current="page">{subpageLabel}</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="container pt-4 pb-6 sm:pt-8 sm:pb-10">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] ${accent.badge}`}
          >
            {tier.name}
          </span>
          <h1 className="font-display mt-3 text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {tier.name} — <span className={accent.text}>{subpageLabel}</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/75 max-w-2xl">{tier.tagline}</p>
        </header>

        {/* Sticky sub-nav */}
        <div className="sticky top-14 sm:top-16 z-30 border-y border-white/10 bg-charcoal/95 backdrop-blur supports-[backdrop-filter]:bg-charcoal/70">
          <div className="container">
            <ul
              role="tablist"
              aria-label={`${tier.shortName} cluster navigation`}
              className="flex gap-1 overflow-x-auto py-2 scrollbar-none"
            >
              {TIER_SUBPAGES.map((s) => {
                const to = s.key === "overview" ? `/awards/${tier.slug}` : `/awards/${tier.slug}/${s.path}`;
                const active =
                  s.key === "overview"
                    ? location.pathname === `/awards/${tier.slug}`
                    : location.pathname === to;
                return (
                  <li key={s.key} role="presentation" className="shrink-0">
                    <NavLink
                      to={to}
                      role="tab"
                      aria-selected={active}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal ${accent.ring} ${
                        active
                          ? `${accent.badge}`
                          : "text-white/70 border border-transparent hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {s.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Body */}
        <main className="container py-6 sm:py-10">{children}</main>

        {/* Integrity footer strip */}
        <aside className="container pb-14">
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-[12px] sm:text-sm text-white/70">
            <ShieldCheck className={`h-4 w-4 shrink-0 mt-0.5 ${accent.text}`} aria-hidden />
            <span>{TIER_INTEGRITY_LINE}</span>
          </p>
        </aside>
      </div>
    </>
  );
}
