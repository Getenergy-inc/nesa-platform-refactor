// Award category placeholder page — branded landing for each Pathway recognition slug.
// Resolves card content from DB (pathway_cards) with static defaults as fallback.

import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathwayCards } from "@/hooks/usePathwayCards";

type Defaults = Record<
  string,
  {
    category: string;
    headline: string;
    awardLine: string;
    description: string;
    accentLabel: string;
    visualGradient: string;
    cta: string;
  }
>;

const DEFAULTS: Defaults = {
  "africa-education-icon": {
    category: "Lifetime Achievement",
    headline: "Who Will Be Crowned Africa Education Icon?",
    awardLine: "Africa Education Icon — Lifetime Achievement (2006–2026)",
    description:
      "Recognizing transformational leaders shaping education across Africa for over two decades.",
    accentLabel: "Legacy • 2006–2026",
    visualGradient: "from-gold/40 via-emerald-900/40 to-charcoal",
    cta: "Discover the Icon Award",
  },
  "csr-education": {
    category: "Corporate Recognition",
    headline: "Who Will Emerge as Africa's Leading CSR for Education Company?",
    awardLine: "Top CSR for Education Company Across African Regions — 2026",
    description:
      "Celebrating organizations funding, supporting, and transforming education systems.",
    accentLabel: "Corporate • Continental",
    visualGradient: "from-emerald-800/50 via-emerald-900/30 to-charcoal",
    cta: "Explore CSR Recognition",
  },
  "influencer-education": {
    category: "Digital Voices",
    headline: "Who Are Africa's Top Education Influencers?",
    awardLine: "Social Media, Music, and Sports Voices Shaping Education — 2026",
    description:
      "Recognizing influential voices driving education awareness across the continent.",
    accentLabel: "Creators • Music • Sports",
    visualGradient: "from-gold/35 via-orange-900/30 to-charcoal",
    cta: "See Influencer Categories",
  },
  "grants-global-support": {
    category: "Global Partnerships",
    headline: "Which Global Grants Are Powering Education in Africa?",
    awardLine: "Bilateral, Multilateral, and International Education Support — 2026",
    description: "Honoring global partners investing in education across Africa.",
    accentLabel: "Global • Bilateral • Multilateral",
    visualGradient: "from-emerald-900/50 via-gold/15 to-charcoal",
    cta: "View Global Support Awards",
  },
};

const SLUG_TO_DB_ID: Record<string, string> = {
  "africa-education-icon": "icon",
  "csr-education": "csr",
  "influencer-education": "influencer",
  "grants-global-support": "grants",
};

export default function AwardPathwayPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { cards } = usePathwayCards();
  const fallback = DEFAULTS[slug];
  const dbRow = cards.find((c) => c.id === SLUG_TO_DB_ID[slug]);

  const data = dbRow
    ? {
        category: dbRow.category,
        headline: dbRow.headline,
        awardLine: dbRow.award_line,
        description: dbRow.description,
        accentLabel: dbRow.accent_label || fallback?.accentLabel || "",
        visualGradient: dbRow.visual_gradient || fallback?.visualGradient || "",
        cta: dbRow.cta,
        image: dbRow.image_url,
      }
    : fallback
      ? { ...fallback, image: null as string | null }
      : null;

  if (!data) {
    return (
      <div className="bg-charcoal min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-white mb-3">Award category coming soon</h1>
          <p className="text-white/70 mb-6">This recognition pathway is being prepared.</p>
          <Link to="/pathways">
            <Button className="bg-gold hover:bg-gold-dark text-charcoal rounded-full">
              Back to Pathways to Recognition
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${data.category} — NESA-Africa 2026`}</title>
        <meta name="description" content={data.description} />
      </Helmet>

      <section className="relative bg-charcoal overflow-hidden">
        {/* Hero */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.visualGradient} opacity-80`} />
        {data.image && (
          <img
            src={data.image}
            alt={data.category}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/70 to-charcoal" />

        <div className="container relative px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                {data.accentLabel}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              {data.category}
            </h1>

            <p className="text-gold font-semibold text-lg sm:text-xl mb-3">{data.awardLine}</p>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              {data.headline} {data.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/nominate?category=${slug}`}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-7 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.6)]"
                >
                  Start a Nomination
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pathways">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2 px-7"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Pathways to Recognition
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coming-soon body — branded, professional placeholder */}
      <section className="bg-charcoal py-14 sm:py-20">
        <div className="container px-4 sm:px-6 max-w-4xl">
          <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-emerald-900/20 to-charcoal p-6 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6 text-charcoal" />
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                  Full criteria & nominees publishing soon
                </h2>
                <p className="text-white/70 leading-relaxed">
                  We are finalising the full nominee directory, judging rubric, and partner
                  citations for <span className="text-gold font-semibold">{data.category}</span>.
                  Submit your nomination now to be considered for the {data.awardLine.split("—")[1]?.trim() || "2026"} cycle.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                to={`/nominate?category=${slug}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition"
              >
                <span className="text-white font-semibold">{data.cta}</span>
                <ArrowRight className="h-4 w-4 text-gold group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/categories"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition"
              >
                <span className="text-white font-semibold">Explore all categories</span>
                <ArrowRight className="h-4 w-4 text-gold group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
