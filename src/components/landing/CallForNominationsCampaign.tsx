// Complementary campaign block supporting the call for nominations.
// Sits directly after NominationCampaignSection. Does not replace any existing content.
// Refactored: two-column desktop / stacked mobile, premium gold/black NESA-Africa styling.
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  School,
  HeartHandshake,
  Sparkles,
  Globe2,
  Users,
  Play,
  ArrowRight,
  Trophy,
  ShieldCheck,
  ClipboardList,
  Share2,
  Star,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const personas = [
  { icon: GraduationCap, label: "Mentor" },
  { icon: School, label: "School Founder" },
  { icon: HeartHandshake, label: "NGO Leader" },
  { icon: Sparkles, label: "Innovator" },
  { icon: Users, label: "Diaspora Supporter" },
  { icon: Globe2, label: "Friend of Africa" },
];

const journey = [
  { n: "1", title: "Nominate a Changemaker", desc: "Submit an education impact leader, organisation, or initiative in minutes.", icon: Trophy },
  { n: "2", title: "Independent Verification", desc: "Every submission is reviewed by the NRC and scored against the EDI Matrix — no fees, no shortcuts.", icon: ShieldCheck },
  { n: "3", title: "Share the Movement", desc: "Invite your community, school network, organisation, or diaspora network to participate.", icon: Share2 },
  { n: "4", title: "Track Your Nomination", desc: "Follow verification status and celebrate when your nominee advances through the recognition pathway.", icon: Star },
];

export function CallForNominationsCampaign() {
  return (
    <section
      id="nomination-campaign-support"
      className="relative overflow-hidden bg-gradient-to-b from-charcoal via-charcoal to-black py-16 md:py-24"
    >
      {/* Subtle gold accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative px-4 md:px-6">
        {/* Two-column layout: copy left, visual card right */}
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT — Conversion copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Megaphone className="h-3.5 w-3.5" /> Your Campaign Journey
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              4 Simple Steps to{" "}
              <span className="bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
                Celebrate Impact
              </span>
            </h2>
            <p className="mt-4 text-lg font-medium text-primary/90 md:text-xl">
              Nominate. Earn AGC. Share. Support your favourite nominees.
            </p>
            <p className="mt-5 text-base leading-relaxed text-white/75 md:text-lg">
              Education impact lives everywhere — in NGOs and foundations,
              school leadership, youth empowerment, education technology, CSR
              initiatives, diaspora education support, faith-based impact, media
              advocacy, research and innovation, and the arts, sports, music,
              and culture advancing education across Africa and the diaspora.
            </p>

            {/* Persona badges */}
            <div className="mt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Who can you nominate?
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
                {personas.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-medium leading-tight text-white/80 sm:text-xs">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust / crowd-reaction line */}
            <p className="mt-6 border-l-2 border-primary/60 pl-4 text-left text-sm italic text-white/70 md:text-base">
              Africa, who is your education changemaker? Don't just clap for
              education impact heroes —
              <span className="font-semibold text-primary"> nominate them.</span>
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
              <Button asChild size="lg" variant="glow" className="font-bold">
                <Link to="/nominate">
                  <Trophy className="h-4 w-4" /> Start a Nomination
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 bg-transparent text-primary hover:bg-primary/10 hover:text-primary">
                <Link to="/earn-voting-credits">
                  <Coins className="h-4 w-4" /> How AGC Voting Works
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link to="/categories">
                  <Vote className="h-4 w-4" /> View Award Categories
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* RIGHT — Premium visual card: journey + video placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-charcoal/80 to-black p-5 shadow-[0_25px_70px_-25px_rgba(201,162,39,0.45)] md:p-7">
              <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-inset ring-primary/20" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/90">
                Education Impact Lives Everywhere
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
                From Classrooms to Continental Movements
              </h3>

              {/* Journey steps */}
              <ol className="mt-6 space-y-3">
                {journey.map(({ n, title, desc, icon: Icon }) => (
                  <li
                    key={n}
                    className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-primary/40 hover:bg-primary/[0.06]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-yellow-500 font-display text-base font-bold text-charcoal shadow-md">
                      {n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-semibold text-white md:text-base">{title}</h4>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-white/65 md:text-sm">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Video placeholder */}
              <div className="group relative mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-charcoal to-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-charcoal shadow-2xl transition-transform group-hover:scale-110">
                    <Play className="h-7 w-7 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                  <p className="text-xs font-medium text-white md:text-sm">
                    Watch how to nominate a changemaker and earn AGC voting points.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Campaign-ready closing message */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-center">
            <ArrowRight className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-white md:text-base">
              Nominate. <span className="text-primary">Earn AGC.</span> Celebrate Education Impact.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CallForNominationsCampaign;
