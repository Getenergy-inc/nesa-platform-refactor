import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Gem, Vote as VoteIcon, Calendar, Users, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

/**
 * Learn More hub for the Gold–Blue Garnet competitive recognition track.
 * Presents the two-phase voting journey:
 *   Phase 1 → Gold Voting (public qualifier)
 *   Phase 2 → Blue Garnet Voting (continental final)
 */
export default function GoldBlueGarnetVoteHub() {
  const phases = [
    {
      id: "gold",
      phase: "Phase 1",
      title: "Gold Voting",
      subtitle: "Public Qualifier · Enablers of Education for All Across Africa",
      window: "Public voting window · Season 2026",
      icon: Trophy,
      accent: "from-amber-500/25 via-amber-400/10 to-transparent",
      badgeClass: "bg-amber-500/20 text-amber-200 border-amber-400/40",
      description:
        "Open public voting across all 18 recognition categories. Every verified voter shapes who advances into the continental Blue Garnet final. One vote per category per verified session.",
      highlights: [
        "Open to the public across all 10 African regions",
        "Unlocks Gold Certificates for top qualifiers",
        "Feeds finalists into Phase 2 Blue Garnet ballot",
      ],
      cta: "Cast Your Gold Vote",
      href: "/vote/gold",
    },
    {
      id: "blue-garnet",
      phase: "Phase 2",
      title: "Blue Garnet Voting",
      subtitle: "Continental Final · Blue Garnet Honour Ballot",
      window: "Final ballot · Continental honourees only",
      icon: Gem,
      accent: "from-sky-500/25 via-indigo-400/10 to-transparent",
      badgeClass: "bg-sky-500/20 text-sky-200 border-sky-400/40",
      description:
        "The decisive continental round. Only Gold Qualifiers appear on the Blue Garnet ballot, judged jointly by the public and the NESA-Africa Jury under the Blue Garnet scoring formula.",
      highlights: [
        "Restricted to verified Gold Qualifiers",
        "Combined Public + Jury weighted score",
        "Winners announced at the 22 October 2026 Gala",
      ],
      cta: "Cast Your Blue Garnet Vote",
      href: "/vote/blue-garnet",
    },
  ] as const;

  return (
    <>
      <Helmet>
        <title>Learn More · Gold–Blue Garnet | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Cast your Gold Vote in Phase 1 and your Blue Garnet Vote in Phase 2 of the NESA-Africa 2026 continental recognition of Enablers of Education for All Across Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-sky-500/10" aria-hidden />
          <div className="container mx-auto px-4 py-14 md:py-20 relative">
            <Breadcrumbs
              items={[
                { label: "Awards", href: "/awards" },
                { label: "Gold–Blue Garnet", href: "/awards/gold-blue-garnet" },
                { label: "Learn More" },
              ]}
            />
            <div className="mt-6 max-w-3xl">
              <Badge className="bg-amber-500/20 text-amber-200 border border-amber-400/40 mb-4">
                <VoteIcon className="w-3.5 h-3.5 mr-1.5" /> NESA-Africa 2026 · Learn More
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
                Gold–Blue Garnet <span className="text-amber-400">Learn More</span>
              </h1>
              <p className="mt-4 text-lg text-white/80">
                A two-phase continental voting journey honouring the{" "}
                <span className="text-amber-300 font-medium">
                  Enablers of Education for All Across Africa
                </span>
                . Phase 1 opens the ballot to the public through Gold Voting; Phase 2 elevates qualifiers into the
                Blue Garnet continental final.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <Calendar className="w-4 h-4 text-amber-300" /> Season 2026
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <Users className="w-4 h-4 text-sky-300" /> 10 African Regions
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" /> One Vote · One Verified Session
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Phase cards */}
        <section className="container mx-auto px-4 py-14">
          <div className="grid gap-6 md:grid-cols-2">
            {phases.map((p) => {
              const Icon = p.icon;
              return (
                <Card
                  key={p.id}
                  className="relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur hover:border-amber-400/40 transition-colors"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} pointer-events-none`} aria-hidden />
                  <CardContent className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                      <Badge className={`border ${p.badgeClass}`}>{p.phase}</Badge>
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
                        <Calendar className="w-3.5 h-3.5" /> {p.window}
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 rounded-xl bg-white/10 p-3 border border-white/10">
                        <Icon className="w-7 h-7 text-amber-300" />
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold">{p.title}</h2>
                        <p className="text-sm text-white/70 mt-1">{p.subtitle}</p>
                      </div>
                    </div>
                    <p className="mt-5 text-white/80 leading-relaxed">{p.description}</p>
                    <ul className="mt-5 space-y-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-white/75">
                          <Sparkles className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Button asChild className="bg-amber-500 hover:bg-amber-600 text-charcoal font-semibold">
                        <Link to={p.href}>
                          {p.cta} <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Link to="/awards/gold-blue-garnet">View Category Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* How the two phases connect */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-amber-300">
              How the Two Phases Connect
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm text-white/80">
              <div>
                <div className="font-semibold text-white mb-1">1 · Gold Public Vote</div>
                All verified voters help determine who qualifies from each category.
              </div>
              <div>
                <div className="font-semibold text-white mb-1">2 · Qualifier Certification</div>
                Top qualifiers receive the Gold Certificate and advance to the final round.
              </div>
              <div>
                <div className="font-semibold text-white mb-1">3 · Blue Garnet Final</div>
                Combined public and jury scoring names the continental Blue Garnet honourees.
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
