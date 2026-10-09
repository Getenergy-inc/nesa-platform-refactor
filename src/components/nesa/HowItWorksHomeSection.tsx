import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardCheck, UserCheck, FileText, ShieldCheck, Award } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Nominate",
    body: "Submit an eligible individual, organisation, institution, programme or public body under the correct category and subcategory.",
  },
  {
    icon: UserCheck,
    title: "Accept and Complete",
    body: "The nominee receives a secure invitation to accept the nomination and complete the required profile.",
  },
  {
    icon: FileText,
    title: "Provide Evidence",
    body: "The nominee and nominator submit impact records, references, documents, media and other supporting evidence.",
  },
  {
    icon: ShieldCheck,
    title: "Verify and Review",
    body: "The NRC verifies identity, category fit, geography, evidence and integrity. Verified Icon profiles go to the Icon Jury. Other tiers proceed to governance approval.",
  },
  {
    icon: Award,
    title: "Recognise and Connect",
    body: "Approved Education Enablers receive verified profiles, certificates, media visibility and opportunities for partnerships and post-recognition impact.",
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
            From nomination to verified recognition and lasting education impact — five clear steps.
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
