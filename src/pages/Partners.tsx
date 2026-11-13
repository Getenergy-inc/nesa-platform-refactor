import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DonorTrustPanel } from "@/components/governance/DonorTrustPanel";
import {
  Building2,
  Globe,
  Users,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Handshake,
  FileText,
  Tv,
  Gift,
  Trophy,
  Star,
  Crown,
  Medal,
  Award,
  Target,
  Heart,
  Play,
  Film,
  Newspaper,
  Download,
  Phone,
  ExternalLink,
  Sparkles,
  School,
  BookOpen,
} from "lucide-react";
import { PartnershipProspectsSection } from "@/components/partners/PartnershipProspectsSection";
import { ScefFormRequired } from "@/components/nesa/ContentRequired";

// ============================================================================
// DATA
// ============================================================================

const SPONSORSHIP_TIERS = [
  {
    name: "Africa Blue Garnet Sponsor",
    investment: "CONTENT REQUIRED",
    color: "from-blue-500 to-indigo-600",
    icon: Crown,
    benefits: [
      "Title sponsorship + headline branding",
      "NESA Africa TV feature segment",
      "Headline acknowledgement during the Online Recognition Programme",
      "Certificate + press mentions",
    ],
    cta: "Sponsor Now",
    featured: true,
  },
  {
    name: "Diamond Partner",
    investment: "CONTENT REQUIRED",
    color: "from-cyan-400 to-blue-500",
    icon: Sparkles,
    benefits: [
      "Premium branding + major co-sponsorship",
      "Online Recognition Programme acknowledgement",
    ],
    cta: "Select Diamond",
  },
  {
    name: "Gold Partner",
    investment: "CONTENT REQUIRED",
    color: "from-amber-400 to-amber-600",
    icon: Trophy,
    benefits: [
      "Sponsor a major category/segment",
      "Online Recognition Programme acknowledgement",
    ],
    cta: "Select Gold",
  },
  {
    name: "Silver Partner",
    investment: "CONTENT REQUIRED",
    color: "from-gray-300 to-gray-500",
    icon: Medal,
    benefits: [
      "Print + digital branding",
      "Online Recognition Programme acknowledgement",
    ],
    cta: "Select Silver",
  },
  {
    name: "Bronze Partner",
    investment: "CONTENT REQUIRED",
    color: "from-orange-400 to-orange-600",
    icon: Award,
    benefits: [
      "Website + program branding",
      "Online Recognition Programme acknowledgement",
    ],
    cta: "Select Bronze",
  },
  {
    name: "Award Category Sponsor",
    investment: "CONTENT REQUIRED",
    color: "from-primary to-primary/80",
    icon: Star,
    benefits: [
      "Category branding + on-stage presentation",
      "Online Recognition Programme acknowledgement",
    ],
    cta: "Sponsor a Category",
  },
];

const INDIVIDUAL_TIERS = [
  {
    tier: "Bronze",
    range: "CONTENT REQUIRED",
    perks: ["Digital sponsor acknowledgement", "Downloadable Certificate of Social Impact"],
  },
  {
    tier: "Silver",
    range: "CONTENT REQUIRED",
    perks: ["Online sponsor acknowledgement", "Sponsor Wall + Recognition Roll"],
  },
  {
    tier: "Gold",
    range: "CONTENT REQUIRED",
    perks: ["Featured online sponsor acknowledgement", "Sponsor Wall + featured recognition"],
  },
  {
    tier: "Platinum",
    range: "CONTENT REQUIRED",
    perks: ["Premium sponsor label + enhanced recognition (Sponsor Wall + Annual Report mention)"],
  },
];

const PARTNER_CATEGORIES = [
  {
    title: "Corporate Partners",
    description: "CSR, brand visibility, category sponsorship",
    icon: Building2,
  },
  {
    title: "Government Partners",
    description: "National education priorities and governance",
    icon: Globe,
  },
  {
    title: "Media Partners",
    description: "Broadcast, distribution, media rights",
    icon: Briefcase,
  },
  {
    title: "NGO/Development Partners",
    description: "Education access and systems strengthening",
    icon: Users,
  },
];

const AD_RATES = [
  { type: "Pre-roll", rate: "CONTENT REQUIRED" },
  { type: "Mid-roll", rate: "CONTENT REQUIRED" },
  { type: "Post-roll", rate: "CONTENT REQUIRED" },
  { type: "Lower-third", rate: "CONTENT REQUIRED" },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function Partners() {
  return (
    <>
      <Helmet>
        <title>Partner with NESA-Africa 2026 | Sponsorship, Media &amp; Impact Opportunities</title>
        <meta
          name="description"
          content="Partner with NESA-Africa 2026 and the Online Recognition Programme on 28 December 2026. Sponsorship enquiries are handled through SCEF's approved Google Form."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Handshake className="h-3 w-3 mr-1" />
                Strategic Partnerships 2026
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
                Partner with <span className="text-gold">NESA-Africa 2026</span>
              </h1>
              <p className="text-lg md:text-xl text-primary font-medium mb-2">
                Online Recognition Programme: Sunday, 13 December 2026 · Online only
              </p>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Put your brand at the center of Africa's education story—celebrating champions and funding real impact through{" "}
                <span className="text-primary">EduAid-Africa + SCEF services</span>, including{" "}
                <span className="text-gold">Rebuild My School (2026–2027)</span>.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Button size="lg" className="bg-gradient-gold text-secondary font-semibold" asChild>
                  <Link to="/contact?type=partnership">
                    <Handshake className="mr-2 h-5 w-5" />
                    Become a Partner
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact?type=invoice">
                    <FileText className="mr-2 h-5 w-5" />
                    Request Invoice
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact?type=partnership">
                    <Download className="mr-2 h-5 w-5" />
                    Request Partnership Deck
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link to="/media/tv">
                    <Tv className="mr-2 h-5 w-5" />
                    Advertise on NESA Africa TV
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Donor & Sponsor Trust */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <DonorTrustPanel />
          </div>
        </section>



        {/* ================================================================
            WHY PARTNER
        ================================================================ */}
        <section className="py-12 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-8">Why Partner</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Target, text: "High-trust visibility across the awards season and Online Recognition Programme programme" },
                { icon: Users, text: "Audience growth through content + public participation campaigns" },
                { icon: School, text: "Measurable impact via verified school interventions (Rebuild My School 2026–2027)" },
                { icon: Award, text: "Sponsor recognition (Sponsor Wall, certificates, annual report mentions)" },
              ].map((item, i) => (
                <Card key={i} className="bg-card/50 border-border">
                  <CardContent className="p-6 text-center">
                    <item.icon className="h-10 w-10 text-gold mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            PARTNERSHIP CATEGORIES
        ================================================================ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-8">Partnership Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8">
              {PARTNER_CATEGORIES.map((cat, i) => (
                <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <cat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{cat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">{cat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact?type=partnership">
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to Partnerships
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ================================================================
            SPONSORSHIP TIERS
        ================================================================ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-4">Sponsorship Tiers (2026)</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose the partnership level that aligns with your organization's goals
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {SPONSORSHIP_TIERS.map((tier, i) => (
                <Card
                  key={i}
                  className={`relative overflow-hidden ${tier.featured ? "border-2 border-gold ring-2 ring-gold/20" : "border-border"}`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.color}`} />
                  {tier.featured && (
                    <Badge className="absolute top-4 right-4 bg-gold text-secondary">Title Sponsor</Badge>
                  )}
                  <CardHeader className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <tier.icon className="h-6 w-6 text-gold" />
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                    </div>
                    <p className="text-3xl font-bold text-gold">{tier.investment}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {tier.benefits.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <ScefFormRequired kind="sponsorship" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            INDIVIDUAL & SME RECOGNITION
        ================================================================ */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-4">Individual &amp; SME Recognition (2026)</h2>
            <p className="text-center text-muted-foreground mb-8">
              For individuals and small businesses who want recognition and programme visibility
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
              {INDIVIDUAL_TIERS.map((t, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{t.tier}</Badge>
                    <CardTitle className="text-2xl text-gold">{t.range}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {t.perks.map((p, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-gradient-gold text-secondary font-semibold" asChild>
                <Link to="/contact?type=individual-sponsor">
                  <Gift className="mr-2 h-5 w-5" />
                  Sponsor as an Individual/SME
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact?type=invoice">
                  <FileText className="mr-2 h-5 w-5" />
                  Request Invoice
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ================================================================
            REBUILD MY SCHOOL AFRICA
        ================================================================ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-center mb-4">
                <School className="inline-block mr-2 h-8 w-8 text-gold" />
                Rebuild My School Africa (2026–2027)
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Support verified school interventions with clear outcomes
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Intervention Areas</h3>
                    <ul className="space-y-2">
                      {[
                        "Classroom rehab, WASH, solar/connectivity",
                        "Learning materials distribution",
                        "Special-needs support and inclusive upgrades",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">More Ways to Fund</h3>
                    <ul className="space-y-2">
                      {[
                        "Matching campaigns (match public support up to agreed amount)",
                        "EduAid webinars (sponsor training + receive reporting)",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Gift className="w-4 h-4 text-gold mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" asChild>
                  <Link to="/rebuild">
                    <School className="mr-2 h-5 w-5" />
                    Sponsor a School
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact?type=project-list">Request Project List</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact?type=impact-report">Get Impact Report</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            NESA AFRICA TV
        ================================================================ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-center mb-4">
                <Tv className="inline-block mr-2 h-8 w-8 text-primary" />
                NESA Africa TV (Ads + Show Sponsorship)
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Sponsor online award shows: Platinum Spotlight → Gold Results Show → Online Recognition Programme broadcast
              </p>
              <Card className="bg-card border-border mb-6">
                <CardHeader>
                  <CardTitle>Starting Ad Rates (per 1,000 plays)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {AD_RATES.map((r, i) => (
                      <div key={i} className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="font-medium text-foreground">{r.type}</p>
                        <p className="text-gold font-bold">{r.rate}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" className="bg-gradient-gold text-secondary font-semibold" asChild>
                  <Link to="/media/tv">
                    <Play className="mr-2 h-5 w-5" />
                    Advertise on NESA Africa TV
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact?type=rate-card">Request Rate Card</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            MEDIA RIGHTS PARTNERSHIPS
        ================================================================ */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-center mb-8">
                <Film className="inline-block mr-2 h-8 w-8 text-primary" />
                Media Rights Partnerships
              </h2>
              <Accordion type="single" collapsible className="mb-6">
                <AccordionItem value="media-rights">
                  <AccordionTrigger className="text-foreground">View Media Rights Options</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 py-4">
                      <li className="flex items-start gap-3">
                        <Newspaper className="w-5 h-5 text-primary mt-0.5" />
                        <span className="text-muted-foreground">Non-exclusive rights (scale licensing)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary mt-0.5" />
                        <span className="text-muted-foreground">Exclusive territory/language rights (minimum guarantees)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                        <span className="text-muted-foreground">Co-production partnerships</span>
                      </li>
                    </ul>
                    <p className="text-sm text-warning mt-4">
                      ⚠️ Integrity rule: partners do not influence winners.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="text-center">
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact?type=media-rights">
                    <FileText className="mr-2 h-5 w-5" />
                    Request Media Rights Proposal
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            PROSPECTIVE PARTNERS & ENDORSERS DIRECTORY (500+)
        ================================================================ */}
        <PartnershipProspectsSection />

        {/* ================================================================
            FINAL CTA
        ================================================================ */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-gold/10">
          <div className="container mx-auto px-4 text-center">
            <Handshake className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold mb-4">Ready to Partner?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join Africa's premier education enablers movement. Together, we celebrate champions and fund real impact.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-gradient-gold text-secondary font-semibold" asChild>
                <Link to="/contact?type=partnership">
                  <Handshake className="mr-2 h-5 w-5" />
                  Become a Partner
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact?type=invoice">
                  <FileText className="mr-2 h-5 w-5" />
                  Request Invoice
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link to="/contact?type=partnership">
                  <Phone className="mr-2 h-5 w-5" />
                  Talk to Partnerships
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur border-t border-border md:hidden z-40">
          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-gold text-secondary font-semibold" asChild>
              <Link to="/contact?type=partnership">Become a Partner</Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/contact?type=invoice">Request Invoice</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
