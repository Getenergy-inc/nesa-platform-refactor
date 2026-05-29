// Regional Legacy Impact Ecosystem
// 8 approved legacy regions connecting NESA-Africa Awards → EduAid-Africa
// Conferences → Special Needs School Nominations → Regional Voting →
// GFA Wzip Regional Wallets → Rebuild My School Africa Interventions
// (Oct 2026 – Oct 2027).

import { motion } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  Globe2,
  Wallet,
  GraduationCap,
  Accessibility,
  Plane,
  HandCoins,
  School,
  Heart,
  Sparkles,
  Users,
  BookOpen,
  Vote,
  ShieldCheck,
  ClipboardCheck,
  Map as MapIcon,
  Coins,
  Award,
  FileBarChart,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Phase =
  | "Nomination Opens Soon"
  | "Verification Ongoing"
  | "Voting Opens Soon"
  | "Funding Portal Opens Soon"
  | "Fundraising Active"
  | "Intervention Pending"
  | "Impact Reporting";

type LegacyRegion = {
  slug: string;
  index: number;
  name: string;
  shortName: string;
  leadCountry: string;
  conferenceDestination: string;
  conferenceCountries?: string[];
  conferenceWindow?: string;
  theme: string;
  legacyProject: string;
  legacyTracks: string[];
  wallet: string;
  walletProgress: number;
  nominationStatus: Phase;
  votingStatus: Phase;
  fundingStatus: Phase;
  metrics: { schools: string; specialNeeds: string; scholarships: string; goal: string };
  paths: {
    explore: string;
    nominate: string;
    vote: string;
    donate: string;
    tourism: string;
    partner: string;
  };
};

const REGIONS: LegacyRegion[] = [
  {
    slug: "west-africa",
    index: 1,
    name: "West Africa Regional Legacy Hub",
    shortName: "West Africa",
    leadCountry: "Ghana",
    conferenceDestination: "Accra, Ghana",
    conferenceCountries: [
      "Nigeria","Ghana","Senegal","Côte d'Ivoire","Benin","Togo","Burkina Faso",
      "Mali","Niger","Guinea","Guinea-Bissau","Sierra Leone","Liberia","Gambia",
      "Cape Verde","Mauritania",
    ],
    theme: "Education Access, Teacher Development & Youth Leadership",
    legacyProject: "Rural & Special Needs School Support",
    legacyTracks: [
      "Rural School Support",
      "Community Libraries",
      "Special Needs Education",
      "Learning Materials",
    ],
    wallet: "West Africa Legacy Wallet",
    walletProgress: 42,
    nominationStatus: "Nomination Opens Soon",
    votingStatus: "Voting Opens Soon",
    fundingStatus: "Funding Portal Opens Soon",
    metrics: { schools: "120", specialNeeds: "18", scholarships: "250", goal: "$450K" },
    paths: pathsFor("west-africa"),
  },
  {
    slug: "east-africa",
    index: 2,
    name: "East Africa Regional Legacy Hub",
    shortName: "East Africa",
    leadCountry: "Kenya",
    conferenceDestination: "Nairobi, Kenya",
    conferenceCountries: [
      "Kenya","Ethiopia","Tanzania","Uganda","Rwanda","Burundi","South Sudan",
      "Somalia","Djibouti","Eritrea","Malawi","Mozambique","Zambia","Zimbabwe",
    ],
    theme: "Digital Learning & STEM Education",
    legacyProject: "STEM & Assistive Tech for Special Needs Schools",
    legacyTracks: [
      "School Technology Access",
      "STEM Labs",
      "Teacher Training",
      "Special Needs Education",
    ],
    wallet: "East Africa Legacy Wallet",
    walletProgress: 38,
    nominationStatus: "Nomination Opens Soon",
    votingStatus: "Voting Opens Soon",
    fundingStatus: "Funding Portal Opens Soon",
    metrics: { schools: "95", specialNeeds: "14", scholarships: "200", goal: "$400K" },
    paths: pathsFor("east-africa"),
  },
  {
    slug: "central-africa",
    index: 3,
    name: "Central Africa Regional Legacy Hub",
    shortName: "Central Africa",
    leadCountry: "Rwanda",
    conferenceDestination: "Kigali, Rwanda",
    theme: "Community Learning & Education Recovery",
    legacyProject: "Inclusive Education Recovery Centers",
    legacyTracks: [
      "Learning Resource Centers",
      "School Rehabilitation",
      "Inclusive Education",
    ],
    wallet: "Central Africa Legacy Wallet",
    walletProgress: 28,
    nominationStatus: "Nomination Opens Soon",
    votingStatus: "Voting Opens Soon",
    fundingStatus: "Funding Portal Opens Soon",
    metrics: { schools: "70", specialNeeds: "12", scholarships: "150", goal: "$300K" },
    paths: pathsFor("central-africa"),
  },
  {
    slug: "southern-africa",
    index: 4,
    name: "Southern Africa Regional Legacy Hub",
    shortName: "Southern Africa",
    leadCountry: "South Africa",
    conferenceDestination: "Johannesburg, South Africa",
    theme: "Skills Development & Inclusive Learning",
    legacyProject: "Accessibility & Inclusive Learning Projects",
    legacyTracks: [
      "School Support",
      "Accessibility Projects",
      "Special Needs Education",
    ],
    wallet: "Southern Africa Legacy Wallet",
    walletProgress: 44,
    nominationStatus: "Nomination Opens Soon",
    votingStatus: "Voting Opens Soon",
    fundingStatus: "Funding Portal Opens Soon",
    metrics: { schools: "110", specialNeeds: "20", scholarships: "220", goal: "$420K" },
    paths: pathsFor("southern-africa"),
  },
  {
    slug: "north-africa",
    index: 5,
    name: "North Africa Regional Legacy Hub",
    shortName: "North Africa",
    leadCountry: "Morocco",
    conferenceDestination: "Rabat, Morocco",
    theme: "Research, Innovation & Education Partnerships",
    legacyProject: "Research Libraries & Inclusive Innovation Labs",
    legacyTracks: ["Libraries", "Research Centers", "Learning Innovation"],
    wallet: "North Africa Legacy Wallet",
    walletProgress: 22,
    nominationStatus: "Nomination Opens Soon",
    votingStatus: "Voting Opens Soon",
    fundingStatus: "Funding Portal Opens Soon",
    metrics: { schools: "60", specialNeeds: "10", scholarships: "140", goal: "$300K" },
    paths: pathsFor("north-africa"),
  },
  {
    slug: "indian-ocean-islands",
    index: 6,
    name: "Indian Ocean Islands Regional Legacy Hub",
    shortName: "Indian Ocean Islands",
    leadCountry: "Seychelles",
    conferenceDestination: "Seychelles · 15–24 October 2027",
    conferenceCountries: ["Seychelles", "Mauritius", "Madagascar", "Comoros"],
    conferenceWindow:
      "EduAid-Africa Indian Ocean Islands Edu-Tourism Conference · 15–24 October 2027",
    theme:
      "Girls' Education, Gender Inclusion, Safeguarding & Inclusive Education Support",
    legacyProject: "Special Needs School Accessibility & Inclusive Learning",
    legacyTracks: [
      "Special Needs Schools",
      "Accessibility Support",
      "Girls Education",
      "Inclusive Learning",
    ],
    wallet: "Indian Ocean Islands Legacy Wallet",
    walletProgress: 18,
    nominationStatus: "Nomination Opens Soon",
    votingStatus: "Voting Opens Soon",
    fundingStatus: "Funding Portal Opens Soon",
    metrics: { schools: "40", specialNeeds: "15", scholarships: "120", goal: "$260K" },
    paths: pathsFor("indian-ocean-islands"),
  },
  {
    slug: "diaspora",
    index: 7,
    name: "African Diaspora Legacy Hub",
    shortName: "African Diaspora",
    leadCountry: "United Kingdom",
    conferenceDestination: "London, United Kingdom",
    theme: "Diaspora Education Investment & Knowledge Transfer",
    legacyProject: "Diaspora-Sponsored Special Needs Scholarships",
    legacyTracks: ["Scholarships", "Exchange Programs", "Education Technology"],
    wallet: "African Diaspora Legacy Wallet",
    walletProgress: 33,
    nominationStatus: "Nomination Opens Soon",
    votingStatus: "Voting Opens Soon",
    fundingStatus: "Funding Portal Opens Soon",
    metrics: { schools: "55", specialNeeds: "9", scholarships: "300", goal: "$500K" },
    paths: pathsFor("diaspora"),
  },
  {
    slug: "friends-of-africa",
    index: 8,
    name: "Friends of Africa Global Legacy Hub",
    shortName: "Friends of Africa",
    leadCountry: "United States",
    conferenceDestination: "New York, United States",
    theme: "Global Partnerships for African Education",
    legacyProject: "Global CSR for Special Needs School Infrastructure",
    legacyTracks: ["CSR Education Funds", "School Support", "Scholarship Programs"],
    wallet: "Friends of Africa Global Legacy Wallet",
    walletProgress: 26,
    nominationStatus: "Nomination Opens Soon",
    votingStatus: "Voting Opens Soon",
    fundingStatus: "Funding Portal Opens Soon",
    metrics: { schools: "65", specialNeeds: "11", scholarships: "280", goal: "$480K" },
    paths: pathsFor("friends-of-africa"),
  },
];

function pathsFor(slug: string) {
  return {
    explore: `/region/${slug}`,
    nominate: `https://eduaid.africa/nominate-school?region=${slug}`,
    vote: `/legacy/${slug}/vote`,
    donate: `/legacy/${slug}#donate`,
    tourism: `/eduaid/waiting-list?region=${slug}`,
    partner: `/partners?region=${slug}`,
  };
}

const PHASE_TONE: Record<Phase, string> = {
  "Nomination Opens Soon": "bg-gold/15 text-gold border-gold/40",
  "Verification Ongoing": "bg-amber-500/15 text-amber-300 border-amber-500/40",
  "Voting Opens Soon": "bg-gold/10 text-gold border-gold/30",
  "Funding Portal Opens Soon": "bg-ivory/10 text-ivory/85 border-ivory/20",
  "Fundraising Active": "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  "Intervention Pending": "bg-ivory/10 text-ivory/85 border-ivory/20",
  "Impact Reporting": "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
};

function StatusBadge({ icon: Icon, label, phase }: { icon: React.ComponentType<{ className?: string }>; label: string; phase: Phase }) {
  return (
    <div className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-[10px] ${PHASE_TONE[phase]}`}>
      <span className="flex items-center gap-1.5 font-semibold">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <span className="font-bold tracking-tight">{phase}</span>
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="rounded-lg border border-gold/15 bg-charcoal/50 p-2 text-center">
      <Icon className="h-3.5 w-3.5 text-gold mx-auto mb-1" />
      <div className="text-sm font-bold text-ivory leading-none">{value}</div>
      <div className="text-[9px] uppercase tracking-wide text-ivory/55 mt-1">{label}</div>
    </div>
  );
}

function RegionCard({ region }: { region: LegacyRegion }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className="group relative flex flex-col rounded-2xl border border-gold/20 bg-charcoal/70 backdrop-blur-sm overflow-hidden hover:border-gold/50 hover:shadow-[0_0_40px_-15px_hsl(var(--gold)/0.5)] transition-all"
    >
      <div className="relative p-5 border-b border-gold/15 bg-gradient-to-br from-gold/10 via-transparent to-transparent">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest">
            Region {region.index}
          </span>
          <span className="inline-flex items-center gap-1 text-ivory/60 text-[11px]">
            <MapPin className="h-3 w-3 text-gold" /> {region.leadCountry}
          </span>
        </div>
        <h3 className="font-display text-lg md:text-xl font-bold text-ivory leading-tight">
          {region.name}
        </h3>
        <p className="mt-2 text-xs text-gold/90 font-medium">{region.theme}</p>
        <p className="mt-2 inline-flex items-start gap-1.5 text-[11px] text-ivory/70">
          <Plane className="h-3 w-3 mt-0.5 text-gold shrink-0" />
          <span>
            {region.conferenceWindow ?? `EduAid-Africa Edu-Tourism Conference · ${region.conferenceDestination}`}
          </span>
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {region.conferenceCountries && (
          <div className="flex flex-wrap gap-1.5">
            {region.conferenceCountries.map((c) => (
              <span key={c} className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px]">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* 2026–2027 Legacy Project */}
        <div className="rounded-xl border border-gold/20 bg-charcoal/60 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ivory/55 mb-1.5">
            <School className="h-3 w-3 text-gold" /> 2026–2027 Special Needs Legacy Project
          </div>
          <p className="text-[12px] font-semibold text-ivory">{region.legacyProject}</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
            {region.legacyTracks.map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-[11px] text-ivory/75">
                <Sparkles className="h-3 w-3 mt-0.5 text-gold shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Status badges */}
        <div className="grid gap-1.5">
          <StatusBadge icon={School} label="Nomination" phase={region.nominationStatus} />
          <StatusBadge icon={Vote} label="Voting" phase={region.votingStatus} />
          <StatusBadge icon={Wallet} label="Funding" phase={region.fundingStatus} />
        </div>

        {/* GFA Wzip wallet */}
        <div className="rounded-xl border border-gold/20 bg-charcoal/60 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ivory">
              <Wallet className="h-3.5 w-3.5 text-gold" /> GFA Wzip · {region.wallet}
            </div>
            <span className="text-[11px] text-gold font-bold">{region.walletProgress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-ivory/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold to-gold-dark" style={{ width: `${region.walletProgress}%` }} />
          </div>
          <p className="mt-1.5 text-[10px] text-ivory/55">
            Goal {region.metrics.goal} · Fed by 5% of every sponsorship.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <Metric icon={School} value={region.metrics.schools} label="Schools" />
          <Metric icon={Accessibility} value={region.metrics.specialNeeds} label="Special Needs" />
          <Metric icon={GraduationCap} value={region.metrics.scholarships} label="Scholarships" />
        </div>

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <a href={region.paths.nominate} target="_blank" rel="noreferrer">
            <Button size="sm" className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full text-[11px]">
              <School className="h-3.5 w-3.5 mr-1" /> Nominate a Special Needs School
            </Button>
          </a>
          <div className="grid grid-cols-2 gap-2">
            <Link to={region.paths.vote}>
              <Button variant="outline" size="sm" className="w-full border-gold/40 text-gold hover:bg-gold/10 rounded-full text-[11px]">
                <Vote className="h-3 w-3 mr-1" /> Vote
              </Button>
            </Link>
            <Link to={region.paths.donate}>
              <Button variant="outline" size="sm" className="w-full border-gold/40 text-gold hover:bg-gold/10 rounded-full text-[11px]">
                <HandCoins className="h-3 w-3 mr-1" /> Donate
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to={region.paths.tourism}>
              <Button variant="ghost" size="sm" className="w-full text-[11px] text-ivory/85 hover:text-gold hover:bg-gold/10 rounded-full border border-ivory/10">
                <Plane className="h-3 w-3 mr-1" /> Edu-Tourism
              </Button>
            </Link>
            <Link to={region.paths.partner}>
              <Button variant="ghost" size="sm" className="w-full text-[11px] text-ivory/85 hover:text-gold hover:bg-gold/10 rounded-full border border-ivory/10">
                <Heart className="h-3 w-3 mr-1" /> Partner
              </Button>
            </Link>
          </div>
          <Link to={region.paths.explore} className="text-center text-[11px] text-gold/90 hover:text-gold inline-flex items-center justify-center gap-1">
            Explore Region <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

const FLOW_STEPS: { icon: React.ComponentType<{ className?: string }>; title: string; copy: string }[] = [
  { icon: School, title: "Nominate a Special Needs School", copy: "Nominations open on EduAid.Africa for a defined campaign window." },
  { icon: ClipboardCheck, title: "Verify School Information", copy: "EduAid-Africa & RMSA review need level, evidence, location and relevance." },
  { icon: MapIcon, title: "Map School to Region", copy: "Each approved school is assigned to one of the eight legacy hubs." },
  { icon: Vote, title: "Open Regional Voting", copy: "Communities, supporters, chapters and the public vote per region." },
  { icon: Coins, title: "Activate Regional Funding Portal", copy: "GFA Wzip Legacy Wallet opens for donations, CSR and crowdfunding." },
  { icon: Award, title: "Select Intervention Beneficiaries", copy: "Selection blends verified need, voting outcome and funding readiness." },
  { icon: Wrench, title: "Implement Legacy Project", copy: "Infrastructure, accessibility, assistive tech, teacher and learning support." },
  { icon: FileBarChart, title: "Publish Impact Report", copy: "Each region publishes donor records, media and final impact reports." },
];

export function RegionalLegacyEcosystem() {
  return (
    <section className="relative py-16 md:py-24 bg-charcoal overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--gold)/0.08),transparent_60%)]" />
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Globe2 className="h-3.5 w-3.5" /> Continental Impact Ecosystem
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ivory mb-4 leading-tight">
            Explore Africa's Regions &{" "}
            <span className="text-gold">2027 Special Needs School Legacy Projects</span>
          </h2>
          <p className="text-ivory/75 text-sm md:text-base leading-relaxed">
            One Continent. Eight Legacy Regions. School nominations, regional voting,
            EduAid-Africa conferences, and Rebuild My School Africa interventions.
          </p>
        </motion.div>

        {/* RMSA 2026–2027 Model explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-charcoal/60 to-charcoal/80 p-6 md:p-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="h-3 w-3" /> Rebuild My School Africa · 2026–2027 Model
          </div>
          <p className="text-ivory/85 text-sm md:text-base leading-relaxed">
            After the NESA-Africa 2026 Awards, the campaign moves from recognition into
            measurable education intervention through{" "}
            <span className="text-gold font-semibold">Rebuild My School Africa</span> and{" "}
            <span className="text-gold font-semibold">EduAid-Africa</span>. For the
            2026–2027 legacy phase, special needs schools and inclusive education
            institutions will be nominated through{" "}
            <a href="https://eduaid.africa" target="_blank" rel="noreferrer" className="text-gold underline underline-offset-4">
              EduAid.Africa
            </a>{" "}
            during an approved nomination window. Each school is mapped to one of the eight
            approved legacy regions, may enter a regional public voting process, and may
            qualify for intervention based on verified need, regional relevance, and
            community participation. Each region also has a dedicated funding portal and{" "}
            <span className="text-gold font-semibold">GFA Wzip Regional Legacy Wallet</span>{" "}
            for donations, CSR, sponsorships and crowdfunding.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="https://eduaid.africa/nominate-school" target="_blank" rel="noreferrer">
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-5">
                <School className="h-4 w-4" /> Nominate a Special Needs School on EduAid.Africa
              </Button>
            </a>
            <Link to="/eduaid/rebuild">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2 px-5">
                View Legacy Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 8-step Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h3 className="font-display text-xl md:text-2xl font-bold text-ivory text-center mb-2">
            Regional School Nomination Flow
          </h3>
          <p className="text-center text-ivory/60 text-xs md:text-sm mb-6">
            Region → Conference → Nomination → Voting → Funding → Intervention → Impact
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FLOW_STEPS.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-gold/20 bg-charcoal/60 p-3 hover:border-gold/45 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-6 w-6 rounded-full bg-gold text-charcoal text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <s.icon className="h-4 w-4 text-gold" />
                </div>
                <h4 className="text-[12px] font-bold text-ivory leading-snug mb-1">{s.title}</h4>
                <p className="text-[11px] text-ivory/65 leading-snug">{s.copy}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Region grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {REGIONS.map((r) => (
            <RegionCard key={r.slug} region={r} />
          ))}
        </div>

        {/* Legacy Funding Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal/60 to-charcoal/80 p-6 md:p-10"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
                <Heart className="h-3 w-3" /> Every Sponsorship Creates Impact
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
                5% of every approved sponsorship feeds the{" "}
                <span className="text-gold">RMSA Legacy Fund</span>
              </h3>
              <p className="text-ivory/75 text-sm md:text-base leading-relaxed">
                Contributions are distributed equally into the eight{" "}
                <span className="text-gold font-semibold">GFA Wzip Regional Legacy Wallets</span>{" "}
                — funding school interventions, special needs schools, inclusive learning,
                scholarships, learning access and regional education initiatives between
                October 2026 and October 2027.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: School, label: "School Interventions" },
                { icon: Accessibility, label: "Special Needs Schools" },
                { icon: Users, label: "Inclusive Learning" },
                { icon: GraduationCap, label: "Scholarships" },
                { icon: BookOpen, label: "Learning Access" },
                { icon: Globe2, label: "Regional Initiatives" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 rounded-xl bg-charcoal/60 border border-gold/20 px-3 py-2.5">
                  <b.icon className="h-4 w-4 text-gold shrink-0" />
                  <span className="text-xs text-ivory/85 font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Brand safety & integrity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl border border-ivory/15 bg-charcoal/60 p-5 md:p-6"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-gold mt-0.5 shrink-0" />
            <p className="text-[12px] md:text-sm text-ivory/75 leading-relaxed">
              <span className="text-ivory font-semibold">Brand Safety & Integrity:</span>{" "}
              All sponsorships, endorsements, partnerships, donations and visibility
              opportunities support education advocacy, media storytelling, community
              engagement, post-award school intervention and special needs education impact
              only. Sponsors, endorsers, partners, donors and contributors cannot nominate,
              shortlist, vote, judge, lobby, influence or determine award or school
              selection outcomes.
            </p>
          </div>
        </motion.div>

        {/* Final CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-2">
            Support a Region. <span className="text-gold">Transform a School.</span>
          </h3>
          <p className="text-ivory/65 text-sm mb-6">
            Join the legacy journey from recognition to regional school intervention.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://eduaid.africa/nominate-school" target="_blank" rel="noreferrer">
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 gap-2">
                <School className="h-4 w-4" /> Nominate a Special Needs School
              </Button>
            </a>
            <Link to="/donate?fund=rmsa">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2">
                <HandCoins className="h-4 w-4" /> Donate to RMSA
              </Button>
            </Link>
            <Link to="/eduaid/waiting-list">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2">
                <Plane className="h-4 w-4" /> Join Edu-Tourism Waiting List
              </Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2">
                <Heart className="h-4 w-4" /> Partner for Impact
              </Button>
            </Link>
            <Link to="/eduaid/rebuild">
              <Button variant="ghost" className="text-ivory/85 hover:text-gold hover:bg-gold/10 rounded-full px-6 gap-2">
                <ArrowRight className="h-4 w-4" /> View Regional Legacy Projects
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default RegionalLegacyEcosystem;
