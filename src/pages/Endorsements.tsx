import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSeason } from "@/contexts/SeasonContext";
import { 
  ArrowLeft, 
  Quote, 
  Star, 
  Globe,
  Building,
  GraduationCap,
  Users,
  Award
} from "lucide-react";

interface Endorsement {
  id: string;
  name: string;
  title: string;
  organization: string;
  category: "government" | "education" | "corporate" | "civil-society";
  country: string;
  quote: string;
  imageUrl?: string;
}

const endorsements: Endorsement[] = [
  {
    id: "1",
    name: "Dr. Aisha Muhammed",
    title: "Minister of Education",
    organization: "Federal Ministry of Education",
    category: "government",
    country: "Nigeria",
    quote: "NESA-Africa represents a transformative initiative that recognizes and celebrates the heroes of African education. Their commitment to transparency and governance sets a new standard for awards programs across the continent.",
  },
  {
    id: "2",
    name: "Prof. Kwame Asante",
    title: "Vice Chancellor",
    organization: "University of Ghana",
    category: "education",
    country: "Ghana",
    quote: "The rigorous review process and commitment to excellence makes NESA-Africa a beacon of hope for educational advancement in Africa. We proudly endorse this initiative.",
  },
  {
    id: "3",
    name: "Chief Olufemi Adeyemi",
    title: "CEO",
    organization: "Pan-African Education Trust",
    category: "corporate",
    country: "South Africa",
    quote: "NESA-Africa's governance-grade approach to recognizing educational excellence aligns perfectly with our vision for a transformed Africa. Their integrity is unmatched.",
  },
  {
    id: "4",
    name: "Dr. Amara Diallo",
    title: "Executive Director",
    organization: "West African Education Coalition",
    category: "civil-society",
    country: "Senegal",
    quote: "What sets NESA-Africa apart is their unwavering commitment to fairness and transparency. Every nominee, every vote, every decision is auditable and accountable.",
  },
  {
    id: "5",
    name: "Hon. Grace Okonkwo",
    title: "Chair, Education Committee",
    organization: "African Union",
    category: "government",
    country: "Ethiopia",
    quote: "NESA-Africa embodies the pan-African spirit of educational excellence. Their vision for 2035 aligns with the AU's Agenda 2063 for education transformation.",
  },
  {
    id: "6",
    name: "Dr. Mohamed El-Rashid",
    title: "Dean, Faculty of Education",
    organization: "Cairo University",
    category: "education",
    country: "Egypt",
    quote: "The academic rigor and professional standards maintained by NESA-Africa make it a truly credible platform for recognizing educational achievement across our continent.",
  },
];

const categoryConfig = {
  government: { label: "Government", icon: Building, color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  education: { label: "Education", icon: GraduationCap, color: "bg-green-500/10 text-green-400 border-green-500/30" },
  corporate: { label: "Corporate", icon: Globe, color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  "civil-society": { label: "Civil Society", icon: Users, color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
};

export default function Endorsements() {
  const { currentEdition } = useSeason();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Helmet>
        <title>Endorsements | {currentEdition.name}</title>
        <meta
          name="description"
          content="See what leaders across Africa are saying about NESA-Africa. Endorsements from government, education, corporate, and civil society."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal py-16 sm:py-20">
          <div className="container">
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Partners</span>
            </Link>

            <div className="max-w-3xl">
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                <Star className="h-3 w-3 mr-1" />
                Voices of Support
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Endorsed by <span className="text-gold">Africa's Leaders</span>
              </h1>
              <p className="text-white/70 text-lg">
                Hear from distinguished leaders across government, education, business, and civil society 
                who support NESA-Africa's mission to celebrate educational excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-b border-gold/10">
          <div className="container">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const count = endorsements.filter(e => e.category === key).length;
                const Icon = config.icon;
                return (
                  <Card key={key} className="bg-charcoal-light border-gold/10">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${config.color.split(' ')[0]}`}>
                        <Icon className={`h-5 w-5 ${config.color.split(' ')[1]}`} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">{count}</p>
                        <p className="text-white/60 text-sm">{config.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Endorsements Grid */}
        <section className="py-12 sm:py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {endorsements.map((endorsement) => {
                const config = categoryConfig[endorsement.category];
                const Icon = config.icon;

                return (
                  <Card 
                    key={endorsement.id} 
                    className="bg-charcoal-light border-gold/10 hover:border-gold/30 transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      {/* Quote Icon */}
                      <Quote className="h-10 w-10 text-gold/30 mb-4" />

                      {/* Quote Text */}
                      <blockquote className="text-white/80 text-lg leading-relaxed mb-6 italic">
                        "{endorsement.quote}"
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 border-2 border-gold/20">
                          <AvatarImage src={endorsement.imageUrl} alt={endorsement.name} />
                          <AvatarFallback className="bg-gold/20 text-gold font-bold">
                            {getInitials(endorsement.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <p className="font-display font-semibold text-white">
                            {endorsement.name}
                          </p>
                          <p className="text-gold text-sm">{endorsement.title}</p>
                          <p className="text-white/60 text-sm">{endorsement.organization}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={config.color}>
                              <Icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            <Badge variant="outline" className="border-gold/20 text-white/60">
                              {endorsement.country}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 border-t border-gold/10">
          <div className="container">
            <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20 max-w-3xl mx-auto">
              <CardContent className="py-10 text-center">
                <Award className="h-12 w-12 text-gold mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-white mb-3">
                  Join Our Growing Network
                </h2>
                <p className="text-white/70 mb-6 max-w-xl mx-auto">
                  Become a partner or endorser of NESA-Africa and help us celebrate educational excellence across the continent.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/partners">
                    <Button className="bg-gold hover:bg-gold-light text-charcoal font-semibold">
                      Become a Partner
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
