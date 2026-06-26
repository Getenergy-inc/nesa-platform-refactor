import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardCheck, ShieldCheck, ListOrdered, Vote, Award, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Nominate",
    body: "Nominate a person, organisation, company, institution, funder, innovator, diaspora network, media voice, or education advocate creating real impact.",
  },
  {
    icon: ShieldCheck,
    title: "Review",
    body: "Nominations are reviewed for category fit, evidence, credibility, relevance, and education impact.",
  },
  {
    icon: ListOrdered,
    title: "Shortlist",
    body: "Qualified nominees are shortlisted and prepared for public visibility.",
  },
  {
    icon: Vote,
    title: "Vote and Support",
    body: "Where applicable, public voting and community engagement help amplify credible education impact stories.",
  },
  {
    icon: Award,
    title: "Recognise",
    body: "Honourees receive awards, certificates, media visibility, public recognition, and continental credibility.",
  },
  {
    icon: Sparkles,
    title: "Create Impact",
    body: "Recognition connects changemakers to sponsors, media, funders, volunteers, school support, scholarships, webinars, and Rebuild My School Africa interventions.",
  },
];

export function HowItWorksHomeSection() {
  return (
    <section className="relative py-20 md:py-28 bg-charcoal-light/10" aria-labelledby="how-it-works-heading">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            id="how-it-works-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            How <span className="text-gold">NESA-Africa</span> Works
          </h2>
          <p className="text-white/75 text-base md:text-lg">
            From a single nomination to continental recognition and real education impact — six clear steps.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative rounded-2xl border border-gold/20 bg-charcoal/60 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <span className="text-gold/70 text-xs font-bold tracking-wider uppercase">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{s.body}</p>
              </motion.li>
            );
          })}
        </ol>

        <div className="mt-12 text-center">
          <Link
            to="/nominate"
            onClick={() =>
              trackEvent("home_cta_click", {
                cta: "start_nomination",
                to: "/nominate",
                section: "how_it_works",
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-charcoal font-bold hover:bg-gold-dark transition"
          >
            Start a Nomination
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksHomeSection;
