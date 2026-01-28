// Rebuild My School Africa Landing Page
// Infrastructure development initiative for special needs education facilities

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Heart, 
  MapPin, 
  Users, 
  Target, 
  CheckCircle2,
  ArrowRight,
  Globe,
  School,
  Hammer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// SCEF Color theme for RMSA
const rmsaColors = {
  primary: "#8b6914", // Brown
  secondary: "#4a7c23", // Green
  accent: "#d4a017", // Gold accent
};

const impactRegions = [
  { name: "West Africa", countries: "Nigeria, Ghana, Senegal", schools: 12 },
  { name: "East Africa", countries: "Kenya, Uganda, Tanzania", schools: 8 },
  { name: "Southern Africa", countries: "South Africa, Zimbabwe", schools: 6 },
  { name: "Central Africa", countries: "Cameroon, DRC", schools: 4 },
  { name: "North Africa", countries: "Egypt, Morocco", schools: 3 },
];

const projectPhases = [
  {
    phase: "Phase 1",
    title: "Assessment & Planning",
    description: "Comprehensive facility audits and community needs assessment",
    icon: Target,
  },
  {
    phase: "Phase 2",
    title: "Design & Funding",
    description: "Inclusive design development and resource mobilization",
    icon: Building2,
  },
  {
    phase: "Phase 3",
    title: "Construction",
    description: "Building accessible, modern educational facilities",
    icon: Hammer,
  },
  {
    phase: "Phase 4",
    title: "Handover & Support",
    description: "Community training and ongoing maintenance support",
    icon: CheckCircle2,
  },
];

const donationTiers = [
  {
    amount: 25,
    impact: "Supplies learning materials for 5 students",
    label: "Supporter",
  },
  {
    amount: 100,
    impact: "Furnishes a classroom with accessible desks",
    label: "Builder",
  },
  {
    amount: 500,
    impact: "Installs accessibility ramps and facilities",
    label: "Champion",
  },
  {
    amount: 2500,
    impact: "Renovates an entire classroom block",
    label: "Transformer",
  },
];

export default function Rebuild() {
  return (
    <>
      <Helmet>
        <title>Rebuild My School Africa | SCEF Initiative</title>
        <meta
          name="description"
          content="Transform special needs education facilities across Africa. Join the Rebuild My School Africa initiative to create inclusive learning environments."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(135deg, ${rmsaColors.secondary} 0%, ${rmsaColors.primary} 50%, ${rmsaColors.accent} 100%)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4a7c23]/20 border border-[#4a7c23]/40 mb-6">
                <School className="h-4 w-4 text-[#4a7c23]" />
                <span className="text-sm font-medium text-[#4a7c23]">SCEF Legacy Initiative</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                Rebuild My School
                <span className="block text-[#4a7c23]">Africa</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Transforming special needs education facilities across 5 African regions. 
                Together, we're building inclusive learning environments that empower every child.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-[#4a7c23] hover:bg-[#4a7c23]/90 text-white gap-2"
                >
                  <Link to="/donate?program=rebuild">
                    <Heart className="h-5 w-5" />
                    Donate Now
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[#8b6914]/50 text-[#d4a017] hover:bg-[#8b6914]/10"
                >
                  <Link to="/partners">
                    Become a Partner
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-gold/20 bg-charcoal-light/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-[#4a7c23]">33+</div>
                <div className="text-sm text-white/60 mt-1">Schools Targeted</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-[#8b6914]">5</div>
                <div className="text-sm text-white/60 mt-1">African Regions</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-gold">10K+</div>
                <div className="text-sm text-white/60 mt-1">Students Impacted</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-white">2035</div>
                <div className="text-sm text-white/60 mt-1">Vision Target</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                  Building Inclusive
                  <span className="text-[#4a7c23]"> Learning Spaces</span>
                </h2>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Rebuild My School Africa (RMSA) is the infrastructure arm of the Santos Creations 
                  Educational Foundation. We focus on renovating and building special needs education 
                  facilities that provide accessible, dignified, and inspiring learning environments.
                </p>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Every child deserves access to quality education. Our projects ensure that physical 
                  barriers never stand between a child and their potential.
                </p>
                
                <ul className="space-y-3">
                  {[
                    "Wheelchair-accessible classrooms and facilities",
                    "Sensory-friendly learning environments",
                    "Modern assistive technology integration",
                    "Teacher training for inclusive education",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 className="h-5 w-5 text-[#4a7c23] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative visual */}
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border border-[#4a7c23]/30 bg-gradient-to-br from-[#4a7c23]/20 to-[#8b6914]/20 flex items-center justify-center">
                  <Building2 className="h-32 w-32 text-[#4a7c23]/40" />
                </div>
                {/* Floating stats */}
                <div className="absolute -bottom-6 -left-6 bg-charcoal border border-gold/20 rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-display font-bold text-gold">100%</div>
                  <div className="text-xs text-white/60">Funds to Projects</div>
                </div>
                <div className="absolute -top-6 -right-6 bg-charcoal border border-[#4a7c23]/20 rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-display font-bold text-[#4a7c23]">5 Regions</div>
                  <div className="text-xs text-white/60">Pan-African Impact</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Phases */}
        <section className="py-16 bg-charcoal-light/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                How We <span className="text-[#4a7c23]">Build</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Our structured approach ensures sustainable, community-driven infrastructure development.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projectPhases.map((phase, index) => (
                <Card key={phase.phase} className="bg-charcoal border-gold/20 hover:border-[#4a7c23]/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#4a7c23]/20 flex items-center justify-center">
                        <phase.icon className="h-5 w-5 text-[#4a7c23]" />
                      </div>
                      <span className="text-sm font-medium text-gold">{phase.phase}</span>
                    </div>
                    <CardTitle className="text-white text-lg">{phase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/60">{phase.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Impact */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                <span className="text-[#4a7c23]">Pan-African</span> Reach
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Transforming special needs education across the continent.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {impactRegions.map((region) => (
                <div 
                  key={region.name}
                  className="p-6 rounded-xl border border-gold/20 bg-charcoal-light/30 hover:border-[#4a7c23]/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#4a7c23]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#4a7c23]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{region.name}</h3>
                      <p className="text-sm text-white/60 mb-2">{region.countries}</p>
                      <div className="flex items-center gap-2 text-gold">
                        <School className="h-4 w-4" />
                        <span className="text-sm font-medium">{region.schools} schools targeted</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-16 bg-gradient-to-br from-[#4a7c23]/10 to-[#8b6914]/10 border-y border-gold/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Make an <span className="text-[#4a7c23]">Impact</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Every contribution helps build a more inclusive future for African education.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {donationTiers.map((tier) => (
                <Card 
                  key={tier.amount}
                  className="bg-charcoal border-gold/20 hover:border-[#4a7c23] transition-colors group"
                >
                  <CardHeader className="text-center pb-2">
                    <div className="text-xs font-medium text-[#4a7c23] uppercase tracking-wider mb-1">
                      {tier.label}
                    </div>
                    <CardTitle className="text-3xl font-display text-white">
                      ${tier.amount}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-white/60 mb-4">{tier.impact}</p>
                    <Button 
                      asChild
                      size="sm"
                      className="w-full bg-[#4a7c23] hover:bg-[#4a7c23]/90 group-hover:scale-105 transition-transform"
                    >
                      <Link to={`/donate?program=rebuild&amount=${tier.amount}`}>
                        Donate ${tier.amount}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button 
                asChild
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10"
              >
                <Link to="/donate?program=rebuild">
                  Choose Custom Amount
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Globe className="h-12 w-12 text-[#4a7c23] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Join the Movement
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Whether as a donor, partner, or volunteer, your contribution helps create 
                lasting change in African education. Together, we can ensure every child 
                has access to quality learning environments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-[#4a7c23] hover:bg-[#4a7c23]/90 text-white gap-2"
                >
                  <Link to="/donate?program=rebuild">
                    <Heart className="h-5 w-5" />
                    Support RMSA
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gold/40 text-gold hover:bg-gold/10"
                >
                  <Link to="/volunteer">
                    <Users className="h-5 w-5 mr-2" />
                    Volunteer
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
