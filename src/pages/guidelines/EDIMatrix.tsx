/**
 * EDI Matrix & Guidelines Page
 * 
 * The central integrity feature of NESA-Africa 2026.
 * Aligned with the 4-tier award system:
 * - Blue Garnet (Competitive Excellence)
 * - Platinum (Institutional Leadership)
 * - Influencers Education Impact Award (2026)
 * - Lifetime (Africa Education Icon)
 */

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  Download,
  FileText,
  Award,
  Crown,
  Star,
  AlertTriangle,
  CheckCircle,
  Users,
  BookOpen,
  Target,
  Heart,
  TrendingUp,
  GraduationCap,
  Sparkles,
  ClipboardCheck,
  AlertCircle,
  Trophy,
  Music,
  Globe,
  Tv,
} from "lucide-react";
import {
  NESA_CATEGORIES,
  getCategoriesGrouped,
  getExpandedSubcategories,
  TIER_INFO,
  getScopeBadge,
} from "@/config/nesaCategories";

// ─────────────────────────────────────────────────────────────────────────────
// TIER-SPECIFIC EDI EVALUATION DATA
// ─────────────────────────────────────────────────────────────────────────────

const BLUE_GARNET_EDI = {
  title: "Gold-Blue Garnet — Competitive Excellence",
  subtitle: "10 categories · Public voting (40%) + Jury assessment (60%)",
  description: "The pinnacle competitive track. Nominees progress through public voting and expert jury evaluation. Top 3 finalists in each subcategory compete for the Blue Garnet Award.",
  scoringBreakdown: [
    { label: "Independent Jury Review", weight: 40, description: "Scored by independent judges — no public voting in the 2026 cycle" },
    { label: "Jury Assessment", weight: 60, description: "Independent expert panel scoring on 20-point scale" },
  ],
  judgingCriteria: [
    { criterion: "Scale of Impact", weight: 10, description: "Breadth and depth of educational reach" },
    { criterion: "Innovation & Originality", weight: 10, description: "Novel approaches to education challenges" },
    { criterion: "Measurable Outcomes", weight: 15, description: "Documented improvements in learning outcomes" },
    { criterion: "Sustainability", weight: 10, description: "Long-term viability and continuity of impact" },
    { criterion: "Community Engagement", weight: 10, description: "Involvement of local stakeholders and beneficiaries" },
    { criterion: "Equity & Inclusion", weight: 10, description: "Reaching marginalized and underserved populations" },
    { criterion: "Partnership Effectiveness", weight: 10, description: "Collaboration with governments, NGOs, and institutions" },
    { criterion: "Transparency & Accountability", weight: 10, description: "Clear governance, reporting, and documentation" },
    { criterion: "Alignment with SDG 4", weight: 10, description: "Contribution to quality education for all" },
    { criterion: "Evidence Quality", weight: 5, description: "Strength and verifiability of supporting evidence" },
  ],
};

const PLATINUM_EDI = {
  title: "Platinum — Institutional Leadership",
  subtitle: "6 categories · NRC verification · No public voting",
  description: "Recognition-only track for institutional and governance contributions. Evaluated by the Nomination Review Committee (NRC) against verified contribution thresholds.",
  thresholds: {
    core: { count: 7, renominations: 100 },
    standard: { count: 10, renominations: 200 },
  },
  evaluationAreas: [
    {
      name: "Research & Development for Education",
      areas: [
        "Educational research publications and impact",
        "Curriculum innovation and development",
        "Teacher training methodologies",
        "Learning outcomes assessment tools",
        "Policy influence through research",
      ],
    },
    {
      name: "Faith-Based Education Enablers",
      areas: [
        "Faith-integrated curriculum development",
        "Values-based character education programmes",
        "Interfaith education dialogue initiatives",
        "Community moral development outreach",
        "Religious literacy and tolerance education",
      ],
    },
    {
      name: "Political Leadership for Education",
      areas: [
        "Education budget advocacy and increases",
        "Policy reform initiatives and legislation",
        "Public school infrastructure development",
        "Teacher welfare and recruitment improvements",
        "Educational emergency response and management",
      ],
    },
    {
      name: "International Partnership for Education",
      areas: [
        "Cross-border educational partnerships",
        "International scholarship programmes for Africans",
        "Global education technology transfer",
        "International teacher exchange programmes",
        "Global education standards adoption",
      ],
    },
    {
      name: "Diaspora Educational Impact",
      areas: [
        "Remittance for education programmes",
        "Diaspora teacher volunteer initiatives",
        "Educational material and technology donations",
        "Diaspora mentorship and career guidance",
        "Brain-gain and return programmes",
      ],
    },
  ],
};

const LIFETIME_EDI = {
  title: "Africa Education Icon — Lifetime Achievement",
  subtitle: "1 category · 3 subcategories · Jury selection only (2006–2026)",
  description: "Continental honour recognising transformational leaders with 10+ years of sustained educational impact. Expert-selected by independent jury panel. 9 Icons total: 3 Residents, 3 Diaspora, 3 Friends of Africa.",
  criteria: [
    {
      area: "Decade of Sustained Impact",
      description: "Minimum 10 years of continuous, documented contribution to African education",
    },
    {
      area: "Institutional Legacy Building",
      description: "Creation or transformation of educational institutions that outlast the individual",
    },
    {
      area: "Generational Influence",
      description: "Impact spanning multiple generations of learners, educators, or policymakers",
    },
    {
      area: "Pan-African Reach",
      description: "Influence extending beyond a single country or region across Africa",
    },
    {
      area: "Transformational Innovation",
      description: "Introduction of fundamentally new approaches that changed education practice",
    },
  ],
  subcategories: [
    "Africa Education Philanthropy Icon of the Decade",
    "Literary & New Curriculum Advocate Icon of the Decade",
    "Africa Technical Educator Icon of the Decade",
  ],
};

const GOLD_SPECIAL_EDI = {
  title: "Influencers Education Impact Award 2026 Edition",
  subtitle: "3 categories · Editorial selection · Cultural impact",
  description: "Cultural and influence impact recognition for Sports, Music, and Social Media education advocacy. Selected editorially based on public visibility and advocacy contribution.",
  evaluationPillars: [
    { pillar: "Public Advocacy Reach", description: "Documented use of platform to promote education causes" },
    { pillar: "Measurable Influence", description: "Audience size, engagement rates, and campaign metrics" },
    { pillar: "Education Investment", description: "Direct financial or in-kind contributions to education" },
    { pillar: "Community Impact", description: "On-ground educational interventions enabled by the individual's influence" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SCORING RUBRIC (shared across competitive tiers)
// ─────────────────────────────────────────────────────────────────────────────

const SCORING_RUBRIC = [
  { range: "9–10", rating: "Exceptional", description: "Outstanding performance exceeding all expectations with documented evidence", colorClass: "bg-emerald-500/5", textClass: "text-emerald-400" },
  { range: "7–8", rating: "Strong", description: "Above average performance with clear evidence of impact", colorClass: "bg-blue-500/5", textClass: "text-blue-400" },
  { range: "5–6", rating: "Adequate", description: "Meets basic requirements with some areas for improvement", colorClass: "bg-amber-500/5", textClass: "text-amber-400" },
  { range: "3–4", rating: "Developing", description: "Below expectations with significant gaps in evidence", colorClass: "bg-orange-500/5", textClass: "text-orange-400" },
  { range: "1–2", rating: "Insufficient", description: "Minimal or no evidence provided; does not meet criteria", colorClass: "bg-red-500/5", textClass: "text-red-400" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function TierSection({
  icon: Icon,
  iconColor,
  borderColor,
  bgColor,
  title,
  subtitle,
  description,
  children,
  defaultOpen = false,
  value,
}: {
  icon: React.ElementType;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  value: string;
}) {
  return (
    <AccordionItem value={value} className={`${bgColor} border ${borderColor} rounded-xl overflow-hidden`}>
      <AccordionTrigger className="px-6 py-4 hover:bg-white/5">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg ${bgColor} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white text-lg">{title}</h3>
            <p className="text-white/60 text-sm">{subtitle}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <p className="text-white/70 mb-6 text-sm">{description}</p>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function CriteriaTable({ criteria }: { criteria: Array<{ criterion: string; weight: number; description: string }> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-2 text-gold font-medium">#</th>
            <th className="text-left py-2 px-2 text-gold font-medium">Criterion</th>
            <th className="text-center py-2 px-2 text-gold font-medium">Weight</th>
            <th className="text-left py-2 px-2 text-gold font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((c, i) => (
            <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
              <td className="py-2 px-2 text-white/50">{i + 1}</td>
              <td className="py-2 px-2 text-white font-medium">{c.criterion}</td>
              <td className="py-2 px-2 text-center text-gold">{c.weight}%</td>
              <td className="py-2 px-2 text-white/60">{c.description}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gold/30">
            <td colSpan={2} className="py-2 px-2 text-white font-semibold">Total</td>
            <td className="py-2 px-2 text-center text-gold font-bold">100%</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function CategoryList({ tierKey }: { tierKey: "blueGarnet" | "platinum" | "lifetime" | "goldSpecial" }) {
  const groups = getCategoriesGrouped();
  const categories = groups[tierKey];

  if (!categories || categories.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gold uppercase tracking-wide mb-3">
        Categories in this Tier ({categories.length})
      </h4>
      <div className="grid gap-2">
        {categories.map((cat) => {
          const scopeBadge = getScopeBadge(cat.scope);
          const subCount = cat.subcategories.length;
          return (
            <div key={cat.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-white text-sm font-medium">{cat.name}</span>
                <Badge className={`text-[10px] ${scopeBadge.color}`}>{scopeBadge.label}</Badge>
              </div>
              <span className="text-white/40 text-xs">{subCount} subcategories</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function EDIMatrix() {
  const [expandedLevel, setExpandedLevel] = useState<string[]>(["blue-garnet"]);

  return (
    <>
      <Helmet>
        <title>EDI Matrix & Guidelines | NESA-Africa 2026</title>
        <meta name="description" content="The Education Development Index (EDI) Matrix is the integrity backbone of NESA-Africa 2026, ensuring transparent and fair evaluation across all award tiers." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-charcoal to-charcoal" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
          
          <div className="container relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1.5">
                <Shield className="w-4 h-4 mr-2" />
                Integrity Backbone
              </Badge>
              
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                NESA-Africa 2026 Education Development Index
                <span className="block text-gold mt-2">(EDI) Matrix</span>
              </h1>
              
              <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-6">
                The comprehensive evaluation framework ensuring transparent, fair, and rigorous 
                assessment across all four award tiers.
              </p>

              {/* Tier Quick Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
                {[
                  { label: "Blue Garnet", desc: "Competitive Excellence", icon: "🏆", color: "border-blue-500/40 bg-blue-500/10" },
                  { label: "Platinum", desc: "Institutional Leadership", icon: "💎", color: "border-slate-400/40 bg-slate-400/10" },
                  { label: "Influencers Award", desc: "2026 Cultural Impact", icon: "🥇", color: "border-yellow-500/40 bg-yellow-500/10" },
                  { label: "Lifetime", desc: "Icon Achievement", icon: "🏛", color: "border-purple-500/40 bg-purple-500/10" },
                ].map((t) => (
                  <div key={t.label} className={`rounded-lg border ${t.color} p-3 text-center`}>
                    <span className="text-lg">{t.icon}</span>
                    <p className="text-white text-xs font-semibold mt-1">{t.label}</p>
                    <p className="text-white/50 text-[10px]">{t.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full EDI Matrix PDF
                </Button>
                <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-6">
                  <Link to="/nominate">
                    <FileText className="mr-2 h-4 w-4" />
                    View Nomination Form
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Integrity Rules Box */}
        <section className="py-8 bg-charcoal-light border-y border-gold/20">
          <div className="container px-4">
            <Card className="bg-red-500/10 border-red-500/30 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Integrity & Evidence Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white/80">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      Evidence Tiers
                    </h4>
                    <ul className="text-sm space-y-1 text-white/70">
                      <li>• <strong>Tier A:</strong> Independent / Audited reports</li>
                      <li>• <strong>Tier B:</strong> Internal M&E data</li>
                      <li>• <strong>Tier C:</strong> Supporting documentation</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      Red Flags (Auto-Review)
                    </h4>
                    <ul className="text-sm space-y-1 text-white/70">
                      <li>• Unverifiable claims</li>
                      <li>• Conflicting evidence</li>
                      <li>• Missing documentation</li>
                      <li>• Ethical violations</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-400" />
                      Data Period
                    </h4>
                    <p className="text-sm text-white/70">
                      All evidence must cover activities from <strong>January 2023 – September 2025</strong>.
                      Lifetime Icon Award may include earlier contributions (2006–2026).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 6-Dimension Scoring Framework — universal nominee-facing rubric */}
        <section id="how-edi-is-calculated" className="py-12 md:py-16 bg-charcoal scroll-mt-24">
          <div className="container px-4 max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-gold/15 text-gold border-gold/30 px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                How EDI is Calculated
              </Badge>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                The 6-Dimension Scoring Framework
              </h2>
              <p className="text-white/60 text-sm md:text-base mt-3 max-w-3xl mx-auto">
                Every nominee is evaluated on a 1–100 scale across six dimensions. The Overall
                EDI Score is the average. Bands: <span className="text-emerald-400 font-semibold">Green ≥80</span>{" "}
                <span className="text-blue-400 font-semibold">Blue 60–79</span>{" "}
                <span className="text-amber-400 font-semibold">Amber 40–59</span>{" "}
                <span className="text-red-400 font-semibold">Red &lt;40</span>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  label: "Education Impact",
                  icon: GraduationCap,
                  color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                  rubric: "Scale and depth of direct educational improvements. High scores require verifiable, sustained outcomes.",
                  metrics: ["Number of learners reached", "Schools built or renovated", "Literacy / numeracy uplift", "Graduation & completion rates", "Exam scores and retention"],
                },
                {
                  label: "Leadership",
                  icon: Crown,
                  color: "text-amber-300 border-amber-500/30 bg-amber-500/10",
                  rubric: "Ability to inspire, mobilise, and drive systemic change through vision and influence.",
                  metrics: ["Policies influenced or adopted", "Teams & organisations built", "Government / NGO / private partnerships", "Thought leadership & media reach", "Mentorship and capacity building"],
                },
                {
                  label: "Innovation",
                  icon: Sparkles,
                  color: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
                  rubric: "Creativity, originality, and effectiveness of new solutions and models.",
                  metrics: ["New pedagogical approaches or curricula", "EdTech platforms or tools introduced", "Scalable pilot programs", "Frameworks replicated by others", "Cost-effectiveness gains"],
                },
                {
                  label: "Inclusion",
                  icon: Heart,
                  color: "text-pink-300 border-pink-500/30 bg-pink-500/10",
                  rubric: "Reach into marginalised, vulnerable and underserved populations.",
                  metrics: ["% of girls / women reached", "Special needs & disability inclusion", "Rural, remote, conflict-affected service", "Gender, income, ethnicity parity", "Programs for vulnerable groups"],
                },
                {
                  label: "Sustainability",
                  icon: TrendingUp,
                  color: "text-green-400 border-green-500/30 bg-green-500/10",
                  rubric: "Long-term viability and systemic resilience of the work.",
                  metrics: ["Institutional frameworks created", "Local ownership & leadership transition", "Funding diversification", "Knowledge transfer & teacher training", "Long-term impact resilience"],
                },
                {
                  label: "Community Reach",
                  icon: Users,
                  color: "text-blue-300 border-blue-500/30 bg-blue-500/10",
                  rubric: "Depth and breadth of grassroots engagement and partnerships.",
                  metrics: ["Communities & villages reached", "Community participation rates", "Local stakeholder engagement", "Geographic spread (countries / regions)", "Beneficiary feedback & satisfaction"],
                },
              ].map((d) => {
                const Icon = d.icon;
                return (
                  <Card key={d.label} className={`border ${d.color}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-white text-base">
                        <Icon className="h-5 w-5" />
                        {d.label}
                        <span className="ml-auto text-xs font-normal text-white/40">/ 100</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-white/70 text-sm leading-relaxed">{d.rubric}</p>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1.5">Example metrics</p>
                        <ul className="space-y-1 text-xs text-white/60">
                          {d.metrics.map((m) => (
                            <li key={m} className="flex gap-2">
                              <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-emerald-400/70" />
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-6 bg-charcoal-light/50 border-gold/20">
              <CardContent className="p-5 grid md:grid-cols-2 gap-4 text-sm text-white/70">
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-gold" />
                    Scoring Sources
                  </h4>
                  <ul className="space-y-1">
                    <li>• Self-reported nomination data</li>
                    <li>• Verified evidence (reports, documents, media)</li>
                    <li>• Third-party validation & beneficiary feedback</li>
                    <li>• Jury / expert review (shortlisted nominees)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-gold" />
                    Overall EDI Score
                  </h4>
                  <p>
                    Computed as the simple average of all six dimensions on a 0–100 scale, then
                    benchmarked against category and regional peers for context. Listing does not
                    imply finalist, winner, or endorsement status — see governance notice on every
                    nominee profile.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main 4-Tier Accordion Content */}
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <Accordion type="multiple" value={expandedLevel} onValueChange={setExpandedLevel} className="space-y-4">

                {/* ── BLUE GARNET ── */}
                <TierSection
                  value="blue-garnet"
                  icon={Trophy}
                  iconColor="text-blue-300"
                  borderColor="border-blue-500/30"
                  bgColor="bg-blue-500/10"
                  title={BLUE_GARNET_EDI.title}
                  subtitle={BLUE_GARNET_EDI.subtitle}
                  description={BLUE_GARNET_EDI.description}
                  defaultOpen
                >
                  {/* Scoring breakdown */}
                  <div className="mb-6 p-4 bg-white/5 rounded-lg">
                    <h4 className="font-medium text-white mb-3">Scoring Breakdown</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {BLUE_GARNET_EDI.scoringBreakdown.map((s) => (
                        <div key={s.label} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <span className="text-blue-400 font-semibold">{s.label} — {s.weight}%</span>
                          <p className="text-white/60 text-xs mt-1">{s.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Judging criteria table */}
                  <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Jury Judging Criteria (20-Point Scale)</h4>
                    <CriteriaTable criteria={BLUE_GARNET_EDI.judgingCriteria} />
                  </div>

                  {/* Category list */}
                  <CategoryList tierKey="blueGarnet" />
                </TierSection>

                {/* ── PLATINUM ── */}
                <TierSection
                  value="platinum"
                  icon={Award}
                  iconColor="text-slate-300"
                  borderColor="border-slate-400/30"
                  bgColor="bg-slate-500/10"
                  title={PLATINUM_EDI.title}
                  subtitle={PLATINUM_EDI.subtitle}
                  description={PLATINUM_EDI.description}
                >
                  {/* Thresholds */}
                  <div className="mb-6 p-4 bg-white/5 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Renomination Thresholds</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                        <span className="text-emerald-400 font-semibold">{PLATINUM_EDI.thresholds.core.count} Core Categories</span>
                        <p className="text-white/60">{PLATINUM_EDI.thresholds.core.renominations} renominations required</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <span className="text-blue-400 font-semibold">{PLATINUM_EDI.thresholds.standard.count} Standard Categories</span>
                        <p className="text-white/60">{PLATINUM_EDI.thresholds.standard.renominations} renominations required</p>
                      </div>
                    </div>
                  </div>

                  {/* Evaluation areas */}
                  <Accordion type="multiple" className="space-y-2 mb-6">
                    {PLATINUM_EDI.evaluationAreas.map((area, idx) => (
                      <AccordionItem key={idx} value={`plat-${idx}`} className="bg-white/5 border border-white/10 rounded-lg">
                        <AccordionTrigger className="px-4 py-3 hover:bg-white/5">
                          <span className="text-white text-sm font-medium text-left">{area.name}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <h5 className="text-xs font-semibold text-gold uppercase tracking-wide mb-2">Development Areas</h5>
                          <ul className="space-y-1">
                            {area.areas.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <CategoryList tierKey="platinum" />
                </TierSection>

                {/* ── GOLD SPECIAL (2026) ── */}
                <TierSection
                  value="gold-special"
                  icon={Star}
                  iconColor="text-yellow-400"
                  borderColor="border-yellow-500/30"
                  bgColor="bg-yellow-500/10"
                  title={GOLD_SPECIAL_EDI.title}
                  subtitle={GOLD_SPECIAL_EDI.subtitle}
                  description={GOLD_SPECIAL_EDI.description}
                >
                  {/* Evaluation pillars */}
                  <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Evaluation Pillars</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {GOLD_SPECIAL_EDI.evaluationPillars.map((p) => (
                        <div key={p.pillar} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <h5 className="font-semibold text-white text-sm mb-1">{p.pillar}</h5>
                          <p className="text-white/60 text-xs">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <CategoryList tierKey="goldSpecial" />
                </TierSection>

                {/* ── LIFETIME (ICON) ── */}
                <TierSection
                  value="lifetime"
                  icon={Crown}
                  iconColor="text-purple-300"
                  borderColor="border-purple-500/30"
                  bgColor="bg-purple-500/10"
                  title={LIFETIME_EDI.title}
                  subtitle={LIFETIME_EDI.subtitle}
                  description={LIFETIME_EDI.description}
                >
                  {/* Subcategories */}
                  <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Subcategories</h4>
                    <div className="flex flex-wrap gap-2">
                      {LIFETIME_EDI.subcategories.map((sub, i) => (
                        <Badge key={i} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Evaluation criteria */}
                  <div className="space-y-3">
                    {LIFETIME_EDI.criteria.map((crit, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h5 className="font-semibold text-white text-sm mb-1">{crit.area}</h5>
                        <p className="text-white/60 text-xs">{crit.description}</p>
                      </div>
                    ))}
                  </div>
                </TierSection>

              </Accordion>

              {/* ── ADDITIONAL SECTIONS ── */}
              <div className="mt-12 space-y-8">

                {/* Scoring Rubric */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold">
                      <ClipboardCheck className="h-5 w-5" />
                      Common Scoring Rubric (20-Point Scale)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 px-3 text-gold">Score Range</th>
                            <th className="text-left py-2 px-3 text-gold">Rating</th>
                            <th className="text-left py-2 px-3 text-gold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-white/70">
                          {SCORING_RUBRIC.map((row) => (
                            <tr key={row.range} className={`border-b border-white/5 ${row.colorClass}`}>
                              <td className={`py-2 px-3 font-semibold ${row.textClass}`}>{row.range}</td>
                              <td className="py-2 px-3 text-white">{row.rating}</td>
                              <td className="py-2 px-3">{row.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Top 3 Screening */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold">
                      <Users className="h-5 w-5" />
                      Screening of Top 3 Finalists (Blue Garnet Track)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-white/70">
                    <p>
                      After initial NRC screening and jury scoring, the Top 3 nominees in each competitive category
                      undergo enhanced due diligence before the Blue Garnet Award is finalised:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="font-semibold text-white mb-2">1. Enhanced Verification</h5>
                        <p className="text-sm">Cross-referencing all claims with independent sources and contacting references</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="font-semibold text-white mb-2">2. Conflict of Interest Check</h5>
                        <p className="text-sm">Ensuring no jury member has undisclosed connections to finalists</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="font-semibold text-white mb-2">3. Public Integrity Review</h5>
                        <p className="text-sm">Media and public records check for ethical concerns or controversies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Legacy RMSA & EduAid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-emerald-500/10 border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-400">
                        <Heart className="h-5 w-5" />
                        Legacy: Rebuild My School Africa (RMSA)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/70">
                      <p className="mb-3">
                        A portion of NESA-Africa proceeds supports RMSA, rebuilding and renovating
                        schools across underserved African communities.
                      </p>
                      <Button asChild variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                        <Link to="/rebuild">Learn More About RMSA</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-400">
                        <GraduationCap className="h-5 w-5" />
                        EduAid Pipeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/70">
                      <p className="mb-3">
                        Winners and finalists gain access to the EduAid network, connecting them
                        with resources, partnerships, and funding opportunities.
                      </p>
                      <Button asChild variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                        <Link to="/eduaid">Explore EduAid</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Final CTA */}
              <div className="mt-12 text-center">
                <p className="text-white/60 mb-4">Ready to nominate an education champion?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                    <Link to="/nominate">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Nomination
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8">
                    <Link to="/guidelines/nominators">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Nominator Guidelines
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
