import { motion } from "framer-motion";
import {
  Quote,
  Sparkles,
  ArrowRight,
  Award,
  Eye,
  Handshake,
  Coins,
  Wrench,
  Crown,
  ShieldCheck,
  GraduationCap,
  Globe2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import cvoImage from "@/assets/cvo-santos.png";

/* -------------------------------------------------------------------------- */
/*  Impact Journey — the strategic framework of NESA-Africa                   */
/* -------------------------------------------------------------------------- */

const impactJourney = [
  { icon: Award, label: "Recognition", caption: "Celebrate changemakers" },
  { icon: Eye, label: "Visibility", caption: "Amplify their stories" },
  { icon: Handshake, label: "Partnerships", caption: "Connect stakeholders" },
  { icon: Coins, label: "Funding", caption: "Mobilise resources" },
  { icon: Wrench, label: "Intervention", caption: "Transform schools" },
  { icon: Crown, label: "Legacy", caption: "Lasting impact" },
];

/* -------------------------------------------------------------------------- */
/*  Ecosystem — how the four arms work together under SCEF                    */
/* -------------------------------------------------------------------------- */

const ecosystem = [
  {
    name: "NESA-Africa",
    role: "Recognises excellence across the continent.",
  },
  {
    name: "EduAid-Africa",
    role: "Scholarships, teacher development, advocacy, access.",
  },
  {
    name: "Rebuild My School Africa",
    role: "Transforms schools and special-needs institutions.",
  },
  {
    name: "NESA-Africa TV",
    role: "Amplifies stories and continental conversations.",
  },
];

/* -------------------------------------------------------------------------- */

export function CVOMessageSection() {
  return (
    <section
      id="cvo-message"
      aria-labelledby="cvo-message-heading"
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Premium charcoal gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal" />
      <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* SDG 4 + AU 2063 accent rails */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5192D] to-transparent opacity-60" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#006B3F] to-transparent opacity-60" />

      <div className="container relative">
        {/* Eyebrow + alignment chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-gold uppercase">
              A Message from the Chief Visionary Officer
            </span>
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5 px-3 py-1.5">
            Vision 2035
          </Badge>
          <Badge variant="outline" className="border-[#C5192D]/50 text-[#C5192D] bg-[#C5192D]/10 px-3 py-1.5">
            SDG 4 Aligned
          </Badge>
          <Badge variant="outline" className="border-[#006B3F]/50 text-[#006B3F] bg-[#006B3F]/10 px-3 py-1.5">
            AU Agenda 2063
          </Badge>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Portrait + Message */}
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start mb-16">
            {/* Portrait card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 flex justify-center lg:sticky lg:top-28"
            >
              <div className="relative group">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-gold/30 via-gold/10 to-gold/30 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-charcoal-light to-charcoal p-1.5 rounded-2xl border border-gold/30">
                  <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-xl overflow-hidden">
                    <img
                      src={cvoImage}
                      alt="Engr. (Dr.) Babashola-Santos V. Aderibigbe — Chief Visionary Officer, Santos Creations Educational Foundation"
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                      <p className="font-display text-lg font-bold text-white leading-tight">
                        Engr. (Dr.) Babashola-Santos
                      </p>
                      <p className="font-display text-lg font-bold text-white leading-tight mb-2">
                        V. Aderibigbe
                      </p>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold text-charcoal text-[11px] font-bold tracking-wide">
                        Chief Visionary Officer
                      </span>
                      <p className="text-white/70 text-xs mt-2">
                        Founder & Steward, SCEF
                      </p>
                    </div>
                  </div>
                </div>
                {/* corner accents */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold/50 rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold/50 rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold/50 rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold/50 rounded-br-lg" />
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3 text-center lg:text-left"
            >
              <h2
                id="cvo-message-heading"
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                Building Africa's Education{" "}
                <span className="text-gold">Future Together</span>
              </h2>

              <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed">
                Education remains the greatest force for transforming lives,
                communities, nations, and the future of our continent.
              </p>

              {/* Pull-quote */}
              <div className="relative mt-8 pl-6 lg:pl-8 border-l-2 border-gold/60">
                <Quote className="absolute -top-3 -left-3 h-6 w-6 text-gold/40 bg-charcoal px-0.5" aria-hidden="true" />
                <blockquote className="text-lg md:text-xl text-white/95 leading-relaxed font-light italic">
                  NESA-Africa is more than an award platform — it is a movement
                  that turns <span className="text-gold not-italic font-medium">recognition</span> into{" "}
                  <span className="text-gold not-italic font-medium">opportunity</span>, opportunity into{" "}
                  <span className="text-gold not-italic font-medium">transformation</span>, and transformation into{" "}
                  <span className="text-gold not-italic font-medium">legacy</span>.
                </blockquote>
              </div>

              {/* Why NESA-Africa was created */}
              <div className="mt-8 space-y-4 text-white/80 leading-relaxed">
                <p>
                  For too long, Africa's educators, innovators, institutions,
                  advocates, philanthropists, policymakers and community leaders
                  have advanced education with little recognition beyond their
                  immediate circles. Yet these are the people shaping the Africa
                  we all desire — one learner, one classroom, one school at a time.
                </p>
                <p>
                  NESA-Africa was created to{" "}
                  <span className="text-white font-medium">
                    identify, celebrate, document, amplify and support
                  </span>{" "}
                  those changemakers. But recognition alone is not enough.
                  That is why NESA-Africa was designed as part of a larger
                  ecosystem under the stewardship of the{" "}
                  <span className="text-gold font-medium">
                    Santos Creations Educational Foundation (SCEF)
                  </span>{" "}
                  — connecting recognition to partnerships, partnerships to
                  resources, and resources to measurable educational impact.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-8 pt-6 border-t border-gold/20 text-left">
                <p className="font-display text-white text-base font-semibold">
                  Engr. (Dr.) Babashola-Santos Vincent Aderibigbe
                </p>
                <p className="text-white/60 text-sm">B.Eng., MBA, CMC</p>
                <p className="text-gold text-sm mt-1">
                  Chief Visionary Officer — Santos Creations Educational Foundation
                </p>
                <p className="text-white/50 text-xs mt-2 italic">
                  Steward of NESA-Africa • EduAid-Africa • Rebuild My School Africa
                </p>
                <p className="text-gold/70 text-xs mt-1 italic">
                  "Advocating &amp; Achieving Education For All In Africa"
                </p>
              </div>
            </motion.div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/*  The Impact Journey                                           */}
          {/* ------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mt-4 mb-16"
            aria-labelledby="impact-journey-heading"
          >
            <div className="text-center mb-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold/70 font-semibold">
                The NESA-Africa Framework
              </p>
              <h3
                id="impact-journey-heading"
                className="font-display text-2xl md:text-3xl text-white mt-2"
              >
                From Recognition to Legacy
              </h3>
              <p className="text-white/60 text-sm md:text-base mt-2 max-w-2xl mx-auto">
                Every nomination flows through six stages — turning visibility
                into resources, and resources into measurable change.
              </p>
            </div>

            <ol
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
              aria-label="NESA-Africa impact journey: Recognition, Visibility, Partnerships, Funding, Intervention, Legacy"
            >
              {impactJourney.map((step, i) => (
                <motion.li
                  key={step.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative group"
                >
                  <div className="relative h-full rounded-xl border border-gold/20 bg-gradient-to-br from-charcoal-light/70 to-charcoal/70 backdrop-blur-sm p-4 text-center transition-all duration-300 group-hover:border-gold/50 group-hover:-translate-y-1">
                    <div className="mx-auto w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center mb-2">
                      <step.icon className="h-5 w-5 text-gold" aria-hidden="true" />
                    </div>
                    <p className="text-[10px] text-gold/70 font-semibold tracking-wider">
                      STEP {i + 1}
                    </p>
                    <p className="font-display text-white font-semibold text-sm md:text-base mt-1">
                      {step.label}
                    </p>
                    <p className="text-white/55 text-xs mt-1 leading-snug">
                      {step.caption}
                    </p>
                  </div>
                  {/* connector arrow (desktop only, not on last) */}
                  {i < impactJourney.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="hidden lg:block absolute top-1/2 -right-2.5 -translate-y-1/2 h-4 w-4 text-gold/40"
                    />
                  )}
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* ------------------------------------------------------------- */}
          {/*  Ecosystem grid                                               */}
          {/* ------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-16"
            aria-labelledby="ecosystem-heading"
          >
            <div className="text-center mb-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold/70 font-semibold">
                One Stewardship · Four Arms
              </p>
              <h3
                id="ecosystem-heading"
                className="font-display text-2xl md:text-3xl text-white mt-2"
              >
                The SCEF Ecosystem
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ecosystem.map((arm) => (
                <div
                  key={arm.name}
                  className="rounded-xl border border-gold/20 bg-charcoal-light/40 backdrop-blur-sm p-5 hover:border-gold/50 transition-colors"
                >
                  <p className="font-display text-gold text-base font-semibold">
                    {arm.name}
                  </p>
                  <p className="text-white/70 text-sm mt-2 leading-relaxed">
                    {arm.role}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ------------------------------------------------------------- */}
          {/*  Continental Vision strip                                     */}
          {/* ------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-charcoal-light via-charcoal to-charcoal-light p-6 md:p-10 mb-16"
          >
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-gold/10 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Globe2 className="h-7 w-7 text-gold mx-auto mb-2" aria-hidden="true" />
                <p className="font-display text-2xl text-white font-bold">One Continent</p>
                <p className="text-white/60 text-sm mt-1">
                  Africa, its diaspora, and friends of Africa
                </p>
              </div>
              <div>
                <Sparkles className="h-7 w-7 text-gold mx-auto mb-2" aria-hidden="true" />
                <p className="font-display text-2xl text-white font-bold">
                  Ten Education Regions
                </p>
                <p className="text-white/60 text-sm mt-1">
                  A pan-African map of changemakers
                </p>
              </div>
              <div>
                <GraduationCap className="h-7 w-7 text-gold mx-auto mb-2" aria-hidden="true" />
                <p className="font-display text-2xl text-white font-bold">One Mission</p>
                <p className="text-white/60 text-sm mt-1">
                  Building Africa's education future
                </p>
              </div>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------- */}
          {/*  Trust strip                                                  */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10 text-xs sm:text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              Governance &amp; Integrity Framework
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="inline-flex items-center gap-2">
              <Heart className="h-4 w-4 text-gold" aria-hidden="true" />
              Education for All
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gold" aria-hidden="true" />
              SDG 4 &amp; AU 2063 Aligned
            </span>
          </div>

          {/* ------------------------------------------------------------- */}
          {/*  Call to action — three primary actions only                  */}
          {/* ------------------------------------------------------------- */}
          <div className="text-center">
            <h3 className="font-display text-2xl md:text-3xl text-white">
              Be part of the movement
            </h3>
            <p className="text-white/60 text-sm md:text-base mt-2 max-w-xl mx-auto">
              Nominate. Sponsor. Join. Three ways to help turn recognition into
              real educational impact across Africa.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-charcoal hover:bg-gold-light font-semibold gap-2 group"
              >
                <Link to="/nominate">
                  Nominate for 2026
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 font-semibold"
              >
                <Link to="/sponsor">Become a Sponsor</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-white hover:text-gold hover:bg-gold/10 font-semibold"
              >
                <Link to="/get-involved">Join the Movement</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CVOMessageSection;
