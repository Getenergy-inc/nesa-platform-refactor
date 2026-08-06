// ============================================================================
// Africa Education Impact Directory — /nominees
//
// Editorial Recognition edition: mirrors the homepage design system
// (`.nesa-ed` skin) and its objectives — identity, recognition architecture,
// verified discovery, geographic reach, integrity firewall, conversion.
//
// Presentation-only refactor. Data layer (useCatalogueNominees / buildCatalogue
// / useSiteStats) is unchanged.
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Sparkles } from "lucide-react";

import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { UtilityBar } from "@/components/nesa/UtilityBar";
import { BottomPageNav } from "@/components/navigation/PageNavigation";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";

import { useCatalogueNominees } from "@/lib/directory/masterCatalogueSource";
import { buildCatalogue } from "@/lib/directory/buildCatalogue";
import { CATALOGUE_TIERS } from "@/config/directory/catalogueTaxonomy";
import { useSiteStats } from "@/config/siteStats";
import { DIRECTORY_NAME, REGION_FRAMING } from "@/config/platformCopy";
import { normalizeRegion } from "@/lib/regions";
import { trackEvent } from "@/lib/analytics";
import type { EnrichedDatabaseNominee } from "@/hooks/useNominees";

import "@/features/landing/editorial/editorial.css";
import "./nomineesEditorial.css";

const CANONICAL = "https://nesa.africa/nominees";

const ENABLER_TYPES = [
  "People", "Organisations", "Companies", "NGOs", "Governments", "Ministries",
  "Universities", "Schools", "Libraries", "Research Centres", "Faith-Based Organisations",
  "Foundations", "Development Partners", "Media Organisations", "CSR Programmes",
  "Social Enterprises", "EdTech Startups", "STEM Programmes", "Creative Industry",
  "Sports Foundations", "Music Foundations", "Diaspora Associations",
  "International Agencies", "Friends of Africa",
];

const INTEGRITY = [
  {
    title: "No public voting",
    body: "Recognition is never bought or crowd-sourced. Every profile in this directory is reviewed by the NRC and governance board.",
  },
  {
    title: "Evidence-led verification",
    body: "Nominees are assessed against documented, citable education impact — not popularity, follower count or self-declaration.",
  },
  {
    title: "Listing is not an award",
    body: "Appearing in the directory records a nomination. Recognition is only conferred at the Gold-Blue Garnet Awards Gala, 13 December 2026.",
  },
];

export default function NomineesHubPage() {
  const { data: nominees, isLoading } = useCatalogueNominees();
  const stats = useSiteStats();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");

  useEffect(() => {
    trackEvent("directory_view", { name: DIRECTORY_NAME, surface: "nominees_hub" });
  }, []);

  const catalogue = useMemo(() => buildCatalogue(nominees), [nominees]);

  const tierCounts = useMemo(() => {
    const out: Record<string, number> = {};
    catalogue.tiers.forEach((t) => { out[t.slug] = t.count; });
    return out;
  }, [catalogue]);

  const regionCounts = useMemo(() => {
    const out = new Map<string, number>();
    (nominees ?? []).forEach((n) => {
      const r = normalizeRegion(n.region ?? n.country ?? "");
      if (!r) return;
      out.set(r, (out.get(r) ?? 0) + 1);
    });
    return out;
  }, [nominees]);

  const featured = useMemo(() => {
    const list = (nominees ?? []).slice();
    return list
      .sort((a, b) => Number(b.nrcVerified) - Number(a.nrcVerified) || b.publicVotes - a.publicVotes)
      .slice(0, 8);
  }, [nominees]);

  const total = (nominees ?? []).length;

  const goToCatalogue = (extra?: Record<string, string>) => {
    const p = new URLSearchParams(extra ?? {});
    if (search.trim()) p.set("q", search.trim());
    const q = p.toString();
    trackEvent("directory_search", { surface: "nominees_hub", query: search.trim() });
    navigate(q ? `/nominees/catalogue?${q}` : "/nominees/catalogue");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${DIRECTORY_NAME} — NESA-Africa 2026`,
    description:
      "Africa's verified discovery platform for Education Enablers across eight African regions, the Diaspora and Friends of Africa.",
    url: CANONICAL,
  };

  return (
    <>
      <Helmet>
        <title>{`${DIRECTORY_NAME} — NESA-Africa 2026`}</title>
        <meta
          name="description"
          content="Explore verified Education Enablers recognised by NESA-Africa 2026 — people, organisations and institutions advancing Education for All across Africa."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={`${DIRECTORY_NAME} — NESA-Africa 2026`} />
        <meta
          property="og:description"
          content="Africa's verified directory of Education Enablers: 4 recognition tiers, 22 categories, eight African regions and the global African community."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <ScrollProgressIndicator />

      <div className="nesa-ed min-h-screen pt-14 sm:pt-16 pb-16">
        <UtilityBar />
        <NESAHeader />

        <main>
          {/* 1 — HERO */}
          <section className="ed-dir-hero" aria-labelledby="dir-heading">
            <div className="ed-dir-hero-inner">
              <div className="ed-badge">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                NOMINATIONS OPEN 30 AUGUST 2026 · NESA-AFRICA 2026
              </div>

              <div className="ed-kicker" style={{ marginTop: 18 }}>
                Recognising the Enablers of Education for All Across Africa
              </div>

              <h1 id="dir-heading" className="ed-dir-title">
                Africa Education
                <br />
                <span className="ed-accent">Impact Directory</span>
              </h1>

              <p className="ed-dir-sub">
                Every nominee, in one verified register. Search people, organisations and
                institutions across {stats.tiers} recognition tiers, {stats.categories} categories
                and {stats.subcategories} subcategories.
              </p>

              <form
                className="ed-dir-search"
                onSubmit={(e) => { e.preventDefault(); goToCatalogue(); }}
                role="search"
              >
                <label htmlFor="dir-search" className="sr-only">Search the directory</label>
                <input
                  id="dir-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search a nominee, organisation, country or category…"
                />
                <button type="submit" className="ed-btn-primary">
                  <Search className="inline h-4 w-4 mr-1.5 -mt-0.5" aria-hidden="true" />
                  Search
                </button>
              </form>

              <div className="ed-dir-counters">
                <Counter num={isLoading ? "—" : total.toLocaleString()} label="Nominee Profiles" />
                <Counter num={stats.tiers} label="Recognition Tiers" />
                <Counter num={stats.categories} label="Categories" />
                <Counter num={stats.subcategories} label="Subcategories" />
                <Counter num={`${stats.africanRegions}+2`} label="Regions & Communities" />
              </div>

              <div className="ed-hero-cta-row" style={{ justifyContent: "center" }}>
                <Link to="/nominate" className="ed-btn-primary">
                  Nominate an Education Enabler
                </Link>
                <Link to="/nominees/catalogue" className="ed-btn-ghost">
                  Browse the Full Catalogue →
                </Link>
              </div>
            </div>
          </section>

          {/* 2 — RECOGNITION TIERS */}
          <section className="ed-section" aria-labelledby="dir-tiers">
            <div className="ed-wrap">
              <div className="ed-section-head">
                <div className="ed-eyebrow">Browse by Recognition Tier</div>
                <h2 id="dir-tiers" className="ed-section-title">
                  Four Tiers. One Recognition Architecture.
                </h2>
                <p className="ed-section-sub">
                  Each tier carries its own nominee type, evidence requirements and review route.
                  Open a tier to see every nominee recorded under it.
                </p>
              </div>

              <div className="ed-dir-grid-4">
                {CATALOGUE_TIERS.map((t) => (
                  <article key={t.slug} className="ed-card">
                    <div className="ed-card-badge">TIER {t.tierNumber}</div>
                    <h3>{t.name}</h3>
                    <p>{t.blurb}</p>
                    <p className="ed-mono" style={{ color: "var(--ed-gold)", fontSize: "0.78rem" }}>
                      {isLoading ? "…" : `${(tierCounts[t.slug] ?? 0).toLocaleString()} nominees`}
                    </p>
                    <Link
                      to={`/nominees/catalogue?tier=${t.slug}`}
                      className="ed-link-inline"
                      onClick={() => trackEvent("directory_tier_click", { tier: t.slug })}
                    >
                      Explore nominees →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 3 — VERIFIED PROFILES */}
          <section className="ed-section ed-section-ink" aria-labelledby="dir-featured">
            <div className="ed-wrap">
              <div className="ed-section-head">
                <div className="ed-eyebrow">Verified Profiles</div>
                <h2 id="dir-featured" className="ed-section-title">
                  Education Enablers in the Register
                </h2>
                <p className="ed-section-sub">
                  NRC-verified profiles appear first. A listing records a nomination — it is not an
                  award.
                </p>
              </div>

              {isLoading ? (
                <div className="ed-nom-grid">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="ed-nom-card" style={{ height: 260, opacity: 0.4 }} />
                  ))}
                </div>
              ) : featured.length === 0 ? (
                <div className="ed-dir-empty">
                  Nominee profiles appear here as 2026 nominations are verified.
                </div>
              ) : (
                <div className="ed-nom-grid">
                  {featured.map((n) => <NomineeTile key={n.id} nominee={n} />)}
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: 36 }}>
                <Link to="/nominees/catalogue" className="ed-btn-primary">
                  Open the Full Recognition Catalogue →
                </Link>
              </div>
            </div>
          </section>

          {/* 4 — GEOGRAPHIC REACH */}
          <section className="ed-section" aria-labelledby="dir-regions">
            <div className="ed-wrap">
              <div className="ed-section-head">
                <div className="ed-eyebrow">Geographic Reach</div>
                <h2 id="dir-regions" className="ed-section-title">{REGION_FRAMING.headline}</h2>
                <p className="ed-section-sub">
                  Filter the register by where impact happens — across Africa, in the Diaspora, and
                  among Friends of Africa.
                </p>
              </div>

              <div className="ed-dir-regions">
                {[...REGION_FRAMING.africaRegions, ...REGION_FRAMING.globalCommunities].map((r) => (
                  <Link
                    key={r}
                    to={`/nominees/catalogue?region=${encodeURIComponent(r)}`}
                    className="ed-dir-region"
                    onClick={() => trackEvent("directory_region_click", { region: r })}
                  >
                    <span>{r}</span>
                    <span>{isLoading ? "…" : (regionCounts.get(normalizeRegion(r)) ?? 0)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 5 — ENABLER TYPES */}
          <section className="ed-section ed-section-ink" aria-labelledby="dir-types">
            <div className="ed-wrap">
              <div className="ed-section-head">
                <div className="ed-eyebrow">Who We Honour</div>
                <h2 id="dir-types" className="ed-section-title">Every Kind of Education Enabler</h2>
                <p className="ed-section-sub">
                  Recognition is open to individuals and institutions alike — from ministries and
                  universities to foundations, EdTech founders and diaspora associations.
                </p>
              </div>

              <div className="ed-dir-chips">
                {ENABLER_TYPES.map((t) => (
                  <Link
                    key={t}
                    to={`/nominees/catalogue?q=${encodeURIComponent(t)}`}
                    className="ed-dir-chip"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 6 — INTEGRITY FIREWALL */}
          <section className="ed-section" aria-labelledby="dir-integrity">
            <div className="ed-wrap">
              <div className="ed-section-head">
                <div className="ed-eyebrow">Integrity Safeguards</div>
                <h2 id="dir-integrity" className="ed-section-title">
                  How a Profile Earns Its Place
                </h2>
              </div>

              <div className="ed-grid-3">
                {INTEGRITY.map((i) => (
                  <article key={i.title} className="ed-card">
                    <h3>{i.title}</h3>
                    <p>{i.body}</p>
                  </article>
                ))}
              </div>

              <p className="ed-disclaimer" style={{ marginTop: 28 }}>
                NESA-Africa operates a governance firewall between nomination, verification and
                judging. Inclusion in this directory confers no award, ranking or endorsement.
              </p>
            </div>
          </section>

          {/* 7 — CONVERSION */}
          <section className="ed-section ed-section-ink" aria-labelledby="dir-cta">
            <div className="ed-wrap">
              <div className="ed-section-head">
                <div className="ed-eyebrow">Take Part</div>
                <h2 id="dir-cta" className="ed-section-title">
                  Someone You Know Belongs in This Register
                </h2>
                <p className="ed-section-sub">
                  Nominations open 30 August 2026. Submission is free, and you can create your
                  account at the moment you submit.
                </p>
              </div>

              <div className="ed-hero-cta-row" style={{ justifyContent: "center" }}>
                <Link
                  to="/nominate"
                  className="ed-btn-primary"
                  onClick={() => trackEvent("directory_cta_click", { cta: "nominate" })}
                >
                  Start a Nomination
                </Link>
                <Link to="/awards" className="ed-btn-ghost">
                  See the Recognition Framework →
                </Link>
                <Link to="/get-involved" className="ed-btn-ghost">
                  Volunteer or Partner →
                </Link>
              </div>
            </div>
          </section>
        </main>

        <NESAFooter />
        <BottomPageNav />
      </div>

      <BackToTopButton />
      <MobileBottomNav />
    </>
  );
}

function Counter({ num, label }: { num: string | number; label: string }) {
  return (
    <div className="ed-dir-counter">
      <div className="ed-dir-counter-num">{num}</div>
      <div className="ed-dir-counter-label">{label}</div>
    </div>
  );
}

function NomineeTile({ nominee }: { nominee: EnrichedDatabaseNominee }) {
  return (
    <Link to={`/nominees/${encodeURIComponent(nominee.slug)}`} className="ed-nom-card">
      <div className="ed-nom-media">
        <img
          src={nominee.photoUrl}
          alt={nominee.name}
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.svg"; }}
          style={{ objectFit: nominee.imageType === "logo" ? "contain" : "cover" }}
        />
      </div>
      <div className="ed-nom-body">
        <div className="ed-nom-name">{nominee.name}</div>
        <div className="ed-nom-meta">
          {[nominee.country, nominee.categoryName].filter(Boolean).join(" · ")}
        </div>
        <span className="ed-nom-tag">
          {nominee.nrcVerified ? "NRC Verified" : "Nomination Recorded"}
        </span>
      </div>
    </Link>
  );
}
