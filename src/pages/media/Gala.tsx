import { PROGRAMME_END, PROGRAMME_END_DATETIME, PROGRAMME_END_LABEL } from "@/config/programme";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/nesa/CountdownTimer";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { VolunteerCTABanner } from "@/components/volunteers/VolunteerCTABanner";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Camera,
  Clock,
  Crown,
  Download,
  Film,
  Gem,
  Globe2,
  Handshake,
  Heart,
  Mic,
  MapPin,
  Music,
  Play,
  Radio,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  Users,
  Vote,
  Wine,
} from "lucide-react";

import galaHeroImage from "@/assets/events/award-gala.jpeg";

// ============== EVENT DETAILS ==============
const GALA_DATE = PROGRAMME_END;
const GALA = {
  title: "Blue Garnet Awards Gala",
  tagline: "The Night Africa Celebrates Education Changemakers",
  date: PROGRAMME_END_LABEL,
  time: "18:00 WAT",
  venue: "International Conference Centre",
  city: "Lagos, Nigeria",
};

// ============== EXPERIENCE PILLARS ==============
const experiencePillars = [
  { icon: Star, title: "Red Carpet Arrivals", desc: "Africa's education icons, diplomats and changemakers walk the garnet carpet." },
  { icon: Music, title: "Live Performances", desc: "Continental artists, cultural ensembles and orchestral tributes." },
  { icon: Trophy, title: "Honouree Recognition", desc: "Blue Garnet, Gold, Icon and Platinum laureates revealed live." },
  { icon: Handshake, title: "Diplomacy & Partnerships", desc: "Heads of education, ministers, foundations and global partners." },
  { icon: Camera, title: "Global Media Coverage", desc: "Broadcast across 7 regions, 5 languages, 1M+ viewers." },
  { icon: Wine, title: "Networking Lounges", desc: "Premium lounges for sponsors, laureates and continental leaders." },
  { icon: Sparkles, title: "Cultural Showcases", desc: "A pan-African ode to heritage, language and craft." },
  { icon: Heart, title: "Youth Recognition", desc: "Student innovators and youth-led initiatives spotlighted on stage." },
];

// ============== JOURNEY TIMELINE ==============
const timeline = [
  { phase: "Pre-Gala", time: "Oct 1", title: "Gold Voting Closes", desc: "Public Gold tier voting concludes across all regions." },
  { phase: "Pre-Gala", time: "Oct 15", title: "Final Blue Garnet Voting", desc: "Jury + public final scoring sealed under audit." },
  { phase: "Gala Night", time: "17:00", title: "Nominee Arrival", desc: "Laureates, dignitaries and partners arrive on-site." },
  { phase: "Gala Night", time: "18:00", title: "Red Carpet & Media", desc: "Garnet carpet walk, press interviews, live broadcast opens." },
  { phase: "Gala Night", time: "19:00", title: "Opening & Performances", desc: "Cinematic opening, anthem and cultural showcase." },
  { phase: "Gala Night", time: "19:30", title: "Platinum & Gold Ceremony", desc: "Platinum certificates and Gold winners revealed." },
  { phase: "Gala Night", time: "22:00", title: "Africa Education Icon", desc: "Lifetime achievement induction ceremony." },
  { phase: "Finale", time: "23:00", title: "Blue Garnet Grand Finale", desc: "The 9 Blue Garnet laureates unveiled. Africa stands." },
  { phase: "Finale", time: "00:00", title: "Closing Celebration", desc: "After-party, legacy pledges and continental toast." },
];

// ============== FEATURED CATEGORIES ==============
const featuredCategories = [
  { title: "Blue Garnet Categories", desc: "The continent's highest education honour — 9 laureates.", href: "/awards/blue-garnet", accent: "from-indigo-500 to-blue-700", icon: Gem },
  { title: "Africa Education Icon", desc: "Lifetime achievement induction — 3 inductees.", href: "/awards/icon", accent: "from-amber-500 to-yellow-700", icon: Crown },
  { title: "Influencer Education Impact", desc: "Voices shaping the future of African learning.", href: "/categories/media-advocacy-nigeria", accent: "from-pink-500 to-rose-700", icon: Mic },
  { title: "CSR Education Awards", desc: "Corporate champions investing in education.", href: "/categories/csr-education-nigeria", accent: "from-emerald-500 to-teal-700", icon: Handshake },
  { title: "International Partnership", desc: "Cross-border collaborations transforming systems.", href: "/categories/diaspora-education", accent: "from-violet-500 to-purple-700", icon: Globe2 },
  { title: "Gold Special Recognition", desc: "Premium recognition for outstanding contributors.", href: "/awards/gold-special-recognition", accent: "from-yellow-400 to-amber-700", icon: Award },
];

// ============== VENUE ZONES ==============
const venueZones = [
  { icon: Crown, label: "VVIP Platinum Lounge", desc: "Reserved front-stage, gourmet dining, private bar." },
  { icon: Star, label: "VIP Front Rows", desc: "Front-row seating, red-carpet access, VIP lounge." },
  { icon: Users, label: "Premium Tables", desc: "Curated mid-front tables for partners and laureates." },
  { icon: Camera, label: "Media Zone", desc: "Press wall, broadcast positions, live interview decks." },
  { icon: Handshake, label: "Sponsor Pavilions", desc: "Branded activations for corporate and diplomatic partners." },
  { icon: Mic, label: "Main Stage", desc: "Cinematic LED stage, immersive lighting and orchestral pit." },
];

// ============== TICKETS ==============
const tickets = [
  { name: "General Access", price: "$30", tier: "Standard", perks: ["Gala entry", "General seating", "Instant QR e-ticket", "Digital receipt"], cta: "Reserve Seat", featured: false },
  { name: "Premium Seat", price: "$60", tier: "Priority", perks: ["Priority mid-front seating", "Welcome drink", "QR e-ticket", "Digital receipt"], cta: "Get Premium", featured: false },
  { name: "VIP Access", price: "$120", tier: "VIP", perks: ["Front-row VIP seating", "VIP lounge & bar", "Red-carpet photo", "Priority entry"], cta: "Go VIP", featured: true },
  { name: "VVIP Platinum", price: "$200", tier: "Platinum", perks: ["VVIP reserved seating", "Platinum lounge", "Gourmet dinner", "Backstage tour", "Nominee meet & greet", "Luxury gift collection"], cta: "Reserve Platinum", featured: false },
  { name: "Sponsor Table", price: "Custom", tier: "Partner", perks: ["10-seat branded table", "On-stage acknowledgement", "Logo on broadcast", "Media interview slot"], cta: "Request Table", featured: false },
];

// ============== SPONSORSHIP TIERS ==============
const sponsorBenefits = [
  { icon: Globe2, label: "Continental Exposure", desc: "Reach 1M+ viewers across 7 African regions and the diaspora." },
  { icon: Radio, label: "Broadcast Branding", desc: "Logo placement across the 6-hour live ceremony and digital channels." },
  { icon: Heart, label: "CSR Visibility", desc: "Position your brand alongside Africa's education movement." },
  { icon: Camera, label: "Media Coverage", desc: "Press kit inclusion, interview slots, and feature stories." },
];

// ============== ALIGNMENT ==============
const alignments = [
  { code: "SDG 4", title: "Quality Education", color: "from-red-500 to-orange-500" },
  { code: "AU 2063", title: "Agenda for Africa", color: "from-emerald-500 to-green-700" },
  { code: "SDG 5", title: "Gender Equality", color: "from-pink-500 to-rose-600" },
  { code: "SDG 17", title: "Global Partnerships", color: "from-blue-500 to-indigo-700" },
];

// ============== JSON-LD ==============
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `NESA-Africa 2026 ${GALA.title}`,
  startDate: PROGRAMME_END_DATETIME,
  endDate: "2026-10-23T00:00:00+01:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  location: {
    "@type": "Place",
    name: GALA.venue,
    address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
  },
  image: ["https://nesaafrica.lovable.app/og/gala.jpg"],
  description: "The NESA-Africa Blue Garnet Awards Gala — Africa's premier celebration of education changemakers.",
  organizer: { "@type": "Organization", name: "NESA-Africa", url: "https://nesaafrica.lovable.app" },
  offers: tickets
    .filter((t) => t.price.startsWith("$"))
    .map((t) => ({
      "@type": "Offer",
      name: t.name,
      price: t.price.replace("$", ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://nesaafrica.lovable.app/tickets",
    })),
};

// ============== ANIMATIONS ==============
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
} as const;

// ============== PARTICLES (CSS-only) ==============
function PrestigeParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute block h-1 w-1 rounded-full bg-gold/60 blur-[1px] animate-pulse"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Gala() {
  const { currentEdition } = useSeason();
  const year = currentEdition?.displayYear || "2026";

  return (
    <>
      <Helmet>
        <title>{`NESA-Africa ${year} Blue Garnet Awards Gala | Lagos · 22 Oct 2026`}</title>
        <meta
          name="description"
          content={`The NESA-Africa ${year} Blue Garnet Awards Gala — a cinematic continental celebration of Africa's education changemakers. Lagos · 22 Oct 2026.`}
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/media/gala" />
        <meta property="og:title" content={`NESA-Africa ${year} Blue Garnet Awards Gala`} />
        <meta property="og:description" content="The night Africa celebrates education changemakers." />
        <meta property="og:url" content="https://nesaafrica.lovable.app/media/gala" />
        <meta property="og:type" content="event" />
        <script type="application/ld+json">{JSON.stringify(eventJsonLd)}</script>
      </Helmet>

      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Media", path: "/media" },
          { name: "Awards Gala", path: "/media/gala" },
        ]}
      />

      <div className="min-h-screen bg-charcoal text-white">
        {/* ============== 1. HERO ============== */}
        <section className="relative isolate min-h-[100vh] flex items-center overflow-hidden">
          {/* Cinematic background */}
          <div className="absolute inset-0">
            <img
              src={galaHeroImage}
              alt="NESA-Africa Blue Garnet Awards Gala"
              className="h-full w-full object-cover scale-110"
            />
            {/* Layered cinematic gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/85 to-indigo-950/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
            {/* Spotlight sweep */}
            <div className="absolute -top-1/3 left-1/2 h-[140%] w-[140%] -translate-x-1/2 rounded-full bg-gradient-radial from-gold/15 via-transparent to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-gradient-to-tl from-indigo-600/20 via-transparent to-transparent blur-3xl" />
          </div>
          <PrestigeParticles />

          <div className="container relative z-10 mx-auto px-4 py-20 lg:py-28">
            <Link
              to="/media"
              className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media Hub
            </Link>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-4xl"
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Badge className="border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold backdrop-blur">
                  <Gem className="mr-2 inline h-3 w-3" /> Blue Garnet · {year}
                </Badge>
                <Badge className="border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-white/80 backdrop-blur">
                  Continental Awards Gala
                </Badge>
              </div>

              <h1 className="mb-6 font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                The Night Africa <br />
                <span className="bg-gradient-to-r from-gold via-yellow-200 to-gold bg-clip-text text-transparent">
                  Celebrates Education
                </span>
                <br />
                Changemakers.
              </h1>

              <p className="mb-8 max-w-2xl text-base text-white/75 sm:text-lg md:text-xl">
                NESA-Africa {year} <span className="text-gold">Blue Garnet Awards Gala</span> — a cinematic continental celebration of the educators, innovators and institutions reshaping Africa's future.
              </p>

              {/* Event meta strip */}
              <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {GALA.venue} · {GALA.city}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> {GALA.date} · {GALA.time}</span>
                <span className="flex items-center gap-2"><Radio className="h-4 w-4 text-gold" /> Live · 5 Languages</span>
              </div>

              {/* Countdown */}
              <div className="mb-10 inline-block rounded-2xl border border-gold/20 bg-charcoal/60 px-5 py-4 backdrop-blur-lg">
                <CountdownTimer targetDate={GALA_DATE} label="Until the Garnet Carpet Opens" />
              </div>

              {/* CTA stack */}
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-to-r from-gold to-yellow-500 text-charcoal shadow-lg shadow-gold/30 hover:shadow-gold/50">
                  <Link to="/tickets"><Ticket className="mr-2 h-5 w-5" /> Buy Gala Ticket</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-indigo-400/60 bg-indigo-500/10 text-white backdrop-blur hover:bg-indigo-500/20">
                  <Link to="/awards/gold-blue-garnet"><Vote className="mr-2 h-5 w-5" /> Vote Before Gala</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10">
                  <Link to="/sponsors"><Handshake className="mr-2 h-5 w-5" /> Become a Sponsor</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
                  <Link to="/media/tv"><Play className="mr-2 h-5 w-5" /> Watch Preview</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/40">
            Scroll · Experience
          </div>
        </section>

        {/* ============== 2. EXPERIENCE PILLARS ============== */}
        <section className="relative bg-gradient-to-b from-charcoal via-charcoal to-charcoal-light py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mx-auto mb-14 max-w-2xl text-center"
            >
              <Badge className="mb-4 border-gold/40 bg-gold/10 text-gold">The Gala Experience</Badge>
              <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
                A Continental Celebration of <span className="text-gold">Education Impact</span>
              </h2>
              <p className="mt-4 text-white/70">
                Nine hours of cinema-grade storytelling, cultural artistry and continental recognition — broadcast to the world.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {experiencePillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="group h-full border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] transition hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-indigo-500/10 ring-1 ring-gold/30 transition group-hover:scale-110">
                        <pillar.icon className="h-6 w-6 text-gold" />
                      </div>
                      <h3 className="mb-2 font-semibold text-white">{pillar.title}</h3>
                      <p className="text-sm text-white/60">{pillar.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 3. JOURNEY TIMELINE ============== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-charcoal-light via-indigo-950/30 to-charcoal py-20 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.08),_transparent_60%)]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 border-indigo-400/40 bg-indigo-500/10 text-indigo-300">Gala Journey</Badge>
              <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
                From Voting Close to <span className="text-gold">Grand Finale</span>
              </h2>
              <p className="mt-4 text-white/70">The cinematic arc of Africa's premier education awards night.</p>
            </div>

            <div className="relative mx-auto max-w-4xl">
              {/* Spine */}
              <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-gold/60 via-indigo-500/40 to-gold/60 md:left-1/2" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <motion.div
                    key={`${item.time}-${item.title}`}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className={`relative pl-12 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"}`}
                  >
                    {/* Node */}
                    <div className="absolute left-2 top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-gold ring-4 ring-gold/20 shadow-lg shadow-gold/50 md:left-1/2 md:translate-x-[-50%]" 
                      style={i % 2 === 0 ? {} : {}} />
                    <Card className="border-white/10 bg-white/[0.04] backdrop-blur">
                      <CardContent className="p-5">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <Badge className="border-gold/30 bg-gold/10 text-gold">{item.time}</Badge>
                          <span className="text-[10px] uppercase tracking-widest text-white/50">{item.phase}</span>
                        </div>
                        <h3 className="mb-1 font-semibold text-white">{item.title}</h3>
                        <p className="text-sm text-white/65">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============== 4. FEATURED CATEGORIES ============== */}
        <section className="bg-charcoal py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 border-gold/40 bg-gold/10 text-gold">Honoured On Stage</Badge>
              <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
                The Categories of the <span className="text-gold">Garnet Carpet</span>
              </h2>
              <p className="mt-4 text-white/70">Every Blue Garnet, Gold, Icon and Special Recognition category unveiled at the gala.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCategories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={cat.href} className="group block h-full">
                    <Card className="relative h-full overflow-hidden border-white/10 bg-charcoal-light transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/10">
                      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cat.accent}`} />
                      <div className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${cat.accent} opacity-10 blur-3xl transition group-hover:opacity-30`} />
                      <CardContent className="relative p-6">
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.accent} text-white shadow-lg`}>
                          <cat.icon className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 font-display text-xl font-bold text-white">{cat.title}</h3>
                        <p className="mb-5 text-sm text-white/65">{cat.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-gold">
                            Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                          </span>
                          <Link
                            to="/awards/gold-blue-garnet"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs uppercase tracking-wider text-white/50 hover:text-gold"
                          >
                            Vote ·
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 5. VENUE EXPERIENCE ============== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-charcoal to-charcoal-light py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Badge className="mb-4 border-gold/40 bg-gold/10 text-gold">Inside the Gala</Badge>
                <h2 className="mb-5 font-display text-3xl font-bold text-white md:text-5xl">
                  Step Into a <span className="text-gold">Luxury Continental Stage</span>
                </h2>
                <p className="mb-8 text-white/70">
                  The International Conference Centre transforms into a cinematic continental stage — immersive LED, orchestral lighting, premium hospitality, and the most photographed garnet carpet in African education.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {venueZones.map((z) => (
                    <div key={z.label} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/30">
                        <z.icon className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{z.label}</div>
                        <div className="text-xs text-white/55">{z.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative">
                <div className="relative overflow-hidden rounded-3xl border border-gold/20 shadow-2xl shadow-indigo-900/40">
                  <img src={galaHeroImage} alt="Gala venue preview" className="h-[520px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <Badge className="mb-3 bg-gold/20 text-gold">360° Preview Coming Soon</Badge>
                    <h3 className="font-display text-2xl font-bold text-white">{GALA.venue}</h3>
                    <p className="text-sm text-white/70">{GALA.city} · Capacity 2,500</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 hidden h-32 w-32 rounded-full bg-gold/20 blur-3xl md:block" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============== 6. TICKETS ============== */}
        <section className="relative overflow-hidden bg-charcoal py-20 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.06),_transparent_70%)]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 border-gold/40 bg-gold/10 text-gold">Tickets & Access</Badge>
              <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
                Reserve Your <span className="text-gold">Seat at History</span>
              </h2>
              <p className="mt-4 text-white/70">From general access to platinum lounges — choose how you experience the gala.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {tickets.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className={t.featured ? "lg:-mt-4" : ""}
                >
                  <Card className={`relative h-full overflow-hidden ${t.featured ? "border-gold/60 bg-gradient-to-b from-gold/10 to-charcoal-light shadow-xl shadow-gold/20" : "border-white/10 bg-charcoal-light"}`}>
                    {t.featured && (
                      <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-gold to-yellow-400 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-charcoal">
                        Most Popular
                      </div>
                    )}
                    <CardContent className={`p-6 ${t.featured ? "pt-9" : ""}`}>
                      <div className="mb-1 text-[10px] uppercase tracking-widest text-gold">{t.tier}</div>
                      <h3 className="mb-1 font-display text-xl font-bold text-white">{t.name}</h3>
                      <div className="mb-5 flex items-baseline gap-1">
                        <span className="font-display text-3xl font-bold text-gold">{t.price}</span>
                        {t.price.startsWith("$") && <span className="text-xs text-white/50">USD</span>}
                      </div>
                      <ul className="mb-6 space-y-2 text-sm text-white/70">
                        {t.perks.map((p) => (
                          <li key={p} className="flex gap-2">
                            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild size="sm" className={`w-full ${t.featured ? "bg-gradient-to-r from-gold to-yellow-500 text-charcoal" : "bg-white/10 text-white hover:bg-white/20"}`}>
                        <Link to={t.price === "Custom" ? "/sponsors" : "/tickets"}>{t.cta}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-white/40">
              Instant QR e-ticket · Digital receipt · Pay via GFA Wallet, Paystack, Transactpay, Zelle, TapTap Send or Bancable.
            </p>
          </div>
        </section>

        {/* ============== 7. SPONSORSHIP ============== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-charcoal to-charcoal py-20 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(99,102,241,0.15),_transparent_60%)]" />
          <div className="container relative mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge className="mb-4 border-indigo-400/40 bg-indigo-500/10 text-indigo-300">Partnerships</Badge>
                <h2 className="mb-5 font-display text-3xl font-bold text-white md:text-5xl">
                  Partner With Africa's <span className="text-gold">Education Movement</span>
                </h2>
                <p className="mb-8 text-white/75">
                  Align your brand with a continental celebration that reaches 1M+ viewers across 7 regions. From broadcast branding to on-stage acknowledgement, gala sponsorship unlocks unmatched CSR visibility.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-gradient-to-r from-gold to-yellow-500 text-charcoal">
                    <Link to="/sponsors"><Handshake className="mr-2 h-5 w-5" /> Become a Sponsor</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                    <Link to="/sponsors"><Download className="mr-2 h-5 w-5" /> Partnership Deck</Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
                    <Link to="/contact?subject=partnership">Contact Team</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {sponsorBenefits.map((b) => (
                  <Card key={b.label} className="border-indigo-400/20 bg-white/[0.04] backdrop-blur">
                    <CardContent className="p-5">
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 ring-1 ring-indigo-400/40">
                        <b.icon className="h-5 w-5 text-indigo-300" />
                      </div>
                      <h4 className="mb-1 font-semibold text-white">{b.label}</h4>
                      <p className="text-xs text-white/60">{b.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============== 8. MEDIA & STORYTELLING ============== */}
        <section className="bg-charcoal py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 border-gold/40 bg-gold/10 text-gold">Media & Stories</Badge>
              <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
                Moments That Shape <span className="text-gold">Africa's Future</span>
              </h2>
              <p className="mt-4 text-white/70">Cinematic trailers, laureate stories and press coverage from across the continent.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: "Official 2026 Gala Trailer", duration: "2:15", tag: "Trailer" },
                { title: "Laureate Stories: Educators Reshaping Africa", duration: "12:40", tag: "Documentary" },
                { title: "2024 Gala Highlights Reel", duration: "8:20", tag: "Highlights" },
              ].map((v, i) => (
                <motion.div
                  key={v.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={galaHeroImage} alt={v.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/90 text-charcoal shadow-2xl transition group-hover:scale-110">
                        <Play className="ml-1 h-7 w-7" fill="currentColor" />
                      </div>
                    </div>
                    <Badge className="absolute left-3 top-3 bg-charcoal/80 text-gold backdrop-blur">{v.tag}</Badge>
                    <span className="absolute bottom-3 right-3 rounded-full bg-charcoal/80 px-2 py-0.5 text-xs text-white backdrop-blur">{v.duration}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white transition group-hover:text-gold">{v.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/media/tv"><Film className="mr-2 h-4 w-4" /> Open NESA Africa TV</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ============== 9. GLOBAL ALIGNMENT ============== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-charcoal to-charcoal-light py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 border-gold/40 bg-gold/10 text-gold">Continental Impact</Badge>
              <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
                More Than an Event — A <span className="text-gold">Movement</span>
              </h2>
              <p className="mt-4 text-white/70">
                The Blue Garnet Gala aligns continental recognition with global development frameworks driving Africa's education future.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {alignments.map((a, i) => (
                <motion.div
                  key={a.code}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal p-6 text-center"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-0 transition group-hover:opacity-20`} />
                  <div className={`relative mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${a.color} text-white font-bold shadow-lg`}>
                    <span className="text-xs">{a.code}</span>
                  </div>
                  <h4 className="relative font-semibold text-white">{a.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 10. FINAL CTA ============== */}
        <section className="relative isolate overflow-hidden bg-charcoal py-24 lg:py-32">
          <div className="absolute inset-0">
            <img src={galaHeroImage} alt="" className="h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-indigo-950/70" />
            <div className="absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-gold/15 via-transparent to-transparent blur-3xl" />
          </div>
          <PrestigeParticles />

          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Gem className="mx-auto mb-6 h-12 w-12 text-gold" />
              <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
                Join Africa's Biggest Celebration of <span className="bg-gradient-to-r from-gold via-yellow-200 to-gold bg-clip-text text-transparent">Education Impact</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75">
                One night. One continent. One stage where Africa's education changemakers are honoured before the world.
              </p>

              <div className="mt-8 inline-block rounded-2xl border border-gold/30 bg-charcoal/60 px-6 py-5 backdrop-blur-lg">
                <CountdownTimer targetDate={GALA_DATE} label={`${GALA.date} · ${GALA.venue} · ${GALA.city}`} />
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-gradient-to-r from-gold to-yellow-500 text-charcoal shadow-lg shadow-gold/40">
                  <Link to="/tickets"><Ticket className="mr-2 h-5 w-5" /> Buy Ticket</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-indigo-400/60 bg-indigo-500/10 text-white hover:bg-indigo-500/20">
                  <Link to="/awards/gold-blue-garnet"><Vote className="mr-2 h-5 w-5" /> Learn More</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Link to="/sponsors"><Handshake className="mr-2 h-5 w-5" /> Partner With NESA</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
                  <Link to="/nominees">Explore Nominees <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        <VolunteerCTABanner headline="Help us deliver the 2026 Gala" subline="Join the Gala volunteer team — production, hospitality, media, logistics." />
      </div>
    </>
  );
}
