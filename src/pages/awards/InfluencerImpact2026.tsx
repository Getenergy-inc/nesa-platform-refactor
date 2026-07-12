import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  School,
  Users,
  BookOpen,
  ClipboardCheck,
  UserCheck,
  Vote,
  Award as AwardIcon,
} from "lucide-react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { InfluencerNominationForm } from "@/components/awards/InfluencerNominationForm";
import { NomineeCard } from "@/components/influencer-impact/NomineeCard";
import { SEED_NOMINEES, REGIONS } from "@/config/awards/influencerImpact2026";
import { trackEvent } from "@/lib/analytics";

const DIRECTORY_ROUTE = "/awards/influencer-education-impact/nominees";

function scrollToForm() {
  document
    .getElementById("influencer-nomination-form")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function InfluencerImpact2026() {
  useEffect(() => {
    trackEvent("page_view", {
      page: "influencer-education-impact-2026",
    });
  }, []);

  // 2 nominees per pathway = 6
  const featured = useMemo(() => {
    const pick = (cat: "social-media" | "sports" | "music") =>
      SEED_NOMINEES.filter((n) => n.award_category === cat).slice(0, 2);
    return [...pick("social-media"), ...pick("sports"), ...pick("music")];
  }, []);

  const stats = useMemo(() => {
    const total = SEED_NOMINEES.length;
    const regions = new Set(SEED_NOMINEES.map((n) => n.nominee_region)).size;
    return {
      total,
      regions: Math.max(regions, REGIONS.length),
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Influencer Education Impact 2026 · NESA-Africa</title>
        <meta
          name="description"
          content="Nominate African social media creators, sports icons, and music icons using their influence to enable Education for All across Africa and the African Diaspora."
        />
      </Helmet>

      <NESAHeader />

      {/* 1. HERO */}
      <section
        aria-label="Influencer Education Impact 2026"
        className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-charcoal via-black to-charcoal pt-24 pb-14"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--gold)/0.12),transparent_70%)]" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3 w-3" /> NESA-Africa 2026
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white md:text-5xl">
            Influencer Education Impact <span className="text-gold">2026</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 md:text-base">
            Nominate African social media creators, sports icons, and music icons
            using their influence to enable{" "}
            <span className="text-gold">Education for All</span> across Africa and
            the African Diaspora.
          </p>
          <p className="mx-auto mt-3 flex max-w-2xl items-start justify-center gap-2 text-xs text-white/60 md:text-sm">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            Recognition is based on verified education impact — not popularity,
            celebrity status, or follower count.
          </p>

          {/* Stats */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard value={String(stats.total)} label="Verified Nominees" />
            <StatCard value="3" label="Recognition Subcategories" />
            <StatCard value="100%" label="Public AGC Participation" />
            <StatCard value={String(stats.regions)} label="Recognition Regions" />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-gold font-semibold text-charcoal hover:bg-gold/90"
              onClick={() => {
                trackEvent("influencer_hero_cta_click", { cta: "nominate" });
                scrollToForm();
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Nominate an Education Enabler
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
              onClick={() =>
                trackEvent("influencer_hero_cta_click", { cta: "view_nominees" })
              }
            >
              <Link to={DIRECTORY_ROUTE}>
                View Existing Nominees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* No public voting notice */}
      <div className="border-b border-gold/15 bg-gold/5 py-3">
        <div className="container mx-auto max-w-4xl px-4 text-center text-xs text-charcoal/80 md:text-sm">
          <strong>There is no public voting for the Influencer Education Impact Award.</strong>{" "}
          Recognition is based on verified impact and governance approval.
        </div>
      </div>

      {/* THREE RECOGNITION SUBCATEGORIES */}
      <section aria-label="Three recognition subcategories" className="border-b border-gold/10 bg-charcoal/95 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <header className="mb-8 text-center">
            <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
              Enablers of Education for All Across Africa
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
              Three Recognition <span className="text-gold">Subcategories</span>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-white/65">
              Each subcategory links to its own directory. Pick the pathway that matches the Education Enabler you want to nominate.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                slug: "social-media",
                title: "African Social Media Influencers",
                body: "Creators, podcasters, bloggers and digital advocates producing education content.",
                href: "/awards/influencers-education-impact/education-content-social-media-influencers",
              },
              {
                slug: "sports",
                title: "African Sports Icons Supporting Education",
                body: "Athletes, academies, coaches and sports leaders funding learning.",
                href: "/awards/influencers-education-impact/african-footballers-supporting-education",
              },
              {
                slug: "music",
                title: "African Music Icons Supporting Education",
                body: "Musicians, performers, producers and music executives backing education.",
                href: "/awards/influencers-education-impact/african-musicians-supporting-education",
              },
            ].map((c) => (
              <div
                key={c.slug}
                className="flex flex-col rounded-2xl border border-gold/20 bg-gradient-to-b from-charcoal-light to-charcoal p-6 hover:border-gold/45 transition-all"
              >
                <h3 className="font-display text-base font-bold text-white">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-white/65">{c.body}</p>
                <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gold/10">
                  <Button asChild size="sm" variant="outline" className="border-gold/30 text-white hover:bg-gold/10 h-8">
                    <Link
                      to={c.href}
                      onClick={() => trackEvent("influencer_subcategory_click", { subcategory: c.slug, action: "view" })}
                    >
                      View Subcategory
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gold text-charcoal hover:bg-gold/90 h-8"
                    onClick={() => {
                      trackEvent("influencer_subcategory_click", { subcategory: c.slug, action: "nominate" });
                      scrollToForm();
                    }}
                  >
                    Nominate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 2. NOMINATION FORM */}
      <section
        id="influencer-nomination-form"
        className="scroll-mt-20 border-b border-gold/10 bg-charcoal py-12 md:py-16"
      >
        <div className="container mx-auto max-w-3xl px-4">
          <header className="mb-6 text-center">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Submit Your <span className="text-gold">Nomination</span>
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Takes about two minutes · No account required
            </p>
          </header>
          <InfluencerNominationForm
            directoryRoute={DIRECTORY_ROUTE}
            onSubmitted={(id) =>
              trackEvent("influencer_form_submitted", { nomination_id: id })
            }
          />
        </div>
      </section>

      {/* 3. WHY THIS RECOGNITION MATTERS */}
      <section className="bg-black/40 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-2xl font-bold text-white md:text-3xl">
            Why This Recognition <span className="text-gold">Matters</span>
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <WhyCard
              icon={GraduationCap}
              title="Fund Scholarships"
              body="Supporting access to learning through scholarships and grants."
            />
            <WhyCard
              icon={School}
              title="Support Schools"
              body="Helping build, renovate, equip, or strengthen learning environments."
            />
            <WhyCard
              icon={Users}
              title="Mentor Young People"
              body="Providing guidance, confidence, skills, and opportunity."
            />
            <WhyCard
              icon={BookOpen}
              title="Create Learning Content"
              body="Using public platforms to make useful knowledge more accessible."
            />
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="border-y border-gold/10 bg-charcoal py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-2xl font-bold text-white md:text-3xl">
            How It <span className="text-gold">Works</span>
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StepCard
              step="1"
              icon={ClipboardCheck}
              title="Nominate"
              body="Submit basic information about the Education Enabler."
            />
            <StepCard
              step="2"
              icon={UserCheck}
              title="NRC Review"
              body="The Nominee Research Corps checks identity, category fit, duplicates, and initial evidence."
            />
            <StepCard
              step="3"
              icon={Vote}
              title="Public Participation"
              body="Approved nominees enter the relevant public AGC participation subcategory."
            />
            <StepCard
              step="4"
              icon={AwardIcon}
              title="Recognition"
              body="Successful nominees receive recognition based on verified education impact and published rules."
            />
          </ol>
        </div>
      </section>

      {/* 5. FEATURED NOMINEES PREVIEW */}
      <section className="bg-black/40 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <header className="text-center">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Meet Some <span className="text-gold">Existing Nominees</span>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-white/65">
              Discover social media creators, sports icons, and music icons using
              their influence to enable Education for All.
            </p>
          </header>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((n) => (
              <NomineeCard key={n.slug} nominee={n} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
              onClick={() =>
                trackEvent("influencer_directory_cta_click", { from: "preview" })
              }
            >
              <Link to={DIRECTORY_ROUTE}>
                View All Existing Nominees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="border-t border-gold/15 bg-gradient-to-br from-gold/10 via-charcoal to-charcoal py-14">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Ready to Recognise an <span className="text-gold">Education Enabler?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            A simple nomination can bring an overlooked education contribution into
            continental view.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-gold font-semibold text-charcoal hover:bg-gold/90"
              onClick={() => {
                trackEvent("influencer_final_cta_click", { cta: "nominate" });
                scrollToForm();
              }}
            >
              Submit a Nomination
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-white/80 hover:bg-white/5 hover:text-gold"
            >
              <Link to={DIRECTORY_ROUTE}>Explore Existing Nominees</Link>
            </Button>
          </div>
        </div>
      </section>

      <NESAFooter />
    </>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-gold/25 bg-white/5 px-3 py-3">
      <div className="font-display text-2xl font-bold leading-none text-gold">
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-white/60">
        {label}
      </div>
    </div>
  );
}

function WhyCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 border border-gold/40">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <h3 className="mt-3 font-display text-base font-bold text-white">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-white/65">{body}</p>
    </div>
  );
}

function StepCard({
  step,
  icon: Icon,
  title,
  body,
}: {
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <li className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
      <span className="absolute -top-3 left-4 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-charcoal">
        Step {step}
      </span>
      <Icon className="h-6 w-6 text-gold" />
      <h3 className="mt-3 font-display text-base font-bold text-white">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-white/65">{body}</p>
    </li>
  );
}
