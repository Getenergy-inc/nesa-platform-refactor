// Call for Nominations — NESA-Africa 2026 Multi-Category Surface
// Homepage award-tier surface (charcoal + gold). Order:
//   Tier 1 · Icon (Lifetime) → Tier 2 · Blue-Garnet → Tier 3 · Platinum → Tier 4 · Influencers
// Mobile visitors see Tier 1 + Tier 2 only, then a "View All Nomination Categories" button.
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
  Plane,
  Newspaper,
  HandHeart,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";

/* ──────────────── TIER 1: ICON AWARD (Lifetime 2006–2026) ──────────────── */
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

/* ──────────────── TIER 2: BLUE-GARNET (CSR · EdTech · NGO · Media) ──────────────── */
const blueGarnetCategories = [
  {
    icon: HeartHandshake,
    title: "Best CSR for Education in Africa",
    subtitle: "Blue-Garnet Award 2026",
    body:
      "Companies changing classrooms across Africa. If your CSR programme is building schools, funding scholarships, training teachers or delivering digital learning, this is your moment to be recognised continent-wide.",
    nominateLink: "/nominate?award=csr-education-africa",
    learnMoreLink: "/awards/blue-garnet-categories/csr-education-africa",
    eventLabel: "Nominate CSR",
    nominateCta: "Nominate Here",
  },
  {
    icon: Cpu,
    title: "Best EdTech & STEM Innovation for Education",
    subtitle: "Blue-Garnet Award 2026",
    body:
      "The future of African education is digital. If your platform, app, coding academy, STEM programme or EdTech solution is transforming how African children and youth learn — this award is for you.",
    nominateLink: "/nominate?award=edutech-africa",
    learnMoreLink: "/awards/blue-garnet-categories/edutech-africa",
    eventLabel: "Nominate EdTech",
    nominateCta: "Nominate Here",
  },
  {
    icon: HandHeart,
    title: "NGO Education Enablers for Education for All Award",
    subtitle: "Blue-Garnet Award 2026",
    body:
      "Across Nigeria and Africa, NGOs are closing education gaps through literacy programmes, school support, scholarships, inclusion, community learning, teacher development, advocacy and grassroots interventions. This category recognises non-governmental organisations creating measurable education impact — with two nomination pathways: Nigeria and Africa Regional.",
    nominateLink: "/nominate/ngo",
    learnMoreLink: "/awards/blue-garnet-categories/ngo-education",
    eventLabel: "Nominate NGO",
    nominateCta: "Nominate Here",
  },
  {
    icon: Newspaper,
    title: "Nigeria Media Enablers for Education for All Award",
    subtitle: "Blue-Garnet Award 2026",
    body:
      "Recognising Nigerian broadcast, print and digital media organisations amplifying Education for All — through investigative journalism, sustained coverage, educational programming and community advocacy that shifts policy and public attention toward learners.",
    nominateLink: "/nominate?award=media-education-nigeria",
    learnMoreLink: "/awards/blue-garnet-categories/media-education-nigeria",
    eventLabel: "Nominate Media",
    nominateCta: "Nominate Here",
  },
];

/* ──────────────── TIER 3: PLATINUM (Institutional · Jury-only) ──────────────── */
const platinumCategories = [
  {
    icon: Globe2,
    tag: "PLATINUM RECOGNITION 2026",
    title: "Best Bilateral Organisations & International Embassies Education Enablers",
    body:
      "Enablers of Education for All Across Africa — International partners and embassies accelerating education outcomes through partnerships, funding and technical support.",
    nominateLink: "/nominate?award=platinum-recognition&subcategory=international-bilateral",
    learnMoreLink: "/awards/platinum-recognition",
  },
  {
    icon: Users,
    tag: "PLATINUM RECOGNITION 2026",
    title: "Faith-Based & Religious Organisations Advancing Education",
    body:
      "Faith-based and religious organisations are vital Enablers of Education for All Across Africa. Through schools, scholarships, vocational training, literacy programmes, community learning, moral formation, inclusion and support for underserved communities, they continue to advance education across the continent. This category recognises Christian, Islamic and other faith-based organisations whose education programmes, institutions and community interventions are creating measurable impact for learners, families and communities across Africa.",
    nominateLink: "/nominate?award=platinum-recognition&subcategory=faith-based-organisations",
    learnMoreLink: "/awards/platinum-recognition/faith-based",
  },
  {
    icon: Plane,
    tag: "PLATINUM RECOGNITION 2026",
    title: "African Diaspora Education Impact Award",
    body:
      "Africans in the Diaspora are powerful Enablers of Education for All Across Africa. Through scholarships, mentorship, school support, advocacy, knowledge transfer, fundraising, partnerships, innovation and community investment, they continue to strengthen education back home.",
    nominateLink: "/nominate?award=platinum-recognition&subcategory=african-diaspora",
    learnMoreLink: "/awards/platinum-recognition/diaspora",
  },
  {
    icon: Landmark,
    tag: "PLATINUM RECOGNITION 2026",
    title: "Nigeria Political Leaders Education Enablers",
    body:
      "Enablers of Education for All Across Africa — Political leaders and public officials whose policies and actions deliver real education transformation in Nigeria.",
    nominateLink: "/nominate?award=platinum-recognition&subcategory=political-leaders-nigeria",
    learnMoreLink: "/awards/platinum-recognition",
  },
];

/* ──────────────── TIER 4: INFLUENCERS (Certificate of Recognition 2026) ──────────────── */
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
      "Enablers of Education for All Across Africa — Athletes using their platforms for scholarships, school-building and youth inspiration.",
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
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            TIER 1 — AFRICA EDUCATION ICON AWARD
            ═══════════════════════════════════════════════════ */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <Trophy className="h-3.5 w-3.5" /> Tier 1 · Lifetime Achievement · 2006–2026
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl">
            The Africa Education Icon Award
          </h3>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-ivory/75 sm:text-base">
            For 20 years (2006–2026), quiet heroes have transformed education across our continent. This highest honour celebrates lifetime impact and legacy as <span className="text-gold">Enablers of Education for All Across Africa</span>.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {iconCategories.map(({ icon: Icon, tag, title, body, nominateLink, learnMoreLink }, i) => (
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
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/80">{tag}</p>
              <h4 className="mt-1 font-display text-lg font-bold text-ivory sm:text-xl">{title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>
              <div className="mt-auto pt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="sm"
                  className="bg-gold font-bold text-charcoal shadow-md shadow-gold/20 hover:bg-gold/90"
                  onClick={() => handleClick(nominateLink, `Nominate — ${title}`, "icon_award_cta_click")}
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
                  onClick={() => handleClick(learnMoreLink, `Learn More — ${title}`, "icon_award_cta_click")}
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
            TIER 2 — BLUE-GARNET AWARD (CSR · EdTech · NGO · Media)
            ═══════════════════════════════════════════════════ */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <Trophy className="h-3.5 w-3.5" /> Tier 2 · Blue-Garnet Award 2026
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl">
            Corporate, NGO, Innovation &amp; Media Recognition
          </h3>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-ivory/75 sm:text-base">
            Celebrating the companies, NGOs, innovators and media organisations transforming African education through investment, delivery and advocacy.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {blueGarnetCategories.map(({ icon: Icon, title, subtitle, body, nominateLink, learnMoreLink, eventLabel, nominateCta }, i) => (
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
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold/80">{subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>

              <div className="mt-auto pt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="sm"
                  className="bg-gold font-bold text-charcoal shadow-md shadow-gold/20 hover:bg-gold/90"
                  onClick={() => handleClick(nominateLink, eventLabel, "blue_garnet_cta_click")}
                >
                  <Link to={nominateLink}>
                    <Trophy className="mr-1.5 h-3.5 w-3.5" /> {nominateCta ?? "Nominate Now"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="text-ivory/70 hover:bg-white/5 hover:text-ivory"
                  onClick={() => handleClick(learnMoreLink, `View — ${title}`, "blue_garnet_cta_click")}
                >
                  <Link to={learnMoreLink}>
                    View <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── Mobile View All Categories (below Tier 2, hides Tier 3 & 4 on mobile) ── */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Button
            asChild
            size="lg"
            className="bg-gold font-bold text-charcoal shadow-lg shadow-gold/20 hover:bg-gold/90"
            onClick={() => handleClick("/awards", "View All Nomination Categories", "view_all_categories_click")}
          >
            <Link to="/awards">
              <LayoutGrid className="mr-2 h-4 w-4" /> View All Nomination Categories
            </Link>
          </Button>
        </div>

        {/* ═══════════════════════════════════════════════════
            TIER 3 — PLATINUM AWARD (desktop / tablet only on homepage)
            ═══════════════════════════════════════════════════ */}
        <div className="hidden sm:block">
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
              <Landmark className="h-3.5 w-3.5" /> Tier 3 · Jury-Only · Institutional Excellence
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl">
              Platinum Recognition 2026
            </h3>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-ivory/75 sm:text-base">
              Institutions shaping Africa&apos;s education future at scale.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platinumCategories.map(({ icon: Icon, tag, title, body, nominateLink, learnMoreLink }, i) => (
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
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/80">{tag}</p>
                <h4 className="mt-1 font-display text-lg font-bold text-ivory sm:text-xl">{title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>
                <div className="mt-auto pt-6 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="bg-gold font-bold text-charcoal shadow-md shadow-gold/20 hover:bg-gold/90"
                    onClick={() => handleClick(nominateLink, `Nominate — ${title}`, "platinum_cta_click")}
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
                    onClick={() => handleClick(learnMoreLink, `Learn More — ${title}`, "platinum_cta_click")}
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
              TIER 4 — INFLUENCERS EDUCATION IMPACT AWARD
              ═══════════════════════════════════════════════════ */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
              <Users className="h-3.5 w-3.5" /> Tier 4 · Influencers Education Impact Award 2026
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl">
              Your Voice is Powerful. Your Platform Can Change Lives.
            </h3>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-ivory/75 sm:text-base">
              Social media influencers, sports stars and musicians using their reach to advance Education for All.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {influencerCategories.map(({ icon: Icon, tag, title, body, nominateLink, learnMoreLink }, i) => (
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
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/80">{tag}</p>
                <h4 className="mt-1 font-display text-lg font-bold text-ivory sm:text-xl">{title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>
                <div className="mt-auto pt-6 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="bg-gold font-bold text-charcoal shadow-md shadow-gold/20 hover:bg-gold/90"
                    onClick={() => handleClick(nominateLink, `Nominate — ${title}`, "influencer_cta_click")}
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
                    onClick={() => handleClick(learnMoreLink, `Learn More — ${title}`, "influencer_cta_click")}
                  >
                    <Link to={learnMoreLink}>
                      Learn More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* ── Organisers / Endorsers (kept once, at the foot of the tier surface) ── */}
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
                Who Can Be Nominated?
              </h3>
              <p className="mt-3 text-sm text-ivory/75 sm:text-base">
                Nominations are open to individuals and organisations in any of these groups:
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
