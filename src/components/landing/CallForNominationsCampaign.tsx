// Complementary campaign block supporting the call for nominations.
// Sits directly after NominationCampaignSection. Does not replace any existing content.
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
  Coins,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const personas = [
  { icon: GraduationCap, label: "Teacher" },
  { icon: School, label: "School Founder" },
  { icon: HeartHandshake, label: "NGO Leader" },
  { icon: Sparkles, label: "Youth Mentor" },
  { icon: Users, label: "Diaspora Supporter" },
  { icon: Globe2, label: "Friend of Africa" },
];

const steps = [
  { n: "01", title: "Know an education champion?", desc: "Spot the changemakers shaping African education innovation." },
  { n: "02", title: "Nominate them on NESA-Africa", desc: "Submit a nomination for education impact champions in minutes." },
  { n: "03", title: "Earn free voting points", desc: "Every nomination rewards you with AGC voting points." },
  { n: "04", title: "Support your favorites", desc: "Use your points when voting opens to back education social impact." },
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Trophy className="h-3.5 w-3.5" /> African Education Awards
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white md:text-5xl">
            Nominate. Earn Voting Points.{" "}
            <span className="bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
              Celebrate Education Impact.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Do you know a teacher, school founder, NGO leader, youth mentor, innovator, diaspora
            supporter, or friend of Africa changing education? Nominate them today on NESA-Africa
            and earn free voting points to support your favorite nominees when voting opens.
          </p>
        </motion.div>

        {/* Visual block — video placeholder + graphic flow */}
        <div className="mt-12 grid gap-6 md:gap-8 lg:grid-cols-5">
          {/* Video placeholder card */}
          {/* TODO: Replace placeholder with final NESA-Africa call-for-nominations video. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-charcoal to-black shadow-[0_20px_60px_-20px_rgba(201,162,39,0.4)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-charcoal shadow-2xl transition-transform group-hover:scale-110">
                  <Play className="h-9 w-9 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-sm font-medium text-white">
                  Watch how to nominate an education champion and earn voting points.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-center lg:justify-start">
              <Button asChild size="lg" variant="glow" className="font-bold">
                {/* TODO: confirm route — currently using existing /nominate */}
                <Link to="/nominate">
                  Nominate a Champion Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Graphic flow card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="grid h-full grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 md:p-6">
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  className="rounded-xl border border-primary/15 bg-charcoal/60 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 font-display text-sm font-bold text-primary">
                      {s.n}
                    </span>
                    <h3 className="text-sm font-semibold text-white md:text-base">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/65 md:text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Personas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Who can you nominate?
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {personas.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-4 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-[11px] font-medium leading-tight text-white/80 sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
        >
          {/* Primary CTA → existing /nominate route */}
          <Button asChild size="lg" variant="glow" className="w-full font-bold sm:w-auto">
            <Link to="/nominate">
              <Trophy className="h-4 w-4" /> Nominate a Champion Now
            </Link>
          </Button>
          {/* Voting points → existing /earn-voting-credits route */}
          <Button asChild size="lg" variant="outline" className="w-full border-primary/40 bg-transparent text-primary hover:bg-primary/10 hover:text-primary sm:w-auto">
            <Link to="/earn-voting-credits">
              <Coins className="h-4 w-4" /> How Voting Points Work
            </Link>
          </Button>
          {/* Categories → existing /categories route */}
          <Button asChild size="lg" variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto">
            <Link to="/categories">
              <Vote className="h-4 w-4" /> View Award Categories
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default CallForNominationsCampaign;
