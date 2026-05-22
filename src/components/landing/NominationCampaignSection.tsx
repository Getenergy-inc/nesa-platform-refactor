import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Coins,
  LayoutGrid,
  Users,
  HelpCircle,
  Megaphone,
  GraduationCap,
  School,
  Heart,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Conversion-focused nomination campaign section.
 * Slotted directly under the hero on the landing page. Keeps the existing
 * NESA-Africa charcoal + gold visual language. All CTAs link to live routes
 * (see App.tsx). If a route is renamed later, update the `to=` props below.
 */
export function NominationCampaignSection() {
  // NOTE: All CTAs route to existing pages. Do not replace with `#` placeholders.
  const ctas = [
    { label: "Nominate a Changemaker", to: "/nominate", primary: true, icon: Trophy },
    { label: "Earn AGC Voting Points", to: "/earn-agc", primary: true, icon: Coins },
    { label: "View Award Categories", to: "/categories", icon: LayoutGrid },
    { label: "Meet the Nominees", to: "/nominees", icon: Users },
    { label: "How AGC Voting Works", to: "/guidelines/voters", icon: HelpCircle },
  ];

  const heroVoices = [
    { icon: GraduationCap, label: "A mentor" },
    { icon: School, label: "A school founder" },
    { icon: Megaphone, label: "An NGO leader" },
    { icon: Users, label: "A youth advocate" },
    { icon: Heart, label: "A philanthropist / CSR leader" },
    { icon: Globe2, label: "A diaspora supporter / Friend of Africa" },
  ];

  const hooks = [
    "Don't just clap for education changemakers. Nominate them.",
    "Your mentor. Your school founder. Your NGO leader. Your innovator.",
    "Africa's education impact heroes deserve to be seen.",
    "Do you know someone changing education in Africa?",
    "From classrooms to communities, changemakers are everywhere.",
  ];

  return (
    <section
      id="nominate-a-champion"
      aria-labelledby="nominate-a-champion-heading"
      className="relative overflow-hidden bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal py-14 sm:py-20"
    >
      {/* ambient gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Badge
            variant="outline"
            className="border-gold/40 bg-gold/10 px-4 py-1.5 text-gold uppercase tracking-[0.18em] text-xs"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Nominations Open · NESA-Africa 2025/26
          </Badge>
        </motion.div>

        {/* ── Main headline */}
        <motion.h2
          id="nominate-a-champion-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-5 text-center font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-ivory"
        >
          Don't Just Clap for{" "}
          <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
            Education Changemakers
          </span>
          . Nominate Them.
        </motion.h2>

        {/* ── Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-center text-base sm:text-lg text-gold/90 max-w-3xl mx-auto"
        >
          Your mentor. Your school founder. Your NGO leader. Your innovator.
          Your education impact hero.
        </motion.p>

        {/* ── Body */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,1fr] items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4 text-ivory/80 text-[15px] sm:text-base leading-relaxed"
          >
            <p>
              Across Africa and the diaspora, changemakers are transforming
              education through advocacy, innovation, funding, infrastructure,
              mentorship, technology, policy, community action, and social
              impact. <span className="text-ivory">Now is the time to recognise them.</span>
            </p>
            <p>
              <span className="text-gold">NESA-Africa</span> gives the public a
              platform to recognise, celebrate, and amplify the people and
              institutions advancing education across Africa — whether they are
              Africans in Africa, Africans in the diaspora, or Friends of Africa
              supporting education development.
            </p>

            {/* Banner line */}
            <div className="mt-2 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 sm:px-5 sm:py-4">
              <p className="font-display text-lg sm:text-xl font-semibold text-gold">
                Nominate. Earn AGC. Celebrate Education Impact.
              </p>
              <p className="mt-1 text-sm text-ivory/70">
                Nominate a changemaker today and earn AGC voting points to
                support your favourite nominees when voting opens.
              </p>
            </div>
          </motion.div>

          {/* ── Social-media crowd reaction block */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-gold/20 bg-charcoal/70 p-5 sm:p-6 backdrop-blur"
            aria-label="Africa, who is your education changemaker?"
          >
            <div className="flex items-center gap-2 text-gold">
              <Megaphone className="h-5 w-5" />
              <span className="font-display text-lg sm:text-xl font-semibold">
                Africa, Who Is Your Education Changemaker?
              </span>
            </div>
            <p className="mt-2 text-sm text-ivory/70">
              Do you know someone changing education in Africa?
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {heroVoices.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-gold/10 bg-charcoal-light/60 px-2.5 py-2 text-ivory/80"
                >
                  <Icon className="h-4 w-4 text-gold/80 shrink-0" />
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm text-ivory/70">
              From classrooms to communities, education changemakers are
              everywhere.{" "}
              <span className="text-gold">Nominate a Changemaker Now</span> and
              earn AGC voting points to support real education impact across
              Africa and the diaspora.
            </p>
          </motion.aside>
        </div>

        {/* ── CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {ctas.map(({ label, to, primary, icon: Icon }) => (
            <Button
              key={label}
              asChild
              size="lg"
              variant={primary ? "default" : "outline"}
              className={
                primary
                  ? "bg-gold text-charcoal hover:bg-gold/90 shadow-lg shadow-gold/20"
                  : "border-gold/40 text-gold hover:bg-gold/10"
              }
            >
              <Link to={to}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </motion.div>

        {/* ── Punchy hook lines */}
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-2"
          aria-label="Why nominate"
        >
          {hooks.map((line) => (
            <li key={line}>
              <span className="inline-block rounded-full border border-gold/20 bg-charcoal-light/70 px-3.5 py-1.5 text-xs sm:text-sm text-ivory/80 hover:border-gold/40 hover:text-gold transition-colors">
                {line}
              </span>
            </li>
          ))}
        </motion.ul>

        {/* ── Final statement */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light/80 to-charcoal/80 p-6 sm:p-8 text-center"
        >
          <p className="font-display text-lg sm:text-xl text-ivory">
            NESA-Africa is not just an award.
          </p>
          <p className="mt-2 text-sm sm:text-base text-ivory/70 max-w-3xl mx-auto">
            It is a public movement to recognize, celebrate and amplify the
            people building the future of education in Africa.
          </p>
          <p className="mt-4 font-display text-base sm:text-lg text-gold">
            Start today: nominate a champion and earn your free voting points.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/nominate">
                <Trophy className="mr-2 h-4 w-4" />
                Nominate a Champion
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/earn-agc">
                <Coins className="mr-2 h-4 w-4" />
                Earn Voting Points
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default NominationCampaignSection;
