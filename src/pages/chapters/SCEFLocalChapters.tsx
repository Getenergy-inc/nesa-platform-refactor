// SCEF Local Chapters & Friends of EduAid-Africa
// Content model verified against santoscreations.org/chapters.
// NOTE: This page introduces NO payment, wallet or ledger code.
// Any support CTA routes to the existing /donate flow.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Globe2,
  HeartHandshake,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AFRICA_REGIONS } from "@/config/regions/africaRegions";
import { useChapterRegionCounts } from "@/hooks/useChapterRegionCounts";

type StatusLevel = "active" | "planned" | "proposed" | "unconfirmed";

const STATUS_META: Record<StatusLevel, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  planned: { label: "Planned", className: "bg-gold/15 text-gold border-gold/30" },
  proposed: { label: "Proposed", className: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  unconfirmed: {
    label: "Status not yet confirmed",
    className: "bg-white/5 text-white/60 border-white/15",
  },
};

interface ActivityRow {
  key: string;
  label: string;
  status: StatusLevel;
}

const LEGACY_PATHWAY = [
  "NESA-Africa recognition",
  "EduAid-Africa conference",
  "Regional school voting",
  "GFA Wzip wallet (proposed)",
  "Rebuild My School Africa intervention",
];

const GOVERNANCE_LIMITS = [
  "Do not own SCEF assets, brand or intellectual property",
  "Do not operate separate wallets or independent financial accounts",
  "Do not sign contracts on behalf of SCEF",
  "Do not fundraise independently of approved SCEF channels",
  "Do not represent SCEF outside approved governance structures",
];

function StatusPill({ status }: { status: StatusLevel }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function ActivityList({ rows }: { rows: ActivityRow[] }) {
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.key} className="flex items-start justify-between gap-3 text-sm">
          <span className="text-white/70">{row.label}</span>
          <StatusPill status={row.status} />
        </li>
      ))}
    </ul>
  );
}

export default function SCEFLocalChapters() {
  const { bySlug, total, loading } = useChapterRegionCounts();

  const buildRows = (slug: string): ActivityRow[] => {
    const chapters = bySlug[slug] ?? 0;
    return [
      {
        key: "chapter",
        label: "Local chapter presence",
        // Verified from the live chapters table.
        status: loading ? "unconfirmed" : chapters > 0 ? "active" : "planned",
      },
      {
        key: "nominations",
        // Verified: nominations are open continent-wide for the 2026 cycle.
        label: "NESA-Africa nominations",
        status: "active",
      },
      {
        key: "voting",
        // No regional school voting records exist yet.
        label: "Regional school voting",
        status: "unconfirmed",
      },
      {
        key: "wallet",
        label: "GFA Wzip wallet routing",
        status: "proposed",
      },
      {
        key: "rebuild",
        // No school records registered for this region yet.
        label: "Rebuild My School Africa",
        status: "unconfirmed",
      },
      {
        key: "edutourism",
        label: "Afri-EduTourism programme",
        status: "unconfirmed",
      },
    ];
  };

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Helmet>
        <title>SCEF Local Chapters & Friends of EduAid-Africa</title>
        <meta
          name="description"
          content="One continental network, locally rooted: SCEF's 8 approved Africa regions plus the African Diaspora and Friends of Africa global networks, with honest per-region status."
        />
        <meta property="og:title" content="SCEF Local Chapters & Friends of EduAid-Africa" />
        <meta
          property="og:description"
          content="SCEF's licensed local chapter network across 8 Africa regions plus African Diaspora and Friends of Africa."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://nesa.africa/scef-local-chapters" />
      </Helmet>

      {/* Header */}
      <header className="border-b border-gold/20 bg-gradient-to-b from-black to-charcoal">
        <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <Badge className="mb-4 border-gold/30 bg-gold/10 text-gold">Santos Creations Educational Foundation</Badge>
          <h1 className="font-playfair text-3xl leading-tight sm:text-5xl">
            SCEF Local Chapters &amp; Friends of EduAid-Africa
          </h1>
          <p className="mt-3 text-lg text-gold">One continental network, locally rooted.</p>
          <p className="mt-5 max-w-3xl text-white/70">
            SCEF organises the continent into eight approved regions, extended by two global networks — the
            African Diaspora and Friends of Africa. Local chapters are licensed implementation platforms
            operating under SCEF governance, not independent organisations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-gold text-black hover:bg-gold/90">
              <Link to="/join-local-chapter">Join a Local Chapter</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/impact/nominate-school">Nominate a School</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/50">
            {loading ? "Loading chapter data…" : `${total} active chapter${total === 1 ? "" : "s"} recorded across the network today.`}
          </p>
        </div>
      </header>

      {/* Governance explainer */}
      <section className="border-b border-white/10 py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="font-playfair text-2xl sm:text-3xl">Governance: chapters are not franchises</h2>
          </div>
          <p className="mt-4 max-w-3xl text-white/70">
            Local chapters are licensed country, regional, diaspora and community implementation platforms.
            They are governed by SCEF through Local Chapter Services and compliance oversight. A chapter
            licence grants the right to implement approved programmes locally — nothing more.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {GOVERNANCE_LIMITS.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-white/75">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-gold/20 bg-gold/[0.04] p-6">
            <h3 className="font-playfair text-xl text-gold">The Legacy Pathway</h3>
            <p className="mt-2 text-sm text-white/60">
              This is the intended roadmap for how recognition becomes local impact. Not every step is live
              today — see the per-region status flags below.
            </p>
            <ol className="mt-5 flex flex-col gap-3 md:flex-row md:items-stretch">
              {LEGACY_PATHWAY.map((step, i) => (
                <li key={step} className="flex flex-1 items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-black">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/80">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 rounded-xl border border-sky-500/20 bg-sky-500/[0.05] p-6">
            <h3 className="text-base font-semibold text-sky-200">On the GFA Wzip wallet</h3>
            <p className="mt-2 text-sm text-white/70">
              GFA Wzip is a <strong>proposed, in-development financial infrastructure concept</strong> for
              routing funds to regional education interventions. It is not an operational payment,
              custody or settlement system, and no chapter operates a wallet. All giving today runs
              through SCEF's existing central donation channel.
            </p>
          </div>
        </div>
      </section>

      {/* Regional cards */}
      <section className="py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-2 text-gold">
            <MapPin className="h-5 w-5" />
            <h2 className="font-playfair text-2xl sm:text-3xl">Eight approved Africa regions</h2>
          </div>
          <p className="mt-3 max-w-3xl text-white/70">
            Each region carries independent status flags. Where an activity cannot be verified from current
            platform data, it is marked <em>Status not yet confirmed</em> rather than assumed.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AFRICA_REGIONS.map((region) => {
              const chapters = bySlug[region.slug] ?? 0;
              return (
                <Card key={region.slug} className="border-white/10 bg-white/[0.03]">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="font-playfair text-xl text-white">{region.name}</CardTitle>
                      <Building2 className="h-5 w-5 shrink-0 text-gold/70" />
                    </div>
                    <p className="text-xs text-white/50">
                      {region.countries.length} countries ·{" "}
                      {loading
                        ? "loading…"
                        : chapters > 0
                          ? `${chapters} active chapter${chapters === 1 ? "" : "s"}`
                          : "no chapter recorded yet"}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <p className="text-sm text-white/65">{region.description}</p>
                    <ActivityList rows={buildRows(region.slug)} />
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button asChild size="sm" className="bg-gold text-black hover:bg-gold/90">
                        <Link to="/impact/nominate-school">Nominate a School</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                        <Link to="/join-local-chapter">Join Local Chapter</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* African Diaspora */}
            <Card className="border-gold/25 bg-gold/[0.05]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="font-playfair text-xl text-gold">African Diaspora</CardTitle>
                  <Globe2 className="h-5 w-5 shrink-0 text-gold/70" />
                </div>
                <p className="text-xs text-white/50">Global network · not an Africa region</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm text-white/65">
                  Africans abroad organising as community platforms that support education delivery on the
                  continent under SCEF governance.
                </p>
                <ActivityList rows={buildRows("diaspora")} />
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm" className="bg-gold text-black hover:bg-gold/90">
                    <Link to="/impact/nominate-school">Nominate a School</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                    <Link to="/join-local-chapter">Join Local Chapter</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Friends of Africa */}
            <Card className="border-gold/25 bg-gold/[0.05]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="font-playfair text-xl text-gold">Friends of Africa</CardTitle>
                  <HeartHandshake className="h-5 w-5 shrink-0 text-gold/70" />
                </div>
                <p className="text-xs text-white/50">Global network · not an Africa region</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm text-white/65">
                  International supporters, institutions and partners who are not of African descent but
                  commit to African education outcomes.
                </p>
                <ActivityList rows={buildRows("friends-of-africa")} />
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm" className="bg-gold text-black hover:bg-gold/90">
                    <Link to="/impact/nominate-school">Nominate a School</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                    <Link to="/join-local-chapter">Join Local Chapter</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Friends of EduAid-Africa */}
      <section className="border-t border-white/10 bg-black/40 py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Badge className="mb-4 border-gold/30 bg-gold/10 text-gold">Diaspora &amp; International</Badge>
          <h2 className="font-playfair text-2xl sm:text-3xl">Friends of EduAid-Africa</h2>
          <p className="mt-4 text-white/70">
            Friends of EduAid-Africa are the international chapters and supporters of Santos Creations
            Educational Foundation. Members advocate, mobilise and support EduAid-Africa programmes from
            outside the continent — always through approved SCEF governance, never as independent entities.
          </p>
          <p className="mt-4 text-sm text-white/50">
            Support is received only through SCEF's existing central donation channel. Chapters and friends
            groups do not hold funds, operate wallets or fundraise independently.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold text-black hover:bg-gold/90">
              <Link to="/donate">
                Support EduAid-Africa <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/impact/friends-of-eduaid-africa">Learn about Friends of EduAid-Africa</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
