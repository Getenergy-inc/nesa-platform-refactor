import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  ShieldCheck,
  Sparkles,
  Users,
  ScrollText,
  Wrench,
  HeartHandshake,
  Globe2,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { NomineeCard } from "@/components/iconAward/shared";
import {
  ICON_AWARD,
  ICON_NOMINEES,
  ICON_SUBCATEGORIES,
  ICON_CLASSIFICATIONS,
  bySubcategory,
  byClassification,
  featured,
  subcategoryUrl,
  classificationUrl,
  type IconSubcategorySlug,
} from "@/data/iconAward";

const CANONICAL = "https://nesaafrica.lovable.app/awards/africa-education-icon";

const PATHWAY_ICONS: Record<IconSubcategorySlug, typeof ScrollText> = {
  "literary-new-curriculum-advocate": ScrollText,
  "technical-educator-icon": Wrench,
  "education-philanthropy-icon": HeartHandshake,
};

const SELECTION_STEPS = [
  { n: 1, title: "Nomination", body: "Public, peer, and institutional nominations open across all three subcategories." },
  { n: 2, title: "Verification", body: "Nominee Research Corps (NRC) verifies records, evidence, and longevity of impact." },
  { n: 3, title: "Classification", body: "Each verified nominee is sorted into one of three classifications." },
  { n: 4, title: "Jury Review", body: "Independent continental jury evaluates lifetime contribution against rubric." },
  { n: 5, title: "Shortlist", body: "Final shortlist published for public transparency — no public voting on Icon." },
  { n: 6, title: "Laureate Reveal", body: "Nine laureates honoured at the NESA-Africa 2026 Gala — one per subcategory × classification." },
];

export default function AfricaEducationIconPage() {
  const total = ICON_NOMINEES.length;
  const hallPreview = ICON_NOMINEES
    .filter((n) => n.verification_status === "verified")
    .slice(0, 8);

  return (
    <>
      <Helmet>
        <title>Africa Education Icon Award 2006–2026 | NESA-Africa</title>
        <meta
          name="description"
          content="Two decades of visionary African education leaders — literary advocates, technical educators, and philanthropists. Explore subcategories, classifications, and the selection process."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Africa Education Icon Award 2006–2026 | NESA-Africa" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          { name: "Africa Education Icon", path: "/awards/africa-education-icon" },
        ]}
      />

      <div className="min-h-screen bg-charcoal">
        {/* ───────────────── 1. HERO ───────────────── */}
        <section className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-black via-charcoal to-charcoal-light">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, hsl(42 85% 52%) 0, transparent 45%), radial-gradient(circle at 85% 80%, hsl(42 85% 52%) 0, transparent 45%)",
            }}
          />
          <div className="container relative mx-auto px-4 py-20 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-4xl text-center"
            >
              <Badge
                variant="outline"
                className="mb-5 border-gold/40 bg-gold/5 px-3 py-1 text-gold inline-flex items-center gap-1.5"
              >
                <Crown className="h-3 w-3" />
                Lifetime Achievement · {ICON_AWARD.yearRange}
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Africa Education Icon Award{" "}
                <span className="text-gold">2006–2026</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-white/75">
                Two decades. Three pathways. Nine laureates. A continental Hall of Fame for the
                educators, advocates, and philanthropists who reshaped African learning.
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {[
                  { v: total, l: "Verified Nominees" },
                  { v: ICON_SUBCATEGORIES.length, l: "Subcategories" },
                  { v: ICON_CLASSIFICATIONS.length, l: "Classifications" },
                  { v: 9, l: "Final Laureates" },
                ].map((m) => (
                  <div
                    key={m.l}
                    className="rounded-xl border border-gold/20 bg-white/[0.03] px-3 py-3"
                  >
                    <div className="font-display text-2xl font-bold text-gold">{m.v}</div>
                    <div className="text-[11px] text-white/60 mt-0.5">{m.l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                  <a href="#nomination-form">
                    Nominate an Education Icon
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-white hover:bg-gold/10"
                >
                  <Link to="/awards/africa-education-icon/nominees">
                    Explore Existing Nominees
                  </Link>
                </Button>
              </div>

              <p className="mt-6 text-xs text-white/50 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                {ICON_AWARD.status} · No public voting · Independent continental jury
              </p>
            </motion.div>
          </div>
        </section>

        {/* ───────────────── 2. PATHWAYS ───────────────── */}
        <section id="subcategories" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-10">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                Step 1 · Choose a Subcategory
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
                Three Pathways to Icon Status
              </h2>
              <p className="mt-3 text-white/65">
                Every Icon nominee is recognised through one of three lifetime-impact pathways.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {ICON_SUBCATEGORIES.map((sub, i) => {
                const Icon = PATHWAY_ICONS[sub.slug];
                const count = bySubcategory(sub.slug).length;
                return (
                  <motion.div
                    key={sub.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={subcategoryUrl(sub.slug)}
                      className="group block h-full rounded-2xl border border-gold/20 bg-gradient-to-b from-charcoal-light to-charcoal p-6 transition-all hover:border-gold/50 hover:shadow-[0_20px_50px_-20px_hsl(42_85%_52%/0.35)]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge className="bg-gold/15 text-gold border-gold/30">
                          {count} {count === 1 ? "Nominee" : "Nominees"}
                        </Badge>
                      </div>
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-gold transition-colors leading-tight">
                        {sub.title}
                      </h3>
                      <p className="mt-3 text-sm text-white/65 leading-relaxed">
                        {sub.description}
                      </p>
                      <span className="mt-5 inline-flex items-center text-sm font-semibold text-gold group-hover:gap-2 gap-1 transition-all">
                        Explore pathway <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────── 3. CLASSIFICATIONS ───────────────── */}
        <section className="border-y border-gold/10 bg-black/40 py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-10">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                Step 2 · Pick a Classification
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
                One Continent. Three Classifications.
              </h2>
              <p className="mt-3 text-white/65">
                Every pathway honours three groups of contributors. Nine laureates total —
                one per pathway × classification.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {ICON_CLASSIFICATIONS.map((c, i) => {
                const count = ICON_SUBCATEGORIES.reduce(
                  (n, s) => n + byClassification(s.slug, c.slug).length,
                  0,
                );
                return (
                  <motion.div
                    key={c.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl border border-gold/15 bg-charcoal-light p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Globe2 className="h-5 w-5 text-gold/80" />
                      <span className="text-xs text-white/50">{count} verified</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">{c.title}</h3>
                    <p className="mt-2 text-sm text-white/65 leading-relaxed">{c.description}</p>

                    <div className="mt-5 space-y-2 border-t border-gold/10 pt-4">
                      {ICON_SUBCATEGORIES.map((sub) => {
                        const n = byClassification(sub.slug, c.slug).length;
                        return (
                          <Link
                            key={sub.slug}
                            to={classificationUrl(sub.slug, c.slug)}
                            className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-white/70 hover:bg-gold/5 hover:text-gold transition-colors"
                          >
                            <span className="truncate">{sub.short}</span>
                            <span className="flex items-center gap-1 text-gold font-semibold">
                              {n}
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────── 4. SELECTION PROCESS ───────────────── */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-10">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                Integrity · Selection Process
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
                How Icons Are Chosen
              </h2>
              <p className="mt-3 text-white/65">
                Six transparent stages — from open nomination to laureate reveal. Jury-only,
                no public voting, evidence-based throughout.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SELECTION_STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative rounded-xl border border-gold/15 bg-charcoal-light p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-charcoal font-display font-bold text-sm">
                      {s.n}
                    </div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{s.body}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-white/60">
              {[
                "NRC-verified evidence",
                "Continental jury",
                "Conflict-of-interest firewall",
                "Audit-logged decisions",
              ].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-white/[0.03] px-3 py-1"
                >
                  <CheckCircle2 className="h-3 w-3 text-gold" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────── 5. HALL PREVIEW ───────────────── */}
        <section className="border-t border-gold/10 bg-black/40 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div className="max-w-2xl">
                <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                  Hall of Fame · Preview
                </span>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
                  Verified Icons in the Hall
                </h2>
                <p className="mt-3 text-white/65">
                  A glimpse of the {total}+ verified nominees across all pathways. Open the full
                  Hall to browse by pathway, classification, region, or country.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-gold/40 text-white hover:bg-gold/10"
              >
                <Link to="/nominees/africa-education-icon-award">
                  Open the full Hall <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hallPreview.map((n) => (
                <NomineeCard key={n.id} nominee={n} showSubBadge />
              ))}
            </div>

            {/* Per-pathway quick links */}
            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {ICON_SUBCATEGORIES.map((sub) => {
                const sample = featured(sub.slug, undefined, 1)[0];
                return (
                  <Link
                    key={sub.slug}
                    to={subcategoryUrl(sub.slug)}
                    className="group flex items-center justify-between rounded-xl border border-gold/15 bg-charcoal-light px-4 py-3 hover:border-gold/40 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wider text-gold/80 font-semibold">
                        {sub.short}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-white truncate">
                        {sample ? `e.g. ${sample.name}` : "Browse honourees"}
                      </div>
                    </div>
                    <Users className="h-4 w-4 text-gold/70" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────── FINAL CTA ───────────────── */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-gold mb-3" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
              Know an Education Icon shaping Africa?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/65">
              Nominations stay open through the {ICON_AWARD.yearRange} cycle. Help us honour the
              legends whose lifetime work transformed African learning.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to="/nominate?category=africa-education-icon-award">
                  <Award className="mr-2 h-4 w-4" />
                  Nominate an Education Icon
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/40 text-white hover:bg-gold/10"
              >
                <Link to="/nominees/africa-education-icon-award">Explore All Categories</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
