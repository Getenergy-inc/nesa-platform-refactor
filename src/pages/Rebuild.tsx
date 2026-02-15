// Rebuild My School Africa — EduAid-Africa Post-Award Legacy Page
// Wrapped in .eduaid-scope for scoped navy/green/gold branding

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Users,
  ArrowRight,
  Globe,
  School,
  GraduationCap,
  Trophy,
  Vote,
  CheckCircle2,
  Calendar,
  Star,
  BookOpen,
  Accessibility,
  Eye,
  Ear,
  Brain,
  HandHeart,
  Building2,
  Landmark,
  Baby,
  Laptop,
  Hammer,
  Sparkles,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Images
import heroImg from "@/assets/rebuild/hero-special-needs-school.jpg";
import formalSchoolImg from "@/assets/rebuild/formal-school.jpg";
import informalSchoolImg from "@/assets/rebuild/informal-school.jpg";
import vocationalImg from "@/assets/rebuild/vocational-center.jpg";
import africaMapImg from "@/assets/africa-map-silhouette.png";

// ─── DATA ────────────────────────────────────────────────────────────────────

const regions = [
  { name: "West Africa", countries: "Nigeria, Ghana, Senegal, Sierra Leone, Liberia, Mali, Burkina Faso, Togo, Benin, Niger, Guinea, Côte d'Ivoire, Gambia, Guinea-Bissau, Cape Verde, Mauritania" },
  { name: "East Africa", countries: "Kenya, Uganda, Tanzania, Ethiopia, Rwanda, Burundi, Somalia, Djibouti, Eritrea, South Sudan, Comoros, Seychelles, Mauritius, Madagascar" },
  { name: "Southern Africa", countries: "South Africa, Zimbabwe, Mozambique, Zambia, Malawi, Botswana, Namibia, Lesotho, Eswatini, Angola" },
  { name: "Central Africa", countries: "Cameroon, DRC, Congo-Brazzaville, Gabon, Chad, Central African Republic, Equatorial Guinea, São Tomé & Príncipe" },
  { name: "North Africa", countries: "Egypt, Morocco, Tunisia, Algeria, Libya, Sudan" },
];

const timeline = [
  { phase: "Nominate", period: "Post-Ceremony 2026", description: "Communities nominate deserving special needs schools in their region", icon: Trophy },
  { phase: "Vote", period: "Jul – Sep 2026", description: "Public voting via AGC points determines the winning school per region", icon: Vote },
  { phase: "Intervene", period: "Oct 2026 – Jun 2027", description: "EduAid-Africa delivers facility upgrades, resources, and teacher training", icon: Heart },
];

const formalSchoolTypes = [
  { name: "Schools for the Deaf", icon: Ear, description: "Sign language instruction, hearing aid support, speech therapy" },
  { name: "Schools for the Blind & Visually Impaired", icon: Eye, description: "Braille curriculum, mobility training, assistive technology" },
  { name: "Schools for Physical Disabilities", icon: Accessibility, description: "Wheelchair-accessible facilities, physiotherapy rooms, adapted sports" },
  { name: "Schools for Intellectual Disabilities", icon: Brain, description: "Life skills training, sensory rooms, individualized education programs" },
  { name: "Schools for Autism Spectrum", icon: Sparkles, description: "Structured environments, sensory-friendly spaces, ABA therapy support" },
  { name: "Inclusive / Mainstream Schools", icon: School, description: "Regular schools with integrated special education units and support staff" },
  { name: "Early Intervention Centres", icon: Baby, description: "Pre-school support for children with developmental delays (0–6 years)" },
  { name: "Government Special Education Schools", icon: Landmark, description: "State-funded institutions for various disabilities, often boarding schools" },
  { name: "Vocational & Skills Training Centres", icon: Hammer, description: "Trade skills, craftsmanship, and job readiness for young adults with disabilities" },
  { name: "Resource Centres for Special Needs", icon: BookOpen, description: "Assessment, referral, and material support hubs for multiple schools" },
];

const informalSchoolTypes = [
  { name: "Community-Based Rehabilitation (CBR) Centres", icon: HandHeart, description: "Grassroots disability support, home-based learning programs" },
  { name: "Faith-Based Special Needs Schools", icon: Star, description: "Church/mosque-run schools offering care and education for children with disabilities" },
  { name: "NGO-Run Learning Centres", icon: Globe, description: "Non-profit operated programs for underserved disabled children" },
  { name: "Home Schooling Networks", icon: Users, description: "Parent-led cooperatives for children too disabled to attend formal school" },
  { name: "Mobile & Outreach Schools", icon: Building2, description: "Traveling teachers reaching remote/nomadic communities with disabled children" },
  { name: "Digital & E-Learning Programmes", icon: Laptop, description: "Online/radio-based learning for disabled students in inaccessible areas" },
];

const interventionAreas = [
  "Inclusive classroom facilities & assistive technology",
  "Special needs teacher training & certification support",
  "Learning materials & adapted curriculum development",
  "WASH infrastructure & accessibility upgrades",
  "Sensory rooms, therapy spaces & adaptive equipment",
  "Transport & mobility support for students",
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Rebuild() {
  return (
    <>
      <Helmet>
        <title>Rebuild My School Africa | EduAid-Africa Post-Award Legacy</title>
        <meta
          name="description"
          content="Nominate and vote for special needs schools across Africa to receive facility upgrades through EduAid-Africa. A post-award legacy initiative of SCEF and NESA-Africa."
        />
      </Helmet>

      <div className="eduaid-scope min-h-screen" style={{
        background: `linear-gradient(180deg, hsl(210 45% 12%) 0%, hsl(210 45% 18%) 40%, hsl(210 40% 22%) 100%)`
      }}>
        {/* ── Hero ── */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={heroImg} alt="Inclusive classroom in Africa" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(180deg, hsla(210, 45%, 12%, 0.92) 0%, hsla(210, 45%, 18%, 0.85) 60%, hsla(210, 45%, 18%, 0.95) 100%)`
            }} />
          </div>
          <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
            <img src={africaMapImg} alt="" className="w-[500px] h-auto opacity-[0.04]" aria-hidden="true" />
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
                style={{
                  background: `hsla(160, 84%, 25%, 0.15)`,
                  border: `1px solid hsla(160, 84%, 25%, 0.3)`,
                  color: `hsl(160, 70%, 50%)`
                }}
              >
                <School className="h-4 w-4" />
                Post-Award Legacy • SCEF / NESA-Africa Social Impact
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
                style={{ color: `hsl(210, 20%, 95%)` }}
              >
                Rebuild My School{" "}
                <span style={{ color: `hsl(42, 85%, 52%)` }}>Africa</span>
              </h1>

              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
                style={{ color: `hsla(210, 20%, 90%, 0.7)` }}
              >
                One special needs school per region — nominated by communities, selected by public vote,
                and upgraded through EduAid-Africa. Recognition becomes real impact.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate?program=rebuild">
                  <Button size="lg" className="gap-2 rounded-full text-white font-semibold"
                    style={{ background: `hsl(160, 84%, 25%)` }}
                  >
                    <Heart className="h-5 w-5" />
                    Support This Initiative
                  </Button>
                </Link>
                <Link to="/eduaid">
                  <Button variant="outline" size="lg" className="gap-2 rounded-full font-semibold"
                    style={{
                      borderColor: `hsla(42, 85%, 52%, 0.3)`,
                      color: `hsl(42, 85%, 52%)`
                    }}
                  >
                    Learn About EduAid-Africa
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── How It Works — 3 Phases ── */}
        <section className="py-16 md:py-20" style={{ borderBottom: `1px solid hsla(210, 20%, 90%, 0.1)` }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3"
                style={{ color: `hsl(210, 20%, 95%)` }}
              >
                How It <span style={{ color: `hsl(160, 70%, 50%)` }}>Works</span>
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: `hsla(210, 20%, 90%, 0.6)` }}>
                A transparent, community-driven process from nomination to intervention.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {timeline.map((step, index) => (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative rounded-2xl p-6 transition-all duration-300"
                  style={{
                    border: `1px solid hsla(210, 20%, 90%, 0.1)`,
                    background: `hsla(210, 40%, 20%, 0.5)`,
                  }}
                >
                  <span className="absolute -top-3 left-5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                    style={{ background: `hsl(160, 84%, 25%)` }}
                  >
                    Step {index + 1}
                  </span>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `hsla(160, 84%, 25%, 0.12)`,
                      border: `1px solid hsla(160, 84%, 25%, 0.2)`,
                    }}
                  >
                    <step.icon className="h-5 w-5" style={{ color: `hsl(160, 70%, 50%)` }} />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-1" style={{ color: `hsl(210, 20%, 95%)` }}>{step.phase}</h3>
                  <p className="text-xs font-medium mb-2" style={{ color: `hsla(42, 85%, 52%, 0.7)` }}>{step.period}</p>
                  <p className="text-sm leading-relaxed" style={{ color: `hsla(210, 20%, 90%, 0.6)` }}>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AGC Points Info ── */}
        <section className="py-8" style={{ borderBottom: `1px solid hsla(210, 20%, 90%, 0.1)` }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto rounded-xl p-5 flex items-start gap-4"
              style={{
                background: `hsla(160, 84%, 25%, 0.08)`,
                border: `1px solid hsla(160, 84%, 25%, 0.15)`,
              }}
            >
              <Coins className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: `hsl(42, 85%, 52%)` }} />
              <div>
                <p className="text-sm font-medium" style={{ color: `hsl(210, 20%, 95%)` }}>
                  Earn AGC Points for Impact
                </p>
                <p className="text-xs leading-relaxed mt-1" style={{ color: `hsla(210, 20%, 90%, 0.6)` }}>
                  Every contribution supports Rebuild My School Africa (2026–2027) and earns voting points
                  for your favorite regional school! Purchases from the{" "}
                  <Link to="/shop" className="underline" style={{ color: `hsl(160, 70%, 50%)` }}>NESA Shop</Link>
                  {" "}also fund EduAid-Africa + SCEF services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Five Regions Awaiting Nominations ── */}
        <section id="nominate" className="py-16 md:py-20" style={{ borderBottom: `1px solid hsla(210, 20%, 90%, 0.1)` }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3"
                style={{ color: `hsl(210, 20%, 95%)` }}
              >
                Five Regions, <span style={{ color: `hsl(42, 85%, 52%)` }}>Five Schools</span>
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: `hsla(210, 20%, 90%, 0.6)` }}>
                Schools will be nominated and voted on after the NESA-Africa 2025 ceremony. One winning school per region receives a full EduAid-Africa intervention.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {regions.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.06 }}
                  viewport={{ once: true }}
                  className="rounded-xl p-5 text-center transition-all duration-300"
                  style={{
                    border: `1px solid hsla(210, 20%, 90%, 0.1)`,
                    background: `hsla(210, 40%, 20%, 0.5)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: `hsla(42, 85%, 52%, 0.1)`,
                      border: `1px solid hsla(42, 85%, 52%, 0.15)`,
                    }}
                  >
                    <MapPin className="h-5 w-5" style={{ color: `hsl(42, 85%, 52%)` }} />
                  </div>
                  <h3 className="text-sm font-display font-bold mb-1.5" style={{ color: `hsl(210, 20%, 95%)` }}>{region.name}</h3>
                  <p className="text-[11px] leading-snug mb-2" style={{ color: `hsla(210, 20%, 90%, 0.5)` }}>{region.countries}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background: `hsla(42, 85%, 52%, 0.06)`,
                      color: `hsla(42, 85%, 52%, 0.6)`,
                      border: `1px solid hsla(42, 85%, 52%, 0.1)`,
                    }}
                  >
                    Awaiting Nominations
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Eligible School Types — Formal ── */}
        <section className="py-16 md:py-20" style={{ borderBottom: `1px solid hsla(210, 20%, 90%, 0.1)` }}>
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden"
              >
                <img src={formalSchoolImg} alt="Formal special needs school in Africa" className="w-full h-auto rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{
                  background: `linear-gradient(to top, hsla(210, 45%, 12%, 0.8), transparent)`
                }}>
                  <span className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ color: `hsl(160, 70%, 50%)`, background: `hsla(210, 45%, 12%, 0.7)` }}
                  >
                    Formal Special Needs Schools
                  </span>
                </div>
              </motion.div>

              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2"
                  style={{ color: `hsl(210, 20%, 95%)` }}
                >
                  Formal <span style={{ color: `hsl(160, 70%, 50%)` }}>Special Needs Schools</span>
                </h2>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: `hsla(210, 20%, 90%, 0.6)` }}>
                  Registered, accredited institutions providing structured education for children and young adults with disabilities.
                </p>

                <div className="space-y-3">
                  {formalSchoolTypes.map((type) => (
                    <div key={type.name} className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                      style={{
                        border: `1px solid hsla(210, 20%, 90%, 0.08)`,
                        background: `hsla(210, 40%, 20%, 0.3)`,
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `hsla(160, 84%, 25%, 0.12)` }}
                      >
                        <type.icon className="h-4 w-4" style={{ color: `hsl(160, 70%, 50%)` }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold" style={{ color: `hsl(210, 20%, 95%)` }}>{type.name}</h4>
                        <p className="text-xs leading-relaxed" style={{ color: `hsla(210, 20%, 90%, 0.5)` }}>{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Eligible School Types — Informal ── */}
        <section className="py-16 md:py-20" style={{ borderBottom: `1px solid hsla(210, 20%, 90%, 0.1)` }}>
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2"
                  style={{ color: `hsl(210, 20%, 95%)` }}
                >
                  Informal & <span style={{ color: `hsl(160, 70%, 50%)` }}>Community Schools</span>
                </h2>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: `hsla(210, 20%, 90%, 0.6)` }}>
                  Non-traditional learning environments filling gaps where formal systems don't reach — equally eligible for nomination and support.
                </p>

                <div className="space-y-3">
                  {informalSchoolTypes.map((type) => (
                    <div key={type.name} className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                      style={{
                        border: `1px solid hsla(210, 20%, 90%, 0.08)`,
                        background: `hsla(210, 40%, 20%, 0.3)`,
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `hsla(160, 84%, 25%, 0.12)` }}
                      >
                        <type.icon className="h-4 w-4" style={{ color: `hsl(160, 70%, 50%)` }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold" style={{ color: `hsl(210, 20%, 95%)` }}>{type.name}</h4>
                        <p className="text-xs leading-relaxed" style={{ color: `hsla(210, 20%, 90%, 0.5)` }}>{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2 space-y-4"
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <img src={informalSchoolImg} alt="Informal community school in rural Africa" className="w-full h-auto rounded-2xl" />
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{
                    background: `linear-gradient(to top, hsla(210, 45%, 12%, 0.8), transparent)`
                  }}>
                    <span className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ color: `hsl(160, 70%, 50%)`, background: `hsla(210, 45%, 12%, 0.7)` }}
                    >
                      Community-Based Learning
                    </span>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden">
                  <img src={vocationalImg} alt="Vocational training centre for young people with disabilities" className="w-full h-auto rounded-2xl" />
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{
                    background: `linear-gradient(to top, hsla(210, 45%, 12%, 0.8), transparent)`
                  }}>
                    <span className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ color: `hsl(160, 70%, 50%)`, background: `hsla(210, 45%, 12%, 0.7)` }}
                    >
                      Vocational & Skills Training
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Intervention Areas ── */}
        <section className="py-16 md:py-20" style={{ borderBottom: `1px solid hsla(210, 20%, 90%, 0.1)` }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3"
                  style={{ color: `hsl(210, 20%, 95%)` }}
                >
                  EduAid-Africa <span style={{ color: `hsl(160, 70%, 50%)` }}>Intervention Areas</span>
                </h2>
                <p className="max-w-xl mx-auto" style={{ color: `hsla(210, 20%, 90%, 0.6)` }}>
                  What winning schools receive — a comprehensive upgrade package delivered over 12 months.
                </p>
              </div>

              <div className="rounded-2xl p-6 md:p-8"
                style={{
                  border: `1px solid hsla(210, 20%, 90%, 0.1)`,
                  background: `hsla(210, 40%, 20%, 0.5)`,
                }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  {interventionAreas.map((area) => (
                    <div key={area} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: `hsl(160, 70%, 50%)` }} />
                      <span className="text-sm" style={{ color: `hsla(210, 20%, 95%, 0.8)` }}>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl p-4 flex items-start gap-3"
                style={{
                  border: `1px solid hsla(42, 85%, 52%, 0.15)`,
                  background: `hsla(42, 85%, 52%, 0.05)`,
                }}
              >
                <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: `hsl(42, 85%, 52%)` }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: `hsl(210, 20%, 95%)` }}>Intervention Period</p>
                  <p className="text-xs" style={{ color: `hsla(210, 20%, 90%, 0.5)` }}>October 2026 – June 2027 • Delivered by EduAid-Africa in partnership with local communities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ambassador / Volunteer Section ── */}
        <section className="py-16 md:py-20" style={{ borderBottom: `1px solid hsla(210, 20%, 90%, 0.1)` }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Users className="h-10 w-10 mx-auto mb-4 opacity-60" style={{ color: `hsl(160, 70%, 50%)` }} />
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3"
                style={{ color: `hsl(210, 20%, 95%)` }}
              >
                Join the Movement — Become an{" "}
                <span style={{ color: `hsl(42, 85%, 52%)` }}>EduAid Ambassador</span>
              </h2>
              <p className="text-sm mb-6 max-w-xl mx-auto leading-relaxed"
                style={{ color: `hsla(210, 20%, 90%, 0.6)` }}
              >
                Help drive post-award impact, community nominations, and school support.
                Earn AGC points for active volunteering and participation.
              </p>
              <Link to="/ambassadors">
                <Button size="lg" className="gap-2 rounded-full text-white font-semibold"
                  style={{
                    background: `hsl(160, 84%, 25%)`,
                    border: `1px solid hsla(160, 70%, 50%, 0.3)`,
                  }}
                >
                  <GraduationCap className="h-5 w-5" />
                  Become an Ambassador
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Globe className="h-12 w-12 mx-auto mb-6 opacity-60" style={{ color: `hsl(42, 85%, 52%)` }} />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4"
                style={{ color: `hsl(210, 20%, 95%)` }}
              >
                Be Part of the <span style={{ color: `hsl(42, 85%, 52%)` }}>Legacy</span>
              </h2>
              <p className="mb-8 max-w-xl mx-auto leading-relaxed"
                style={{ color: `hsla(210, 20%, 90%, 0.6)` }}
              >
                Whether as a donor, partner, or community nominator — your involvement helps transform
                special needs education across Africa. Nominations open after the NESA-Africa 2025 ceremony.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate?program=rebuild">
                  <Button size="lg" className="gap-2 rounded-full text-white font-semibold"
                    style={{ background: `hsl(160, 84%, 25%)` }}
                  >
                    <Heart className="h-5 w-5" />
                    Donate to EduAid-Africa
                  </Button>
                </Link>
                <Link to="/partners">
                  <Button variant="outline" size="lg" className="gap-2 rounded-full font-semibold"
                    style={{
                      borderColor: `hsla(42, 85%, 52%, 0.3)`,
                      color: `hsl(42, 85%, 52%)`,
                    }}
                  >
                    <Users className="h-5 w-5" />
                    Become a Partner
                  </Button>
                </Link>
              </div>

              <p className="text-xs mt-10" style={{ color: `hsla(210, 20%, 90%, 0.3)` }}>
                A post-award education social impact service of Santos Creations Educational Foundation • NESA-Africa 2025
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
