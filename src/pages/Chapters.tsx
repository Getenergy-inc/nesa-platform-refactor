import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  Globe2, 
  ArrowRight,
  Flag,
  CheckCircle,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const regions = [
  {
    name: "West Africa",
    countries: ["Nigeria", "Ghana", "Senegal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Niger", "Benin", "Togo", "Guinea"],
    activeChapters: 8,
    color: "bg-green-500"
  },
  {
    name: "East Africa",
    countries: ["Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia", "Somalia", "South Sudan", "Burundi"],
    activeChapters: 6,
    color: "bg-blue-500"
  },
  {
    name: "Southern Africa",
    countries: ["South Africa", "Zimbabwe", "Zambia", "Botswana", "Namibia", "Mozambique", "Malawi", "Angola"],
    activeChapters: 7,
    color: "bg-purple-500"
  },
  {
    name: "North Africa",
    countries: ["Egypt", "Morocco", "Tunisia", "Algeria", "Libya", "Sudan"],
    activeChapters: 4,
    color: "bg-amber-500"
  },
  {
    name: "Central Africa",
    countries: ["DRC", "Cameroon", "Chad", "CAR", "Congo", "Gabon", "Equatorial Guinea"],
    activeChapters: 5,
    color: "bg-red-500"
  }
];

const chapterBenefits = [
  "Lead nominations in your country",
  "Host regional recognition events",
  "Build local educator networks",
  "Access exclusive training programs",
  "Represent NESA at national forums",
  "Coordinate with Ministry of Education"
];

const chapterRoles = [
  {
    title: "Chapter Lead",
    description: "Overall leadership and strategic direction for the country chapter",
    requirements: ["10+ years in education sector", "Strong network", "Leadership experience"]
  },
  {
    title: "Nominations Coordinator",
    description: "Manage nomination outreach and submission quality in your region",
    requirements: ["5+ years experience", "Attention to detail", "Communication skills"]
  },
  {
    title: "Events Manager",
    description: "Organize local ceremonies, workshops, and educator gatherings",
    requirements: ["Event planning experience", "Vendor management", "Budget oversight"]
  },
  {
    title: "Communications Lead",
    description: "Handle media relations, social media, and stakeholder communications",
    requirements: ["PR/Communications background", "Writing skills", "Media contacts"]
  }
];

export default function Chapters() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
              Pan-African Network
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              NESA-Africa <span className="text-gold">Country Chapters</span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              30 country chapters across 5 regions, working together to celebrate 
              education excellence in every corner of Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold">
                <Flag className="w-5 h-5 mr-2" />
                Start a Chapter
              </Button>
              <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                Find Your Chapter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-nesa-gold">30</p>
              <p className="text-muted-foreground">Active Chapters</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-nesa-gold">5</p>
              <p className="text-muted-foreground">Regions Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-nesa-gold">500+</p>
              <p className="text-muted-foreground">Chapter Volunteers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-nesa-gold">54</p>
              <p className="text-muted-foreground">Countries Targeted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Chapters by Region</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${region.color}`} />
                    <CardTitle>{region.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {region.activeChapters} Active Chapters
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {region.countries.map((country, countryIndex) => (
                      <Badge key={countryIndex} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter Roles */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Chapter Leadership Roles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join the leadership team driving education excellence in your country
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {chapterRoles.map((role, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-nesa-gold" />
                    {role.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{role.description}</p>
                  <div className="space-y-2">
                    {role.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Chapter Benefits</h2>
              <p className="text-muted-foreground">
                As a chapter leader, you'll have the opportunity to shape education recognition in your country
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {chapterBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-nesa-gold flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-nesa-gold/20 to-amber-500/20">
        <div className="container mx-auto px-4 text-center">
          <Globe2 className="w-12 h-12 text-nesa-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Lead in Your Country?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you want to start a new chapter or join an existing one, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-nesa-gold hover:bg-nesa-gold/90 text-black">
                Apply to Lead a Chapter
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              <Mail className="w-5 h-5 mr-2" />
              Contact Regional Lead
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
