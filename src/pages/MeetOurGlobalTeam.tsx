// Meet Our Global Volunteer Team — the people behind NESA-Africa.
// Live counts come from useGlobalTeamStats (volunteers + judges + NRC + chapters).

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Users,
  Globe2,
  MapPin,
  ShieldCheck,
  Gavel,
  Megaphone,
  Crown,
  Settings2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGlobalTeamStats, formatStat } from "@/hooks/useGlobalTeamStats";
import { TeamCollageHero } from "@/components/team/TeamCollageHero";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function MeetOurGlobalTeam() {
  const stats = useGlobalTeamStats();

  const counters = [
    { icon: Users, value: stats.people, label: "Volunteers, Judges & NRC Members" },
    { icon: Globe2, value: stats.countries, label: "Countries" },
    { icon: MapPin, value: stats.activeChapters, label: "Active Local Chapters" },
  ];

  const groups = [
    {
      icon: ShieldCheck,
      title: "Nominee Research Corps (NRC)",
      blurb:
        "Verifying every nomination against evidence standards before it ever reaches a judge, across all four recognition tiers.",
      href: "/nrc",
    },
    {
      icon: Gavel,
      title: "Judges Arena",
      blurb: `${
        stats.judges !== null && stats.judges > 0 ? stats.judges : "Independent"
      } independent judges reviewing NRC-verified nominees and selecting the nine Africa Education Icon laureates.`,
      href: "/judges",
    },
    {
      icon: Crown,
      title: "Local Chapter Presidents",
      blurb:
        "Representing NESA-Africa on the ground in their countries, building community and surfacing the education enablers closest to home.",
      href: "/chapters",
    },
    {
      icon: Megaphone,
      title: "Content & Media Volunteers",
      blurb:
        "Social media ambassadors, webinar and podcast presenters, TV correspondents, and website contributors carrying the movement's story to every region and the diaspora.",
      href: "/vacancies",
    },
    {
      icon: Settings2,
      title: "Governance & Operations",
      blurb:
        "The technical, communications, and compliance volunteers keeping the platform trustworthy, transparent, and running.",
      href: "/governance",
    },
  ];

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Helmet>
        <title>Meet Our Global Volunteer Team | NESA-Africa</title>
        <meta
          name="description"
          content="NESA-Africa is built by a continent-spanning team of volunteers, judges and researchers verifying and recognising Africa's education enablers."
        />
      </Helmet>

      <TeamCollageHero />

      {/* By the Numbers */}
      <section className="px-4 py-16 bg-black/40">
        <div className="container mx-auto max-w-5xl">
          <motion.h2 {...fadeUp} className="font-playfair text-2xl md:text-3xl text-gold text-center mb-8">
            By the Numbers
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {counters.map((c) => (
              <motion.div key={c.label} {...fadeUp}>
                <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6 text-center hover:border-gold/50 transition">
                  <c.icon className="h-6 w-6 text-gold mx-auto mb-2" />
                  <div className="font-playfair text-4xl text-gold font-bold">
                    {formatStat(c.value)}
                  </div>
                  <div className="text-xs text-white/60 mt-2 uppercase tracking-wider">
                    {c.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/60 text-sm mt-6 max-w-2xl mx-auto">
            Real people, real hours, real impact — building toward the NESA-Africa 2026
            Recognition Gala on 13 December in Lagos.
          </p>
        </div>
      </section>

      {/* Who Makes Up the Team */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <motion.h2 {...fadeUp} className="font-playfair text-2xl md:text-3xl text-gold text-center mb-10">
            Who Makes Up the Team
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map((g) => (
              <motion.div key={g.title} {...fadeUp}>
                <Card className="h-full border-gold/20 bg-white/5 p-6 hover:border-gold/50 transition backdrop-blur">
                  <g.icon className="h-6 w-6 text-gold mb-3" />
                  <h3 className="font-playfair text-xl text-gold mb-2">{g.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{g.blurb}</p>
                  <Link
                    to={g.href}
                    className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
                  >
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="px-4 py-16 bg-black/40">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-playfair text-2xl md:text-3xl text-gold mb-5">Why It Works</h2>
            <p className="text-white/70 leading-relaxed">
              Recognition here isn't decided by a machine, a sponsor, or a popularity contest.
              It's decided by people — volunteers who research, verify, and judge every single
              nomination against published evidence criteria. Sponsorship, partnerships, and
              donations never influence who gets recognized.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Join Them */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-playfair text-2xl md:text-3xl text-gold mb-5">Join Them</h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Whether you're a content creator, a developer, a researcher, or simply someone who
              believes African educators deserve the spotlight — there's a place for you on this
              team.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to="/vacancies">
                  Explore Volunteer Roles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10"
              >
                <Link to="/volunteers">
                  Browse the Volunteer Directory <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
