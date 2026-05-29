// Regional Legacy Impact Ecosystem
// Replaces the passive "Explore Africa's Regions" map with an 8-region
// legacy hub ecosystem connecting NESA-Africa Awards → EduAid-Africa
// Conferences → Edu-Tourism → GFA Wzip Regional Wallets → Rebuild My
// School Africa (RMSA) → Special Needs Education → Measurable Impact.

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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type LegacyRegion = {
  slug: string;
  index: number;
  name: string;
  shortName: string;
  leadCountry: string;
  conferenceCountries?: string[];
  conferenceWindow?: string;
  theme: string;
  legacyProjects: string[];
  wallet: string;
  walletProgress: number; // 0-100
  metrics: { schools: string; specialNeeds: string; scholarships: string; goal: string };
  donateHref: string;
  exploreHref: string;
  tourismHref: string;
};

const REGIONS: LegacyRegion[] = [
  {
    slug: "west-africa",
    index: 1,
    name: "West Africa Regional Legacy Hub",
    shortName: "West Africa",
    leadCountry: "Ghana",
    theme: "Education Access, Teacher Development & Youth Leadership",
    legacyProjects: [
      "Rural School Support",
      "Community Libraries",
      "Learning Materials",
      "Special Needs Education Support",
    ],
    wallet: "West Africa Legacy Fund",
    walletProgress: 42,
    metrics: { schools: "120", specialNeeds: "18", scholarships: "250", goal: "$450K" },
    donateHref: "/donate?region=west-africa&fund=rmsa",
    exploreHref: "/region/west-africa",
    tourismHref: "/eduaid/waiting-list?region=west-africa",
  },
  {
    slug: "east-africa",
    index: 2,
    name: "East Africa Regional Legacy Hub",
    shortName: "East Africa",
    leadCountry: "Kenya",
    theme: "Digital Learning & STEM Education",
    legacyProjects: [
      "School Technology Access",
      "STEM Labs",
      "Teacher Training",
      "Special Needs Education",
    ],
    wallet: "East Africa Legacy Fund",
    walletProgress: 38,
    metrics: { schools: "95", specialNeeds: "14", scholarships: "200", goal: "$400K" },
    donateHref: "/donate?region=east-africa&fund=rmsa",
    exploreHref: "/region/east-africa",
    tourismHref: "/eduaid/waiting-list?region=east-africa",
  },
  {
    slug: "central-africa",
    index: 3,
    name: "Central Africa Regional Legacy Hub",
    shortName: "Central Africa",
    leadCountry: "Rwanda",
    theme: "Community Learning & Education Recovery",
    legacyProjects: [
      "Learning Resource Centers",
      "School Rehabilitation",
      "Inclusive Education",
    ],
    wallet: "Central Africa Legacy Fund",
    walletProgress: 28,
    metrics: { schools: "70", specialNeeds: "12", scholarships: "150", goal: "$300K" },
    donateHref: "/donate?region=central-africa&fund=rmsa",
    exploreHref: "/region/central-africa",
    tourismHref: "/eduaid/waiting-list?region=central-africa",
  },
  {
    slug: "southern-africa",
    index: 4,
    name: "Southern Africa Regional Legacy Hub",
    shortName: "Southern Africa",
    leadCountry: "South Africa",
    theme: "Skills Development & Inclusive Learning",
    legacyProjects: [
      "School Support",
      "Accessibility Projects",
      "Special Needs Education",
    ],
    wallet: "Southern Africa Legacy Fund",
    walletProgress: 44,
    metrics: { schools: "110", specialNeeds: "20", scholarships: "220", goal: "$420K" },
    donateHref: "/donate?region=southern-africa&fund=rmsa",
    exploreHref: "/region/southern-africa",
    tourismHref: "/eduaid/waiting-list?region=southern-africa",
  },
  {
    slug: "north-africa",
    index: 5,
    name: "North Africa Regional Legacy Hub",
    shortName: "North Africa",
    leadCountry: "Morocco",
    theme: "Research, Innovation & Education Partnerships",
    legacyProjects: ["Libraries", "Research Centers", "Learning Innovation"],
    wallet: "North Africa Legacy Fund",
    walletProgress: 22,
    metrics: { schools: "60", specialNeeds: "10", scholarships: "140", goal: "$300K" },
    donateHref: "/donate?region=north-africa&fund=rmsa",
    exploreHref: "/region/north-africa",
    tourismHref: "/eduaid/waiting-list?region=north-africa",
  },
  {
    slug: "indian-ocean-islands",
    index: 6,
    name: "Indian Ocean Islands Regional Legacy Hub",
    shortName: "Indian Ocean Islands",
    leadCountry: "Seychelles",
    conferenceCountries: ["Seychelles", "Mauritius", "Madagascar", "Comoros"],
    conferenceWindow: "EduAid-Africa Indian Ocean Islands Edu-Tourism Conference · 15–24 October 2027",
    theme:
      "Girls' Education, Gender Inclusion, Safeguarding & Inclusive Education Support",
    legacyProjects: [
      "Special Needs Schools",
      "Accessibility Support",
      "Girls Education",
      "Inclusive Learning",
    ],
    wallet: "Indian Ocean Islands Legacy Fund",
    walletProgress: 18,
    metrics: { schools: "40", specialNeeds: "15", scholarships: "120", goal: "$260K" },
    donateHref: "/donate?region=indian-ocean-islands&fund=rmsa",
    exploreHref: "/region/indian-ocean-islands",
    tourismHref: "/eduaid/waiting-list?region=indian-ocean-islands",
  },
  {
    slug: "diaspora",
    index: 7,
    name: "African Diaspora Legacy Hub",
    shortName: "African Diaspora",
    leadCountry: "United Kingdom",
    theme: "Diaspora Education Investment & Knowledge Transfer",
    legacyProjects: ["Scholarships", "Exchange Programs", "Education Technology"],
    wallet: "Diaspora Legacy Fund",
    walletProgress: 33,
    metrics: { schools: "55", specialNeeds: "9", scholarships: "300", goal: "$500K" },
    donateHref: "/donate?region=diaspora&fund=rmsa",
    exploreHref: "/region/diaspora",
    tourismHref: "/eduaid/waiting-list?region=diaspora",
  },
  {
    slug: "friends-of-africa",
    index: 8,
    name: "Friends of Africa Global Legacy Hub",
    shortName: "Friends of Africa",
    leadCountry: "United States",
    theme: "Global Partnerships for African Education",
    legacyProjects: ["CSR Education Funds", "School Support", "Scholarship Programs"],
    wallet: "Friends of Africa Legacy Fund",
    walletProgress: 26,
    metrics: { schools: "65", specialNeeds: "11", scholarships: "280", goal: "$480K" },
    donateHref: "/donate?region=friends-of-africa&fund=rmsa",
    exploreHref: "/region/friends-of-africa",
    tourismHref: "/eduaid/waiting-list?region=friends-of-africa",
  },
];

function RegionCard({ region }: { region: LegacyRegion }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className="group relative flex flex-col rounded-2xl border border-gold/20 bg-charcoal/70 backdrop-blur-sm overflow-hidden hover:border-gold/50 hover:shadow-[0_0_40px_-15px_hsl(var(--gold)/0.5)] transition-all"
    >
      {/* Header strip */}
      <div className="relative p-5 border-b border-gold/15 bg-gradient-to-br from-gold/10 via-transparent to-transparent">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest">
            Region {region.index}
          </span>
          <span className="inline-flex items-center gap-1 text-ivory/60 text-[11px]">
            <MapPin className="h-3 w-3 text-gold" />
            {region.leadCountry}
          </span>
        </div>
        <h3 className="font-display text-lg md:text-xl font-bold text-ivory leading-tight">
          {region.name}
        </h3>
        <p className="mt-2 text-xs text-gold/90 font-medium">{region.theme}</p>
        {region.conferenceWindow && (
          <p className="mt-2 inline-flex items-start gap-1.5 text-[11px] text-ivory/70">
            <Plane className="h-3 w-3 mt-0.5 text-gold shrink-0" />
            <span>{region.conferenceWindow}</span>
          </p>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {region.conferenceCountries && (
          <div className="flex flex-wrap gap-1.5">
            {region.conferenceCountries.map((c) => (
              <span
                key={c}
                className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px]"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Legacy projects */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ivory/50 mb-2">
            <School className="h-3 w-3 text-gold" /> Legacy Projects
          </div>
          <ul className="space-y-1">
            {region.legacyProjects.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 text-[12px] text-ivory/80"
              >
                <Sparkles className="h-3 w-3 mt-0.5 text-gold shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* GFA Wzip wallet */}
        <div className="rounded-xl border border-gold/20 bg-charcoal/60 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ivory">
              <Wallet className="h-3.5 w-3.5 text-gold" /> GFA Wzip · {region.wallet}
            </div>
            <span className="text-[11px] text-gold font-bold">
              {region.walletProgress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-ivory/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-dark"
              style={{ width: `${region.walletProgress}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-ivory/55">
            Goal {region.metrics.goal} · Fed by 5% of every sponsorship.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <Metric icon={School} value={region.metrics.schools} label="Schools" />
          <Metric
            icon={Accessibility}
            value={region.metrics.specialNeeds}
            label="Special Needs"
          />
          <Metric
            icon={GraduationCap}
            value={region.metrics.scholarships}
            label="Scholarships"
          />
        </div>

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Link to={region.exploreHref}>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between border-gold/40 text-gold hover:bg-gold/10 rounded-full"
            >
              Explore Region <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link to={region.tourismHref}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-[11px] text-ivory/85 hover:text-gold hover:bg-gold/10 rounded-full border border-ivory/10"
              >
                <Plane className="h-3 w-3 mr-1" /> Edu-Tourism
              </Button>
            </Link>
            <Link to={region.donateHref}>
              <Button
                size="sm"
                className="w-full text-[11px] bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full"
              >
                <HandCoins className="h-3 w-3 mr-1" /> Donate
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-gold/15 bg-charcoal/50 p-2 text-center">
      <Icon className="h-3.5 w-3.5 text-gold mx-auto mb-1" />
      <div className="text-sm font-bold text-ivory leading-none">{value}</div>
      <div className="text-[9px] uppercase tracking-wide text-ivory/55 mt-1">
        {label}
      </div>
    </div>
  );
}

export function RegionalLegacyEcosystem() {
  return (
    <section className="relative py-16 md:py-24 bg-charcoal overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--gold)/0.08),transparent_60%)]"
      />
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Globe2 className="h-3.5 w-3.5" /> Continental Impact Ecosystem
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ivory mb-4 leading-tight">
            Explore Africa's Regions &{" "}
            <span className="text-gold">Legacy Impact Ecosystem</span>
          </h2>
          <p className="text-ivory/75 text-sm md:text-base leading-relaxed">
            One Continent. Eight Legacy Regions. One Education Transformation
            Movement. Discover education changemakers, regional priorities,
            educational tourism opportunities, and school intervention projects
            across Africa and the diaspora.
          </p>
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
                <span className="text-gold font-semibold">
                  GFA Wzip Regional Legacy Wallets
                </span>{" "}
                — funding school interventions, special needs schools, inclusive
                learning, scholarships, learning access, and regional education
                initiatives.
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
                <div
                  key={b.label}
                  className="flex items-center gap-2 rounded-xl bg-charcoal/60 border border-gold/20 px-3 py-2.5"
                >
                  <b.icon className="h-4 w-4 text-gold shrink-0" />
                  <span className="text-xs text-ivory/85 font-medium">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
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
            Join the legacy journey from recognition to regional transformation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/nominate?type=school">
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 gap-2">
                <School className="h-4 w-4" /> Nominate a School
              </Button>
            </Link>
            <Link to="/donate?fund=rmsa">
              <Button
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2"
              >
                <HandCoins className="h-4 w-4" /> Donate to RMSA
              </Button>
            </Link>
            <Link to="/eduaid/waiting-list">
              <Button
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2"
              >
                <Plane className="h-4 w-4" /> Join Edu-Tourism Waiting List
              </Button>
            </Link>
            <Link to="/partners">
              <Button
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2"
              >
                <Heart className="h-4 w-4" /> Partner for Impact
              </Button>
            </Link>
            <Link to="/eduaid/rebuild">
              <Button
                variant="ghost"
                className="text-ivory/85 hover:text-gold hover:bg-gold/10 rounded-full px-6 gap-2"
              >
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
