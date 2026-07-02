// Call for Nominations — NESA-Africa 2026 Multi-Category Surface
// Premium homepage surface aligned with NESA-Africa charcoal + gold identity.
// Combines: CSR, EdTech & STEM, Influencers, Platinum Institutional, and Africa Education Icon Award.
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  HandCoins,
  BookOpenText,
  Wrench,
  Globe2,
  Users,
  Heart,
  Trophy,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  Cpu,
  Smartphone,
  Medal,
  Music,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";

/* ──────────────── ICON AWARD (Lifetime 2006–2026) ──────────────── */
const iconCategories = [
  {
    icon: HandCoins,
    tag: "LIFETIME ACHIEVEMENT 2006–2026",
    title: "Africa Education Philanthropy Icon",
    body:
      "Enablers of Education for All Across Africa who turned wealth into hope — building schools, funding thousands of scholarships, and changing entire systems.",
    nominateLink: "/nominate?award=africa-education-icon&subcategory=philanthropy",
    learnMoreLink: "/awards/africa-education-icon",
  },
  {
    icon: BookOpenText,
    tag: "LIFETIME ACHIEVEMENT 2006–2026",
    title: "Literary & New Curriculum Advocate Icon",
    body:
      "Enablers of Education for All Across Africa who reshaped learning and identity — decolonising curricula and championing African stories and indigenous knowledge.",
    nominateLink: "/nominate?award=africa-education-icon&subcategory=literary-curriculum",
    learnMoreLink: "/awards/africa-education-icon",
  },
  {
    icon: Wrench,
    tag: "LIFETIME ACHIEVEMENT 2006–2026",
    title: "Africa Technical Educator Icon",
    body:
      "Enablers of Education for All Across Africa who taught the continent to build, code, innovate and lead through technical and digital skills.",
    nominateLink: "/nominate?award=africa-education-icon&subcategory=technical-educator",
    learnMoreLink: "/awards/africa-education-icon",
  },
];

/* ──────────────── BLUE GARNET: CSR & EDTECH ──────────────── */
const corporateCategories = [
  {
    icon: HeartHandshake,
    title: "Best CSR for Education in Africa",
    subtitle: "Blue Garnet Award 2026",
    body:
      "Companies changing classrooms across Africa! Your CSR programme is building schools, funding scholarships, training teachers, or providing digital learning tools. This is your moment to be recognised continent-wide. Whether you are a bank, telco, oil & gas, manufacturing, or FMCG company — if you are investing in education, we want to celebrate you.",
    nominateLink: "/nominate?award=csr-education-africa",
    learnMoreLink: "/awards/blue-garnet-categories/csr-education-africa",
    eventLabel: "Nominate CSR",
  },
  {
    icon: Cpu,
    title: "Best EdTech & STEM Innovation for Education",
    subtitle: "Blue Garnet Award 2026",
    body:
      "The future of African education is digital. If your platform, app, coding academy, STEM programme, or EdTech solution is transforming how African children and youth learn — this award is for you. From rural classrooms to urban innovation hubs, we are looking for the boldest EdTech and STEM initiatives making real impact.",
    nominateLink: "/nominate?award=edutech-africa",
    learnMoreLink: "/awards/blue-garnet-categories/edutech-africa",
    eventLabel: "Nominate EdTech",
  },
];


/* ──────────────── INFLUENCERS (Certificate of Recognition 2026) ──────────────── */
const influencerCategories = [
  {
    icon: Smartphone,
    tag: "CERTIFICATE OF RECOGNITION 2026",
    title: "Best Social Media Influencer Education Enablers",
    body:
      "Enablers of Education for All Across Africa — Digital creators advancing learning through social media platforms.",
    nominateLink: "/nominate?award=influencers-education-impact&subcategory=social-media",
    learnMoreLink: "/awards/influencers-education-impact/social-media",
  },
  {
    icon: Medal,
    tag: "CERTIFICATE OF RECOGNITION 2026",
    title: "Best Africa Sports Icon Education Enablers",
    body:
      "Enablers of Education for All Across Africa — Athletes using their platforms for scholarships, school-building, and youth inspiration.",
    nominateLink: "/nominate?award=influencers-education-impact&subcategory=sports",
    learnMoreLink: "/awards/influencers-education-impact/sports",
  },
  {
    icon: Music,
    tag: "CERTIFICATE OF RECOGNITION 2026",
    title: "Best Africa Music Icon Education Enablers",
    body:
      "Enablers of Education for All Across Africa — Musicians channelling their reach into education impact and opportunity.",
    nominateLink: "/nominate?award=influencers-education-impact&subcategory=music",
    learnMoreLink: "/awards/influencers-education-impact/music",
  },
];

/* ──────────────── PLATINUM AWARD (Institutional) ──────────────── */
const platinumData = {
  icon: Landmark,
  title: "Platinum Award 2026 – Jury-Only Institutional Recognition",
  body:
    "Institutions shaping Africa's education future at scale. Universities, libraries, research bodies, faith-based institutions, political leaders, international partners and diaspora organisations — your policies, programmes and leadership are creating lasting impact. This is Africa's highest institutional honour.",
  nominateLink: "/nominate?award=platinum-recognition",
  learnMoreLink: "/awards/platinum-recognition",
  eventLabel: "Nominate Platinum",
};

const nominationGroups = [
  { icon: Globe2, label: "Africans Living in Africa" },
  { icon: Users, label: "Africans in the Diaspora" },
  { icon: Heart, label: "Friends of Africa (Non-Africans)" },
];

const endorsers = [
  "Forum for African Women Educationalists (FAWE)",
  "Civil Society Action Coalition on Education for All (CSACEFA)",
];

export function CallForNominationIconAward() {
  const handleClick = (destination: string, label: string, eventName = "icon_award_cta_click") =>
    trackEvent(eventName, { link_destination: destination, link_name: label });

  return (
    <section
      id="call-for-nominations-icon"
      aria-labelledby="call-for-nominations-icon-heading"
      className="relative overflow-hidden bg-gradient-to-b from-black via-charcoal to-charcoal-light py-16 md:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />

      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge
            variant="outline"
            className="border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Nominations Open · NESA-Africa 2026
          </Badge>

          <h2
            id="call-for-nominations-icon-heading"
            className="mt-5 font-display text-3xl font-bold leading-tight text-ivory sm:text-4xl md:text-5xl"
          >
            The African{" "}
            <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
              Blue-Garnet Awards
            </span>{" "}
            for Education
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-gold/90 sm:text-lg">
            Africa&apos;s Education Recognition &amp; Impact Platform — Recognising the Enablers of Education for All Across Africa.
          </p>
          <p className="mx-auto mt-3 max-w-2xl font-display text-lg italic text-ivory/85 sm:text-xl">
            Africa sees you. Africa appreciates you. Africa says thank you.
          </p>
        </motion.div>

        {/* ── Platform description ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gold/20 bg-charcoal/60 p-5 text-center text-sm leading-relaxed text-ivory/80 sm:p-6 sm:text-base"
        >
          <span className="text-gold">NESA-Africa</span> (New Education Standard Award Africa) is Africa&apos;s Education Recognition &amp; Impact Platform — a continental ecosystem that identifies, verifies, recognises, connects and supports the people, organisations and institutions enabling Education for All.
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            BLUE GARNET — CSR & EDTECH
            ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <Trophy className="h-3.5 w-3.5" /> Blue Garnet Award 2026
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl">
            Corporate &amp; Innovation Recognition
          </h3>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-ivory/75 sm:text-base">
            Celebrating the companies and innovators transforming African education through CSR investment and digital solutions.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {corporateCategories.map(({ icon: Icon, title, subtitle, body, nominateLink, learnMoreLink, eventLabel }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="group relative flex h-full flex-col rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light/70 via-charcoal/80 to-black p-6 transition-all hover:border-gold/50 hover:shadow-[0_20px_60px_-20px_rgba(201,162,39,0.4)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 text-charcoal shadow-lg">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="mt-4 font-display text-lg font-bold text-ivory sm:text-xl">
                {title}
              </h4>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold/80">
                {subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>

              <div className="mt-auto pt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="sm"
                  className="bg-gold font-bold text-charcoal shadow-md shadow-gold/20 hover:bg-gold/90"
                  onClick={() => handleClick(nominateLink, eventLabel, "blue_garnet_cta_click")}
                >
                  <Link to={nominateLink}>
                    <Trophy className="mr-1.5 h-3.5 w-3.5" /> Nominate Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="text-ivory/70 hover:bg-white/5 hover:text-ivory"
                  onClick={() => handleClick(learnMoreLink, `Learn More — ${title}`, "blue_garnet_cta_click")}
                >
                  <Link to={learnMoreLink}>
                    Learn More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
            INFLUENCERS EDUCATION IMPACT AWARD
            ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <Users className="h-3.5 w-3.5" /> Influencers Education Impact Award 2026
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl">
            Your Voice is Powerful. Your Platform Can Change Lives.
          </h3>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-ivory/75 sm:text-base">
            Social media influencers, sports stars, musicians, content creators — if you are using your influence to fund scholarships, build schools, mentor young learners, or produce educational content, you deserve to be celebrated.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {influencerCategories.map(({ icon: Icon, title, body }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="group relative flex h-full flex-col rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light/70 via-charcoal/80 to-black p-6 transition-all hover:border-gold/50 hover:shadow-[0_20px_60px_-20px_rgba(201,162,39,0.4)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 text-charcoal shadow-lg">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="mt-4 font-display text-lg font-bold text-ivory sm:text-xl">{title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="bg-gold font-bold text-charcoal shadow-lg shadow-gold/20 hover:bg-gold/90"
            onClick={() => handleClick("/nominate?award=influencers-education-impact", "Nominate Influencer", "influencer_cta_click")}
          >
            <Link to="/nominate?award=influencers-education-impact">
              <Trophy className="mr-2 h-4 w-4" /> Nominate an Influencer
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="text-ivory/80 hover:bg-white/5 hover:text-ivory"
            onClick={() => handleClick("/awards/influencers-education-impact", "Learn More — Influencers", "influencer_cta_click")}
          >
            <Link to="/awards/influencers-education-impact">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            PLATINUM AWARD — INSTITUTIONAL RECOGNITION
            ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <Landmark className="h-3.5 w-3.5" /> Jury-Only · Institutional Excellence
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl">
            Platinum Award 2026 – Jury-Only Institutional Recognition
          </h3>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-ivory/75 sm:text-base">
            Institutions shaping Africa&apos;s education future at scale.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="group relative flex h-full flex-col rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light/70 via-charcoal/80 to-black p-6 transition-all hover:border-gold/50 hover:shadow-[0_20px_60px_-20px_rgba(201,162,39,0.4)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 text-charcoal shadow-lg">
              <Landmark className="h-6 w-6" />
            </div>
            <h4 className="mt-4 font-display text-lg font-bold text-ivory sm:text-xl">
              {platinumData.title}
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-ivory/70">{platinumData.body}</p>

            <div className="mt-auto pt-6 flex flex-wrap gap-3">
              <Button
                asChild
                size="sm"
                className="bg-gold font-bold text-charcoal shadow-md shadow-gold/20 hover:bg-gold/90"
                onClick={() => handleClick(platinumData.nominateLink, platinumData.eventLabel, "platinum_cta_click")}
              >
                <Link to={platinumData.nominateLink}>
                  <Trophy className="mr-1.5 h-3.5 w-3.5" /> Nominate Now
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="text-ivory/70 hover:bg-white/5 hover:text-ivory"
                onClick={() => handleClick(platinumData.learnMoreLink, "Learn More — Platinum", "platinum_cta_click")}
              >
                <Link to={platinumData.learnMoreLink}>
                  Learn More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </motion.article>
        </div>

        {/* ═══════════════════════════════════════════════════
            AFRICA EDUCATION ICON AWARD (existing)
            ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <Trophy className="h-3.5 w-3.5" /> Lifetime Achievement · 2006–2026
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl">
            The Africa Education Icon Award
          </h3>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-ivory/75 sm:text-base">
            For 20 years (2006–2026), quiet heroes have transformed education across our continent. This highest honour celebrates lifetime impact and legacy in African education.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {iconCategories.map(({ icon: Icon, title, body }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="group relative flex h-full flex-col rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light/70 via-charcoal/80 to-black p-6 transition-all hover:border-gold/50 hover:shadow-[0_20px_60px_-20px_rgba(201,162,39,0.4)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 text-charcoal shadow-lg">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="mt-4 font-display text-lg font-bold text-ivory sm:text-xl">{title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>
            </motion.article>
          ))}
        </div>

        {/* ── Nominate an Education Champion ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-14 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal/80 to-black p-6 sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr] lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold text-ivory sm:text-3xl">
                Nominate an Education Champion
              </h3>
              <p className="mt-3 text-sm text-ivory/75 sm:text-base">
                You can nominate in any of these groups:
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {nominationGroups.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 rounded-xl border border-gold/20 bg-charcoal/60 px-3 py-2.5 text-sm text-ivory/85"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-gold" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold font-bold text-charcoal shadow-lg shadow-gold/20 hover:bg-gold/90"
                  onClick={() => handleClick("/nominate?award=africa-education-icon", "Nominate Now")}
                >
                  <Link to="/nominate?award=africa-education-icon">
                    <Trophy className="mr-2 h-4 w-4" /> Nominate Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold/40 bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
                  onClick={() => handleClick("/nominees/accept", "Accept Your Nomination")}
                >
                  <Link to="/nominees/accept">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Accept Your Nomination
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-ivory/80 hover:bg-white/5 hover:text-ivory"
                  onClick={() => handleClick("/awards/africa-education-icon", "Learn More")}
                >
                  <Link to="/awards/africa-education-icon">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Organisers + Endorsers */}
            <aside className="rounded-2xl border border-gold/20 bg-charcoal/70 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/90">
                Organised by
              </p>
              <p className="mt-2 text-sm font-semibold text-ivory">
                Santos Creations Educational Foundation (SCEF)
              </p>
              <p className="mt-1 text-xs text-ivory/70">
                In partnership with EduAid-Africa &amp; Rebuild My School Africa
              </p>

              <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/90">
                Endorsed by
              </p>
              <ul className="mt-2 space-y-2">
                {endorsers.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm text-ivory/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CallForNominationIconAward;
