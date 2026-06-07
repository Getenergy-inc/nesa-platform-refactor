// Rebuild My School Africa — EduAid-Africa Special Needs School Intervention
// Public-facing landing & conversion page for /eduaid-africa/rebuild-my-school

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Shield,
  CheckCircle2,
  School,
  Heart,
  Plane,
  Mail,
  HandHeart,
  ClipboardList,
  Search,
  Users,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { IntegrityNotice } from "@/components/nominate/IntegrityNotice";
import { RMSA_REGIONAL_FORMS } from "@/config/nomination/rmsaRegionalForms";
import {
  REBUILD_MILESTONES,
  REBUILD_FUND_FLOW,
  REBUILD_BADGES,
} from "@/config/rebuildConfig";
import { RegionalLegacyEcosystem } from "@/components/nesa/RegionalLegacyEcosystem";
import africaMapImg from "@/assets/africa-map-silhouette.png";

// ─── Spec-driven content (kept inline so the page is self-contained) ──────────

const REGION_COUNTRIES: Record<string, string[]> = {
  "west-africa": [
    "Benin", "Cabo Verde", "Côte d'Ivoire", "The Gambia", "Ghana", "Guinea",
    "Guinea-Bissau", "Liberia", "Nigeria", "Senegal", "Sierra Leone", "Togo",
  ],
  "east-africa": ["Burundi", "Kenya", "Rwanda", "Tanzania", "Uganda"],
  "central-africa": [
    "Cameroon", "Central African Republic", "Republic of the Congo",
    "Democratic Republic of the Congo", "Equatorial Guinea", "Gabon",
    "São Tomé and Príncipe",
  ],
  "southern-africa": [
    "Angola", "Botswana", "Eswatini", "Lesotho", "Malawi", "Mozambique",
    "Namibia", "South Africa", "Zambia", "Zimbabwe",
  ],
  "north-africa": ["Algeria", "Egypt", "Libya", "Morocco", "Tunisia", "Western Sahara"],
  "sahel-africa": ["Burkina Faso", "Chad", "Mali", "Mauritania", "Niger", "Sudan"],
  "horn-of-africa": ["Djibouti", "Eritrea", "Ethiopia", "Somalia", "South Sudan"],
  "indian-ocean-islands": ["Comoros", "Madagascar", "Mauritius", "Seychelles", "Mayotte", "Réunion"],
};

const PROCESS_STEPS = [
  { icon: MapPin, title: "Select Your Region", body: "Choose one of the 8 Africa intervention regions." },
  { icon: ClipboardList, title: "Complete the Regional Google Form", body: "Submit school details, evidence, urgent needs, grant-service and EduTourism interest." },
  { icon: Search, title: "Data & Evidence Review", body: "Response is stored in the regional sheet and reviewed for completeness, duplicates and evidence quality." },
  { icon: FileCheck, title: "School Verification", body: "The school may be contacted for verification if valid contact details and consent are provided." },
  { icon: Users, title: "Regional Shortlist", body: "Qualified schools may be moved into a regional review shortlist." },
  { icon: Sparkles, title: "Intervention Planning", body: "Selected schools may move toward intervention planning after governance approval." },
  { icon: Plane, title: "EduTourism 2027 Commissioning", body: "Approved regional projects may be connected to EduAid-Africa EduTourism 2027 commissioning." },
];

const GRANT_SERVICES = [
  "School renovation grant",
  "Accessibility support grant",
  "Assistive technology support",
  "Learning materials support",
  "Teacher training support",
  "Inclusive education support",
  "Special needs learner welfare support",
  "ICT / digital learning support",
  "Sanitation and hygiene support",
  "Therapy / rehabilitation support",
  "School feeding support",
  "Safeguarding support",
  "General education intervention support",
];

const INTERVENTION_NEEDS: { title: string; items: string }[] = [
  { title: "Infrastructure & Renovation", items: "Classroom renovation, roof repair, wall repair, flooring, doors and windows, repainting, accessibility ramps, accessible walkways, safe fencing and gates, dormitory repair, therapy room, sick bay." },
  { title: "Accessibility & Mobility", items: "Wheelchairs, crutches, walking frames, mobility aids, accessible desks/chairs, accessible toilets, handrails, ramps, transport support, school-bus accessibility." },
  { title: "Assistive Technology", items: "Braille devices and books, screen readers, hearing aids, speech-support devices, communication boards, learning tablets, adaptive keyboards, learning software, special needs digital tools." },
  { title: "Learning Materials & Classroom Support", items: "Textbooks, exercise books, writing materials, special-education teaching aids, visual/audio learning materials, inclusive curriculum, sensory tools, classroom furniture, library materials." },
  { title: "Teacher & Staff Development", items: "Special needs teacher training, inclusive education, sign language, autism support, behavioural support, safeguarding, therapy support, digital learning, school leadership, parent engagement." },
  { title: "Health, Therapy & Safeguarding", items: "Health screening, therapy equipment, physiotherapy and occupational therapy equipment, counselling, safeguarding systems, first aid, hygiene kits, menstrual hygiene, child-protection reporting." },
  { title: "Water, Sanitation & Hygiene (WASH)", items: "Toilet renovation, accessible toilets, handwashing stations, clean water, borehole/water access, storage tanks, sanitation materials, hygiene education, waste management, bathroom renovation." },
  { title: "ICT & Digital Learning", items: "Computers, tablets, internet access, solar power, projectors, digital learning content, assistive software, ICT lab setup, teacher ICT training, e-learning access." },
  { title: "Feeding, Welfare & Learner Support", items: "School feeding, nutrition, uniforms, shoes, bags, learning kits, transport subsidy, boarding welfare, parent support, learner dignity kits." },
  { title: "Grant, Donation & Partnership", items: "Cash grants, material donations, CSR partnership, foundation grants, volunteer professional service, medical/technology partnership, media documentation, EduTourism commissioning, long-term school adoption." },
];

const EDUTOURISM_INTERESTS = [
  "Attend the commissioning event",
  "Join a school visit",
  "Volunteer during the visit",
  "Sponsor travel or logistics",
  "Donate learning materials",
  "Donate assistive technology",
  "Support media documentation",
  "Support teacher training",
  "Support school renovation",
  "Join a donor or CSR delegation",
  "Join an education tourism delegation",
  "Join post-project impact reporting",
];

const DONATION_OPTIONS = [
  "Cash donation", "Learning materials", "Assistive technology", "Accessibility equipment",
  "Mobility aids", "ICT / computers / tablets", "Books / library materials", "Classroom furniture",
  "Renovation materials", "Toilets / sanitation support", "School feeding support",
  "Teacher training sponsorship", "Volunteer professional service", "Media / documentation support",
  "Travel / logistics support", "CSR partnership", "Foundation grant support",
];

const VERIFICATION_STEPS = [
  "Submission completeness check",
  "Duplicate check",
  "Evidence review",
  "School identity review",
  "Special needs category review",
  "Regional eligibility review",
  "School contact verification",
  "Grant-service assessment",
  "Donor / CSR interest mapping",
  "EduTourism commissioning interest mapping",
  "Regional shortlist review",
  "Governance and integrity approval",
  "Website database synchronization where approved",
  "Intervention planning where selected",
];

const STATUS_BADGE: Record<string, string> = {
  Active: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300",
  "Link Pending": "bg-gold/10 border-gold/30 text-gold",
  "Coming Soon": "bg-white/5 border-white/20 text-white/60",
  Closed: "bg-red-500/15 border-red-400/30 text-red-300",
  Replaced: "bg-blue-500/15 border-blue-400/30 text-blue-300",
};

const nominateRoute = (slug: string) => `/impact/nominate-school?region=${slug}`;

const PLEDGE_RETURN = "/eduaid-africa/rebuild-my-school#donate";
const DONATE_PLEDGE_URL = `/donate?return_to=${encodeURIComponent(PLEDGE_RETURN)}`;

export default function RebuildHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("pledged") === "success") {
      setPledgeSuccess(true);
      // Scroll to the donate section and clean the URL param (keep the hash).
      const el = document.getElementById("donate");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      const next = new URLSearchParams(searchParams);
      next.delete("pledged");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <Helmet>
        <title>Rebuild My School Africa | EduAid-Africa Special Needs School Intervention</title>
        <meta
          name="description"
          content="Nominate a special needs school for the NESA-Africa 2026/2027 EduAid-Africa Special Needs School Intervention powered by Rebuild My School Africa. Select your region, submit school evidence, indicate grant-service needs, EduTourism 2027 interest, and donation or pledge support."
        />
        <meta property="og:title" content="Rebuild My School Africa — Special Needs School Intervention" />
        <meta
          property="og:description"
          content="Support special needs education across Africa through school nominations, regional verification, grant-service review, EduTourism 2027 commissioning interest, and Rebuild My School Africa donation or pledge support."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/eduaid-africa/rebuild-my-school" />
      </Helmet>

      <div className="min-h-screen bg-charcoal pb-20">
        {/* ── 1. HERO ── */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <img src={africaMapImg} alt="" className="w-[600px] h-auto opacity-[0.04]" aria-hidden="true" />
          </div>
          <div className="container relative z-10 max-w-4xl mx-auto px-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              {REBUILD_BADGES.map((badge) => (
                <span key={badge} className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-wider uppercase">
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Rebuild My School <span className="text-primary">Africa</span>
            </h1>
            <p className="text-gold/90 text-sm md:text-base font-semibold mb-4">
              EduAid-Africa Special Needs School Intervention · NESA-Africa 2026/2027
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Nominate a special needs school for possible support through the NESA-Africa 2026/2027
              EduAid-Africa Special Needs School Intervention powered by Rebuild My School Africa.
            </p>
            <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-8">
              Rebuild My School Africa connects education recognition with practical school intervention. Through
              EduAid-Africa, NESA-Africa invites the public, chapters, volunteers, donors, CSR partners, diaspora
              supporters, teachers, parents, NGOs and community members to identify special needs schools that
              may require renovation, accessibility support, assistive technology, inclusive learning materials,
              teacher training, sanitation, ICT and learner welfare support.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/impact/nominate-school">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold gap-2">
                  <School className="h-4 w-4" /> Nominate a Special Needs School
                </Button>
              </Link>
              <a href="#donate">
                <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 gap-2">
                  <Heart className="h-4 w-4" /> Donate or Pledge Support
                </Button>
              </a>
              <a href="#edutourism">
                <Button size="lg" variant="ghost" className="text-white/80 hover:text-gold hover:bg-white/5 gap-2">
                  <Plane className="h-4 w-4" /> Learn About EduTourism 2027
                </Button>
              </a>
              <a href="#regions">
                <Button size="lg" variant="ghost" className="text-white/80 hover:text-gold hover:bg-white/5 gap-2">
                  <MapPin className="h-4 w-4" /> View Regional Intervention Model
                </Button>
              </a>
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
              <IntegrityNotice variant="compact" />
            </div>
          </div>
        </section>

        {/* ── 2. WHAT IS RMSA? ── */}
        <section className="py-14 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 text-center">
              What Is <span className="text-primary">Rebuild My School Africa?</span>
            </h2>
            <div className="space-y-4 text-white/70 text-sm md:text-base leading-relaxed">
              <p>
                Rebuild My School Africa is an education intervention initiative designed to identify, review,
                support and promote schools that require urgent learning-environment improvement.
              </p>
              <p>
                For the NESA-Africa 2026/2027 cycle, the program focuses on special needs schools across 8
                Africa intervention regions. The goal is to collect credible school nominations, verify evidence,
                assess intervention needs, build regional shortlists, mobilize donor and CSR support, and prepare
                selected schools for possible 2026/2027 intervention planning.
              </p>
              <p className="text-white/55 italic">
                This page does not guarantee school selection. It creates a structured pathway for school
                identification, evidence review, regional verification, grant-service assessment, donor interest,
                EduTourism commissioning interest and future impact reporting.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. EDUAID-AFRICA INTERVENTION ── */}
        <section className="py-14 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 text-center">
              EduAid-Africa <span className="text-primary">Special Needs School Intervention</span>
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed text-center max-w-3xl mx-auto mb-8">
              The EduAid-Africa Special Needs School Intervention supports the identification and review of schools
              serving learners with disabilities, learning difficulties, developmental needs, communication needs,
              physical disabilities, visual and hearing impairment, autism, multiple disabilities, and inclusive
              education needs.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-3xl mx-auto">
              {[
                "School identity", "Country and region", "Special needs categories served",
                "Learner population", "Urgent intervention needs", "Evidence quality",
                "Verification readiness", "Grant-service need", "Donor / CSR interest",
                "EduTourism 2027 readiness", "Intervention planning potential",
              ].map((tag) => (
                <span key={tag} className="text-[11px] md:text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70 text-center">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. HOW THE PROCESS WORKS ── */}
        <section className="py-14 border-t border-primary/10">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              How the Regional School Nomination <span className="text-primary">Process Works</span>
            </h2>
            <p className="text-white/50 text-sm text-center mb-10">
              Seven structured steps from nomination to intervention.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PROCESS_STEPS.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-white text-sm font-semibold mb-1">{s.title}</p>
                  <p className="text-white/50 text-[11px] leading-snug">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5 + 6. EIGHT REGIONS + NOMINATE ── */}
        <section id="regions" className="py-14 border-t border-primary/10">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              Eight Africa <span className="text-primary">Intervention Regions</span>
            </h2>
            <p className="text-white/50 text-sm text-center mb-10 max-w-2xl mx-auto">
              Each region has a dedicated Google Form, response sheet, review workflow and regional evidence trail.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RMSA_REGIONAL_FORMS.map((region) => {
                const countries = REGION_COUNTRIES[region.slug] ?? [];
                const badge = STATUS_BADGE[region.status] ?? STATUS_BADGE["Link Pending"];
                return (
                  <div key={region.slug} className="rounded-2xl border border-primary/15 bg-charcoal-light/30 p-5 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg border border-primary/25 bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-white text-base font-display font-semibold">{region.region}</h3>
                      </div>
                      <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold", badge)}>
                        {region.status}
                      </span>
                    </div>

                    <p className="text-white/55 text-xs leading-snug mb-3">
                      {region.shortDescription}
                    </p>

                    {countries.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">Countries Covered</p>
                        <div className="flex flex-wrap gap-1">
                          {countries.map((c) => (
                            <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/65">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto space-y-2">
                      <Link to={nominateRoute(region.slug)}>
                        <Button className="w-full bg-gold hover:bg-gold/90 text-charcoal font-semibold gap-2 h-9 text-xs">
                          <School className="h-3.5 w-3.5" /> Nominate a School in {region.region}
                        </Button>
                      </Link>
                      {region.status === "Link Pending" && (
                        <p className="text-[10px] text-white/45 leading-snug">
                          This regional nomination form is being prepared. Please check back soon or contact{" "}
                          <a href="mailto:nesa.africa@gmail.com" className="text-gold hover:underline">nesa.africa@gmail.com</a>.
                        </p>
                      )}
                      {region.status === "Closed" && (
                        <p className="text-[10px] text-white/45">This regional nomination form is currently closed.</p>
                      )}
                      <p className="text-[10px] text-white/35 flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3" /> Routing: {region.gmail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link to="/impact/nominate-school">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold gap-2">
                  Open Regional School Nomination Forms <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 7. GRANT SERVICES ── */}
        <section className="py-14 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              EduAid-Africa Special Needs Schools <span className="text-primary">Grant Services</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base text-center max-w-3xl mx-auto mb-8 leading-relaxed">
              Nominated schools may be reviewed for grant-service needs, intervention classification and support
              planning. <span className="text-gold font-semibold">Grant-service interest does not guarantee grant approval.</span>{" "}
              All schools must pass evidence review, regional verification, governance review and intervention planning.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
              {GRANT_SERVICES.map((g, i) => (
                <div key={g} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 flex items-start gap-2">
                  <span className="text-[10px] font-bold text-primary mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-white/75 text-xs leading-snug">{g}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/impact/nominate-school">
                <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 gap-2">
                  Nominate a School for Grant-Service Review <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 8. INTERVENTION NEEDS (accordion) ── */}
        <section className="py-14 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              Special Needs School <span className="text-primary">Intervention Needs</span>
            </h2>
            <p className="text-white/50 text-sm text-center mb-8">
              10 intervention areas — selectable during nomination and evidence review.
            </p>
            <Accordion type="single" collapsible className="space-y-2">
              {INTERVENTION_NEEDS.map((n) => (
                <AccordionItem
                  key={n.title}
                  value={n.title}
                  className="border border-white/10 bg-white/5 rounded-xl px-4 data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-white text-sm font-semibold hover:no-underline">
                    {n.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/65 text-xs leading-relaxed">
                    {n.items}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── 9. EDUTOURISM 2027 ── */}
        <section id="edutourism" className="py-14 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              EduAid-Africa <span className="text-primary">EduTourism 2027 Commissioning</span>
            </h2>
            <p className="text-white/65 text-sm md:text-base text-center max-w-3xl mx-auto mb-8 leading-relaxed">
              EduAid-Africa EduTourism 2027 will support regional education-impact visits, learning tours, school
              engagement, project commissioning, donor visibility, volunteer participation, CSR engagement, and
              education tourism around selected regional interventions.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
              {EDUTOURISM_INTERESTS.map((opt) => (
                <div key={opt} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/70 text-xs flex items-start gap-2">
                  <Plane className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" /> {opt}
                </div>
              ))}
            </div>
            <div className="text-center mb-6">
              <Link to="/impact/nominate-school">
                <Button className="bg-gold hover:bg-gold/90 text-charcoal font-semibold gap-2">
                  Register Interest in EduTourism 2027 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-white/45 text-xs text-center italic">
              EduTourism interest does not influence school selection.
            </p>
          </div>
        </section>

        {/* ── 10. DONATE / PLEDGE (inline, no fake payment) ── */}
        <section id="donate" className="py-14 border-t border-primary/10 scroll-mt-20">
          <div className="container max-w-4xl mx-auto px-4">
            {pledgeSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 flex items-start gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0 mt-0.5" />
                <div className="text-sm text-white/85">
                  <p className="font-semibold text-emerald-200 mb-0.5">Pledge recorded — thank you.</p>
                  <p className="text-white/70 text-xs leading-relaxed">
                    Your interest in supporting Rebuild My School Africa has been logged. The SCEF /
                    NESA-Africa partnerships team will follow up. No payment was processed.
                  </p>
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <HandHeart className="h-5 w-5 text-gold" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-bold">Pledge Interest</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                I Would Like to <span className="text-primary">Donate to Rebuild My School Africa</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
                This section allows individuals, companies, CSR partners, donors, NGOs, foundations, diaspora
                supporters and friends of Africa to indicate interest in supporting Rebuild My School Africa and
                the EduAid-Africa Special Needs School Intervention.
              </p>

              <p className="text-[11px] uppercase tracking-wider text-white/50 mb-2">Pledge & Donation Options</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 mb-6">
                {DONATION_OPTIONS.map((d) => (
                  <div key={d} className="text-[11px] px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-white/70">
                    {d}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mb-5">
                <Link to={DONATE_PLEDGE_URL}>
                  <Button className="bg-gold hover:bg-gold/90 text-charcoal font-semibold gap-2">
                    <Heart className="h-4 w-4" /> Pledge Support
                  </Button>
                </Link>
                <Link to="/impact/nominate-school">
                  <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 gap-2">
                    Donation Interest
                  </Button>
                </Link>
                <a href="mailto:nesa.africa@gmail.com?subject=RMSA%20Donation%20Follow-Up">
                  <Button variant="ghost" className="text-white/80 hover:text-gold hover:bg-white/5 gap-2">
                    <Mail className="h-4 w-4" /> Request Donation Follow-Up
                  </Button>
                </a>
              </div>

              <p className="text-white/45 text-[11px] leading-relaxed">
                Payment backend may not be active at all times. When unavailable, this remains a pledge / interest
                flow — no payment confirmation is shown. Pledges are followed up by the SCEF / NESA-Africa finance
                and partnerships team.
              </p>
            </div>
            <div className="mt-6">
              <IntegrityNotice />
            </div>
          </div>
        </section>

        {/* ── 11. INTEGRITY & SELECTION RULES ── */}
        <section className="py-14 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-5 text-center">
              Integrity and <span className="text-primary">Selection Rules</span>
            </h2>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4 text-white/75 text-sm leading-relaxed">
              <p>
                Donation, pledge, sponsorship, public support, media visibility, endorsement, EduTourism
                participation, regional voting, donation-supported voting, AGC participation, or AGC Voting Coin
                participation does <span className="text-gold font-semibold">not</span> guarantee that any school
                will be selected as a beneficiary.
              </p>
              <p>
                All school selections must pass eligibility review, evidence review, regional verification,
                governance approval, intervention planning and NESA-Africa / EduAid-Africa / Rebuild My School
                Africa integrity review.
              </p>
              <p className="text-white/85 font-medium">
                No donor, sponsor, supporter, visitor, partner, public participant, media partner or EduTourism
                participant may buy school selection.
              </p>
            </div>
          </div>
        </section>

        {/* ── 12. DATA, EVIDENCE & VERIFICATION ── */}
        <section className="py-14 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              Data, Evidence and <span className="text-primary">Verification Process</span>
            </h2>
            <p className="text-white/50 text-sm text-center mb-8">
              Every school nomination passes through 14 review stages.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {VERIFICATION_STEPS.map((step, i) => (
                <div key={step} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-white/75 text-xs leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 13. IMPACT REPORTING & TRANSPARENCY (legacy timeline + fund flow + ecosystem) ── */}
        <section className="py-14 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Impact Reporting & <span className="text-primary">Transparency</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {REBUILD_MILESTONES.map((m, i) => (
                <div key={m.label} className="relative rounded-xl p-4 border border-primary/15 bg-primary/5 text-center">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-secondary text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <m.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-white text-xs font-semibold mb-0.5">{m.displayDate}</p>
                  <p className="text-white/50 text-[11px] leading-snug">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm font-medium">Fund Flow & Governance</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {REBUILD_FUND_FLOW.map((step, i) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="text-white/70 text-xs">{step}</span>
                    {i < REBUILD_FUND_FLOW.length - 1 && <ArrowRight className="h-3 w-3 text-primary/40" />}
                  </span>
                ))}
              </div>
              <p className="text-white/40 text-[11px]">
                No funds are disbursed without formal board approval and audit logs.
              </p>
            </div>
          </div>
        </section>

        <RegionalLegacyEcosystem />

        {/* ── 14. FINAL CTA ── */}
        <section className="py-16 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 md:p-8">
              <CheckCircle2 className="h-6 w-6 text-gold mx-auto mb-3" />
              <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-3">
                Help us identify the next special needs schools for intervention
              </h3>
              <p className="text-white/65 text-sm leading-relaxed mb-5">
                One page. Eight regions. One regional nomination pathway. Clean evidence. Clear integrity.
                No fake selection. No fake payment. A verified route toward special needs school intervention.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/impact/nominate-school">
                  <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold gap-2">
                    <School className="h-4 w-4" /> Nominate a Special Needs School
                  </Button>
                </Link>
                <Link to={DONATE_PLEDGE_URL}>
                  <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 gap-2">
                    <Heart className="h-4 w-4" /> Donate or Pledge Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
