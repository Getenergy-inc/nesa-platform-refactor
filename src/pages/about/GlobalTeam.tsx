// Meet Our Global Team — the people layer of NESA-Africa 2026.
// Governance bodies, the volunteer/ambassador network, chapters and how to join.
// Purely a navigational + narrative hub: every group links to its existing page.

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Users,
  ShieldCheck,
  Gavel,
  Globe2,
  HeartHandshake,
  Megaphone,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_STATS } from "@/config/siteStats";

interface TeamGroup {
  icon: typeof Users;
  eyebrow: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
  meta?: string;
}

const GOVERNANCE: TeamGroup[] = [
  {
    icon: ShieldCheck,
    eyebrow: "Board",
    title: "SCEF Board of Advisors",
    blurb:
      "NESA-Africa operates under the Santos Creations Educational Foundation's Board of Advisors, with confirmed civil-society representation and signed Conflict of Interest declarations.",
    href: "/governance",
    cta: "Governance & integrity",
  },
  {
    icon: Users,
    eyebrow: "Verification",
    title: "Nominee Research Corps (NRC)",
    blurb:
      "Independent researchers who verify every submission — evidence checks, duplicate detection and Education Development Index scoring before any file reaches a judge.",
    href: "/about/nrc",
    cta: "About the NRC",
  },
  {
    icon: Gavel,
    eyebrow: "Adjudication",
    title: "Independent Judges",
    blurb:
      "A firewalled jury of education leaders, academics and practitioners. Judges never see nominator identities, and Icon-tier decisions sit with a dedicated 27-judge panel.",
    href: "/judges",
    cta: "Meet our judges",
  },
];

const NETWORK: TeamGroup[] = [
  {
    icon: HeartHandshake,
    eyebrow: "People",
    title: "Volunteers",
    blurb:
      "Researchers, translators, designers, community organisers and event crew who make each recognition cycle possible across the continent.",
    href: "/volunteers",
    cta: "Volunteer network",
  },
  {
    icon: Megaphone,
    eyebrow: "Advocacy",
    title: "Ambassadors",
    blurb:
      "Regional and diaspora ambassadors who surface enablers, host briefings and carry the Education for All message into their own communities.",
    href: "/ambassadors",
    cta: "Ambassador programme",
  },
  {
    icon: Globe2,
    eyebrow: "Chapters",
    title: "Local Chapters",
    blurb:
      "Country and city chapters coordinating nominations, verification support and gala delegations on the ground.",
    href: "/chapters",
    cta: "Find a chapter",
  },
  {
    icon: Briefcase,
    eyebrow: "Openings",
    title: "Standing Roles & Vacancies",
    blurb:
      "Open volunteer roles across research, communications, partnerships, technology and events — with clear scopes and time commitments.",
    href: "/vacancies",
    cta: "See open roles",
  },
];

function GroupCard({ group }: { group: TeamGroup }) {
  const Icon = group.icon;
  return (
    <article className="group rounded-xl border border-gold/20 bg-charcoal/60 p-6 transition-colors hover:border-gold/50">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold/70">
          {group.eyebrow}
        </span>
      </div>
      <h3 className="mt-4 font-playfair text-xl font-bold text-white">{group.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{group.blurb}</p>
      <Link
        to={group.href}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
      >
        {group.cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function GlobalTeam() {
  const regions = SITE_STATS?.regionsTotal ?? 15;

  return (
    <>
      <Helmet>
        <title>Meet Our Global Team | NESA-Africa 2026</title>
        <meta
          name="description"
          content="The people behind NESA-Africa 2026 — the SCEF Board of Advisors, Nominee Research Corps, independent judges, volunteers, ambassadors and local chapters across Africa and the diaspora."
        />
        <link rel="canonical" href="https://nesa.africa/about/team" />
      </Helmet>

      <div className="bg-charcoal">
        {/* Hero */}
        <section className="border-b border-gold/15 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold/80">
              About NESA-Africa
            </p>
            <h1 className="mt-4 max-w-3xl font-playfair text-4xl font-bold leading-tight text-white lg:text-5xl">
              Meet Our <span className="text-gold">Global Team</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/75">
              NESA-Africa is run by volunteers, researchers and independent adjudicators — not a
              secretariat. Every group below is separated by design so that recognition stays
              earned, evidenced and defensible.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-white/55">
              Recognising the Enablers of Education for All Across Africa — across {regions} regions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 font-semibold">
                <Link to="/vacancies">Join the team</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold/60 text-gold hover:bg-gold/10 hover:text-gold"
              >
                <Link to="/governance">How governance works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Governance bodies */}
        <section className="py-14 lg:py-20" aria-labelledby="team-governance">
          <div className="container mx-auto px-4">
            <h2 id="team-governance" className="font-playfair text-2xl font-bold text-white lg:text-3xl">
              Governance & Adjudication
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              Three independent bodies, firewalled from one another. No single group can nominate,
              verify and decide.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {GOVERNANCE.map((g) => (
                <GroupCard key={g.href} group={g} />
              ))}
            </div>
          </div>
        </section>

        {/* Global network */}
        <section className="border-t border-gold/15 py-14 lg:py-20" aria-labelledby="team-network">
          <div className="container mx-auto px-4">
            <h2 id="team-network" className="font-playfair text-2xl font-bold text-white lg:text-3xl">
              The Global Network
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              Volunteers, ambassadors and chapters carrying the work across Africa and the diaspora.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {NETWORK.map((g) => (
                <GroupCard key={g.href} group={g} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gold/15 py-14 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-8 lg:p-12">
              <h2 className="font-playfair text-2xl font-bold text-white lg:text-3xl">
                There is a role here for you
              </h2>
              <p className="mt-3 max-w-2xl text-white/70">
                Whether you have two hours a week or two days a month, the 2026 cycle needs
                researchers, translators, regional coordinators and event volunteers.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 font-semibold">
                  <Link to="/vacancies">Browse standing roles</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gold/60 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Link to="/chapters">Join a local chapter</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gold/60 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Link to="/judges/apply">Recommend a judge</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
