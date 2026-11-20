import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Sparkles } from "lucide-react";
import { MobileBottomActions } from "@/components/navigation/MobileBottomActions";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { CATALOGUE_TIERS } from "@/config/directory/catalogueTaxonomy";
import { DIRECTORY_NAME } from "@/config/platformCopy";
import { NOMINATIONS_OPEN_LABEL } from "@/config/nominationWindows2026";
import { trackEvent } from "@/lib/analytics";
import "@/features/landing/editorial/editorial.css";
import "./nomineesEditorial.css";

const CANONICAL = "https://nesa.africa/nominees";
const INTEGRITY = [
  { title: "No public voting", body: "Recognition is never bought or crowd-sourced. Publication follows the applicable research, verification and governance controls." },
  { title: "Evidence-led verification", body: "Nominees are assessed against documented, citable education impact — not popularity, follower count or self-declaration." },
  { title: "Listing is not an award", body: "Publication of a profile does not guarantee eligibility, shortlisting, judging, selection or recognition. Information may be corrected as verification continues." },
];
const CATALOGUE_FILTER_PARAMS = ["family", "tier", "category", "subcategory", "region", "country", "year", "verification", "organisation"];
const AWARD_FAMILY_TO_TIER: Record<string, string> = { icon: "africa-education-icon", influencer: "influencer-education-impact", "gold-bluegarnet": "blue-garnet", "blue-garnet": "blue-garnet", platinum: "platinum" };

export function catalogueRedirectTarget(params: URLSearchParams): string | null {
  const next = new URLSearchParams();
  let matched = false;
  CATALOGUE_FILTER_PARAMS.forEach((key) => {
    const value = params.get(key);
    if (value) { next.set(key, value); matched = true; }
  });
  const awardFamily = params.get("awardFamily");
  if (awardFamily) {
    const tier = AWARD_FAMILY_TO_TIER[awardFamily.toLowerCase()];
    if (tier) { next.set("tier", tier); matched = true; }
  }
  if (!matched) return null;
  const q = params.get("q");
  if (q) next.set("q", q);
  return `/nominees/catalogue?${next.toString()}`;
}

export default function NomineesHubPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const redirectTo = catalogueRedirectTarget(params);

  useEffect(() => { trackEvent("directory_view", { name: DIRECTORY_NAME, surface: "nominees_hub" }); }, []);

  const goToCatalogue = () => {
    const query = new URLSearchParams();
    if (search.trim()) query.set("q", search.trim());
    const value = query.toString();
    trackEvent("directory_search", { surface: "nominees_hub", query: search.trim() });
    navigate(value ? `/nominees/catalogue?${value}` : "/nominees/catalogue");
  };

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <>
      <Helmet>
        <title>Nominees | NESA-Africa 2026</title>
        <meta name="description" content="Search authorised NESA-Africa nominee profiles by name, organisation, country or recognition tier. Publication remains subject to review and consent." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Nominees | NESA-Africa 2026" />
        <meta property="og:description" content="Explore authorised Education Enabler profiles across four recognition tiers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <ScrollProgressIndicator />
      <div className="nesa-ed min-h-screen pb-16">
        <main>
          <section className="ed-dir-hero" aria-labelledby="dir-heading">
            <div className="ed-dir-hero-inner">
              <div className="ed-badge"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />NOMINATIONS OPEN {NOMINATIONS_OPEN_LABEL.toUpperCase()} · NESA-AFRICA 2026</div>
              <h1 id="dir-heading" className="ed-dir-title">Nominee Profiles <span className="ed-accent">and Review Status</span></h1>
              <p className="ed-dir-sub">This directory publishes authorised information only at the appropriate review stage and subject to consent, evidence and publication controls.</p>
              <form className="ed-dir-search" onSubmit={(event) => { event.preventDefault(); goToCatalogue(); }} role="search">
                <label htmlFor="dir-search" className="sr-only">Search the directory</label>
                <input id="dir-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a nominee, organisation, country or category…" />
                <button type="submit" className="ed-btn-primary"><Search className="mr-1.5 inline h-4 w-4" aria-hidden="true" />Search</button>
              </form>
              <div className="ed-hero-cta-row" style={{ justifyContent: "center" }}>
                <Link to="/nominate" className="ed-btn-primary">Submit a Nomination</Link>
                <Link to="/nominees/catalogue" className="ed-btn-ghost">Browse the Full Catalogue →</Link>
              </div>
            </div>
          </section>

          <section className="ed-section" aria-labelledby="dir-tiers">
            <div className="ed-wrap">
              <div className="ed-section-head">
                <div className="ed-eyebrow">Browse by Recognition Tier</div>
                <h2 id="dir-tiers" className="ed-section-title">Four Tiers. One Recognition Architecture.</h2>
                <p className="ed-section-sub">Each tier has its own nominee type, evidence requirements and review route.</p>
              </div>
              <div className="ed-dir-grid-4">
                {CATALOGUE_TIERS.map((tier) => (
                  <article key={tier.slug} className="ed-card">
                    <div className="ed-card-badge">TIER {tier.tierNumber}</div>
                    <h3>{tier.name}</h3>
                    <p>{tier.blurb}</p>
                    <Link to={`/nominees/catalogue?tier=${tier.slug}`} className="ed-link-inline" onClick={() => trackEvent("directory_tier_click", { tier: tier.slug })}>Explore nominees →</Link>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="ed-section ed-section-ink" aria-labelledby="dir-publication">
            <div className="ed-wrap">
              <div className="ed-section-head"><div className="ed-eyebrow">Controlled Publication</div><h2 id="dir-publication" className="ed-section-title">Authorised profiles appear after approval</h2></div>
              <div className="ed-dir-empty">Nominee profiles appear here as nominations complete the required verification, consent and publication review.</div>
            </div>
          </section>

          <section className="ed-section" aria-labelledby="dir-integrity">
            <div className="ed-wrap">
              <div className="ed-section-head"><div className="ed-eyebrow">Integrity Safeguards</div><h2 id="dir-integrity" className="ed-section-title">How a Profile Earns Its Place</h2></div>
              <div className="ed-grid-3">{INTEGRITY.map((item) => <article key={item.title} className="ed-card"><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
              <p className="ed-disclaimer" style={{ marginTop: 28 }}>NESA-Africa separates nomination, verification and judging. Inclusion in this directory confers no award, ranking or endorsement.</p>
            </div>
          </section>
        </main>
      </div>
      <BackToTopButton />
      <MobileBottomActions />
    </>
  );
}
