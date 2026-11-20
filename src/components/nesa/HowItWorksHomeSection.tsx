import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardCheck, FileSearch, FileText, SearchCheck, Award, Users } from "lucide-react";

const STEPS = [
  { icon: ClipboardCheck, title: "Identify", body: "A person or institution enabling education is identified through a free nomination or authorised research." },
  { icon: SearchCheck, title: "Verify", body: "Identity, contact details, consent and the contribution are checked." },
  { icon: FileText, title: "Document", body: "Dates, locations, outputs, outcomes and supporting evidence are recorded responsibly." },
  { icon: FileSearch, title: "Assess", body: "The NRRC reviews the dossier; eligible Icon dossiers go to independent Icon judges." },
  { icon: Award, title: "Recognise", body: "Only formally approved recognition decisions and materials are published." },
  { icon: Users, title: "Connect", body: "Responsible recognition can connect education enablers with learning, partnerships and practical impact." },
];

export function HowItWorksHomeSection() {
  return (
    <section className="relative py-20 md:py-28 bg-charcoal-light/10" aria-labelledby="how-it-works-heading">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 id="how-it-works-heading" className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">How <span className="text-gold">NESA-Africa</span> Works</h2>
          <p className="text-white/75 text-base md:text-lg">Identify → Verify → Document → Assess → Recognise → Connect. A nomination starts a review; it is not a win.</p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li key={step.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="relative rounded-2xl border border-gold/20 bg-charcoal/60 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center"><Icon className="h-5 w-5 text-gold" /></div>
                  <span className="text-gold/70 text-xs font-bold tracking-wider uppercase">Step {i + 1}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{step.body}</p>
              </motion.li>
            );
          })}
        </ol>
        <div className="mt-12 text-center">
          <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-3 text-gold font-bold hover:bg-gold/10 transition">See the full process<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksHomeSection;
