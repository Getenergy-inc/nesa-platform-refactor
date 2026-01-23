import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Globe, 
  Award, 
  Users, 
  Briefcase, 
  Star,
  CheckCircle,
  ArrowRight,
  Handshake
} from "lucide-react";
import { Link } from "react-router-dom";

const sponsorTiers = [
  {
    name: "Platinum Partner",
    investment: "$100,000+",
    color: "from-slate-300 to-slate-500",
    benefits: [
      "Exclusive category naming rights",
      "Prime logo placement on all materials",
      "VIP table (10 seats) at Awards Gala",
      "Speaking opportunity at ceremony",
      "Year-round brand visibility",
      "Custom partnership activation"
    ]
  },
  {
    name: "Gold Partner",
    investment: "$50,000+",
    color: "from-amber-400 to-amber-600",
    benefits: [
      "Co-branding on award category",
      "Logo on event materials",
      "Premium table (8 seats) at Gala",
      "Social media recognition",
      "Website feature placement",
      "Nominee engagement opportunities"
    ]
  },
  {
    name: "Silver Partner",
    investment: "$25,000+",
    color: "from-gray-300 to-gray-500",
    benefits: [
      "Logo on select materials",
      "Table (6 seats) at Awards Gala",
      "Social media mentions",
      "Website logo placement",
      "Event recognition"
    ]
  },
  {
    name: "Bronze Partner",
    investment: "$10,000+",
    color: "from-orange-400 to-orange-600",
    benefits: [
      "Logo on website",
      "Tickets (4) to Awards Gala",
      "Social media recognition",
      "Certificate of partnership"
    ]
  }
];

const partnerCategories = [
  {
    title: "Corporate Partners",
    description: "Leading organizations investing in African education excellence",
    icon: Building2
  },
  {
    title: "Government Partners",
    description: "Ministry of Education and national education bodies",
    icon: Globe
  },
  {
    title: "Media Partners",
    description: "Broadcasting and media organizations amplifying our reach",
    icon: Briefcase
  },
  {
    title: "NGO Partners",
    description: "Civil society organizations advancing education access",
    icon: Users
  }
];

const currentPartners = [
  { name: "African Development Bank", tier: "Platinum" },
  { name: "UNESCO Africa", tier: "Platinum" },
  { name: "African Union Commission", tier: "Gold" },
  { name: "Mastercard Foundation", tier: "Gold" },
  { name: "Ford Foundation", tier: "Gold" },
  { name: "Bill & Melinda Gates Foundation", tier: "Silver" },
  { name: "UNICEF Africa", tier: "Silver" },
  { name: "British Council Africa", tier: "Bronze" }
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-background">
      <NESAHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-nesa-gold/20 via-background to-nesa-gold/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-nesa-gold/20 text-nesa-gold border-nesa-gold/30">
              Strategic Partnerships
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Partner with <span className="text-nesa-gold">NESA-Africa</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join Africa's premier education excellence movement. Together, we recognize 
              and celebrate the educators transforming the continent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-nesa-gold hover:bg-nesa-gold/90 text-black">
                <Handshake className="w-5 h-5 mr-2" />
                Become a Partner
              </Button>
              <Button size="lg" variant="outline">
                Download Partnership Deck
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Partnership Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerCategories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-nesa-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <category.icon className="w-8 h-8 text-nesa-gold" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sponsorship Tiers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the partnership level that aligns with your organization's goals and investment capacity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorTiers.map((tier, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.color}`} />
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <p className="text-2xl font-bold text-nesa-gold">{tier.investment}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Partners</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentPartners.map((partner, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{partner.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {partner.tier} Partner
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-nesa-gold/20 to-amber-500/20">
        <div className="container mx-auto px-4 text-center">
          <Star className="w-12 h-12 text-nesa-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Partner with NESA-Africa and be part of the movement transforming education across the continent.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-nesa-gold hover:bg-nesa-gold/90 text-black">
              Contact Our Partnership Team
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <NESAFooter />
    </div>
  );
}
