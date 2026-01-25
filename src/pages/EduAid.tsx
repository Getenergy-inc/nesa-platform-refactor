import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  CreditCard,
  ExternalLink,
  GraduationCap,
  HandCoins,
  Handshake,
  Heart,
  Laptop,
  MapPin,
  Play,
  School,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import eduaidLogo from "@/assets/partners/eduaid-africa-logo.jpeg";

// EduAid-Africa brand colors
const eduaidColors = {
  green: "#4a7c23",
  brown: "#8b6914",
  lightGreen: "#6ba32d",
  darkGreen: "#3a6118",
};

const donationAmounts = [
  { value: "10", label: "$10", impact: "1 month school supplies" },
  { value: "25", label: "$25", impact: "3 months learning materials" },
  { value: "50", label: "$50", impact: "Full term textbooks" },
  { value: "100", label: "$100", impact: "Digital learning device" },
  { value: "250", label: "$250", impact: "Annual scholarship" },
  { value: "500", label: "$500", impact: "Full student sponsorship" },
];

const impactStats = [
  { value: "25,000+", label: "Students Supported", icon: GraduationCap },
  { value: "150+", label: "Partner Schools", icon: School },
  { value: "35", label: "African Countries", icon: MapPin },
  { value: "₦500M+", label: "Funds Distributed", icon: HandCoins },
];

const programs = [
  {
    title: "Scholarship Fund",
    description: "Providing full and partial scholarships to underprivileged students across Africa.",
    icon: GraduationCap,
    beneficiaries: "5,000+ students annually",
    color: eduaidColors.green,
  },
  {
    title: "Learning Materials",
    description: "Distributing textbooks, notebooks, and school supplies to students in need.",
    icon: BookOpen,
    beneficiaries: "100,000+ materials distributed",
    color: eduaidColors.brown,
  },
  {
    title: "Digital Education",
    description: "Equipping students with tablets, laptops, and internet access for modern learning.",
    icon: Laptop,
    beneficiaries: "2,500+ devices deployed",
    color: eduaidColors.lightGreen,
  },
  {
    title: "Teacher Training",
    description: "Professional development programs for educators to enhance teaching quality.",
    icon: Users,
    beneficiaries: "500+ teachers trained",
    color: eduaidColors.darkGreen,
  },
];

const partnershipTiers = [
  {
    name: "Champion Partner",
    investment: "$50,000+",
    benefits: ["Logo on all EduAid materials", "Named scholarship program", "Board seat opportunity", "Annual impact report"],
  },
  {
    name: "Gold Partner",
    investment: "$25,000",
    benefits: ["Logo on EduAid website", "Named learning center", "Quarterly updates", "Recognition at events"],
  },
  {
    name: "Silver Partner",
    investment: "$10,000",
    benefits: ["Website recognition", "School adoption program", "Impact certificate", "Event invitations"],
  },
];

const successStories = [
  {
    name: "Amara Okonkwo",
    country: "Nigeria",
    story: "From a rural village to university scholarship recipient. EduAid funded her secondary education.",
    image: "👩🏿‍🎓",
  },
  {
    name: "Kwame Asante",
    country: "Ghana",
    story: "Digital learning devices helped him discover his passion for coding. Now studying Computer Science.",
    image: "👨🏿‍💻",
  },
  {
    name: "Fatima Hassan",
    country: "Kenya",
    story: "Teacher training program transformed her classroom. Her students' pass rates increased by 40%.",
    image: "👩🏿‍🏫",
  },
];

export default function EduAid() {
  const [selectedAmount, setSelectedAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    // TODO: Integrate with payment provider
    console.log(`Donating $${amount} to EduAid-Africa`);
  };

  return (
    <>
      <Helmet>
        <title>EduAid-Africa | Funding Education Through Partnerships</title>
        <meta
          name="description"
          content="EduAid-Africa provides scholarships, learning materials, and digital education resources to underprivileged students across Africa. Support education transformation."
        />
        <meta property="og:title" content="EduAid-Africa | Funding Education Through Partnerships" />
        <meta property="og:description" content="Transform African education through direct student support, scholarships, and learning resources." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero Section - EduAid Branded */}
        <section 
          className="relative py-24 lg:py-32 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${eduaidColors.green}20 0%, transparent 40%, ${eduaidColors.brown}15 100%)` 
          }}
        >
          {/* Decorative elements */}
          <div 
            className="absolute top-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: eduaidColors.green }}
          />
          <div 
            className="absolute bottom-10 left-10 w-60 h-60 rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: eduaidColors.brown }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Logo and Branding */}
              <div className="flex-shrink-0 text-center lg:text-left">
                <div className="relative inline-block">
                  <div 
                    className="absolute -inset-6 rounded-3xl blur-2xl opacity-30"
                    style={{ backgroundColor: eduaidColors.green }}
                  />
                  <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                    <img 
                      src={eduaidLogo} 
                      alt="EduAid-Africa" 
                      className="w-64 h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <Badge 
                  className="mb-4 text-white border-0"
                  style={{ backgroundColor: eduaidColors.green }}
                >
                  A SCEF Initiative
                </Badge>
                
                <h1 className="mb-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Funding Education <br />
                  <span style={{ color: eduaidColors.lightGreen }}>Through Partnerships</span>
                </h1>
                
                <p className="mb-8 text-xl text-white/80 max-w-2xl">
                  EduAid-Africa is the funding and partnerships arm of Santos Creations Educational Foundation, 
                  dedicated to mobilizing resources for educational development across the continent.
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button 
                    size="lg" 
                    className="text-white border-0 shadow-lg text-lg px-8"
                    style={{ backgroundColor: eduaidColors.green }}
                    onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-white hover:bg-white/10 text-lg px-8"
                    style={{ borderColor: eduaidColors.brown }}
                    onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Target className="mr-2 h-5 w-5" />
                    Our Programs
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom gradient */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${eduaidColors.green}, ${eduaidColors.brown}, transparent)` 
            }}
          />
        </section>

        {/* Impact Stats */}
        <section 
          className="py-16"
          style={{ backgroundColor: `${eduaidColors.green}10` }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {impactStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                    style={{ backgroundColor: `${eduaidColors.green}20` }}
                  >
                    <stat.icon className="h-8 w-8" style={{ color: eduaidColors.green }} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-charcoal">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge 
                variant="outline" 
                className="mb-6"
                style={{ borderColor: eduaidColors.green, color: eduaidColors.lightGreen }}
              >
                Our Mission
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Every African Child Deserves Quality Education
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                EduAid-Africa bridges the gap between educational aspirations and resources. We partner with 
                individuals, corporations, and governments to fund scholarships, provide learning materials, 
                and deploy digital education tools to underserved communities across the continent.
              </p>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="py-20 bg-charcoal/95">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge 
                className="mb-4 text-white border-0"
                style={{ backgroundColor: eduaidColors.brown }}
              >
                What We Do
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                Our Core Programs
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program) => (
                <Card 
                  key={program.title}
                  className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
                >
                  <div 
                    className="h-1 w-full"
                    style={{ backgroundColor: program.color }}
                  />
                  <CardHeader>
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${program.color}20` }}
                    >
                      <program.icon className="h-7 w-7" style={{ color: program.color }} />
                    </div>
                    <CardTitle className="text-white text-xl">{program.title}</CardTitle>
                    <CardDescription className="text-white/60">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="text-sm font-medium px-3 py-1.5 rounded-full inline-block"
                      style={{ 
                        backgroundColor: `${program.color}15`,
                        color: program.color,
                      }}
                    >
                      {program.beneficiaries}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-charcoal">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge 
                variant="outline" 
                className="mb-4"
                style={{ borderColor: eduaidColors.green, color: eduaidColors.lightGreen }}
              >
                Impact Stories
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                Lives Transformed
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {successStories.map((story) => (
                <Card 
                  key={story.name}
                  className="border-white/10 bg-white/5 text-center"
                >
                  <CardHeader>
                    <div className="text-6xl mb-4">{story.image}</div>
                    <CardTitle className="text-white">{story.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className="mt-2"
                      style={{ borderColor: `${eduaidColors.green}50`, color: eduaidColors.lightGreen }}
                    >
                      {story.country}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 italic">"{story.story}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button 
                variant="outline"
                className="text-white hover:bg-white/10"
                style={{ borderColor: `${eduaidColors.green}50` }}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch More Stories
              </Button>
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section 
          id="donate" 
          className="py-20"
          style={{ 
            background: `linear-gradient(135deg, ${eduaidColors.green}15 0%, ${eduaidColors.brown}10 100%)` 
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge 
                  className="mb-4 text-white border-0"
                  style={{ backgroundColor: eduaidColors.green }}
                >
                  Make an Impact
                </Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  Support a Student's Future
                </h2>
                <p className="text-white/70 text-lg">
                  Every donation directly funds scholarships, learning materials, and digital education resources.
                </p>
              </div>
              
              <Card 
                className="border-0 bg-charcoal/80 backdrop-blur-sm"
                style={{ boxShadow: `0 0 60px ${eduaidColors.green}20` }}
              >
                <CardContent className="p-8">
                  {/* Amount Selection */}
                  <div className="mb-8">
                    <Label className="text-white mb-4 block text-lg">Select Amount</Label>
                    <RadioGroup
                      value={customAmount ? "custom" : selectedAmount}
                      onValueChange={(val) => {
                        if (val !== "custom") {
                          setSelectedAmount(val);
                          setCustomAmount("");
                        }
                      }}
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {donationAmounts.map((amount) => (
                        <Label
                          key={amount.value}
                          htmlFor={`amount-${amount.value}`}
                          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-all ${
                            selectedAmount === amount.value && !customAmount
                              ? "border-opacity-100 bg-opacity-20"
                              : "border-white/20 hover:border-white/40"
                          }`}
                          style={{
                            borderColor: selectedAmount === amount.value && !customAmount 
                              ? eduaidColors.green 
                              : undefined,
                            backgroundColor: selectedAmount === amount.value && !customAmount 
                              ? `${eduaidColors.green}15` 
                              : undefined,
                          }}
                        >
                          <RadioGroupItem 
                            value={amount.value} 
                            id={`amount-${amount.value}`} 
                            className="sr-only" 
                          />
                          <span 
                            className="text-2xl font-bold"
                            style={{ 
                              color: selectedAmount === amount.value && !customAmount 
                                ? eduaidColors.lightGreen 
                                : 'white' 
                            }}
                          >
                            {amount.label}
                          </span>
                          <span className="text-xs text-white/60 text-center mt-1">
                            {amount.impact}
                          </span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  {/* Custom Amount */}
                  <div className="mb-8">
                    <Label htmlFor="custom" className="text-white/70 mb-2 block">
                      Or enter a custom amount
                    </Label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg">$</span>
                      <Input
                        id="custom"
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="pl-8 bg-white/10 border-white/20 text-white text-lg h-12"
                      />
                    </div>
                  </div>
                  
                  {/* Summary & CTA */}
                  <div 
                    className="rounded-xl p-6 mb-6"
                    style={{ backgroundColor: `${eduaidColors.green}10` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/70">Your Donation</span>
                      <span className="text-3xl font-bold text-white">
                        ${customAmount || selectedAmount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
                      <Shield className="h-4 w-4" />
                      100% goes to education programs • Secure payment via Paystack / Flutterwave
                    </div>
                    <Button 
                      onClick={handleDonate}
                      size="lg"
                      className="w-full text-white text-lg h-14"
                      style={{ backgroundColor: eduaidColors.green }}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Donate ${customAmount || selectedAmount} to EduAid-Africa
                    </Button>
                  </div>
                  
                  {/* AfriGold Coins */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: `${eduaidColors.brown}15` }}
                  >
                    <Sparkles className="h-8 w-8" style={{ color: eduaidColors.brown }} />
                    <div className="flex-1">
                      <p className="text-white font-medium">Earn AfriGold Coins</p>
                      <p className="text-white/60 text-sm">
                        Get recognition points with every donation — unlock benefits and voting power.
                      </p>
                    </div>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                      style={{ borderColor: `${eduaidColors.brown}50` }}
                      className="text-white hover:bg-white/10"
                    >
                      <Link to="/wallet">
                        <Wallet className="mr-2 h-4 w-4" />
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="py-20 bg-charcoal">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge 
                className="mb-4 text-white border-0"
                style={{ backgroundColor: eduaidColors.brown }}
              >
                Partner With Us
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Corporate Partnership Opportunities
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Join leading organizations in transforming African education. 
                Partner with EduAid-Africa for meaningful CSR impact.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {partnershipTiers.map((tier, index) => (
                <Card 
                  key={tier.name}
                  className={`border-white/10 bg-white/5 ${index === 0 ? 'ring-2 ring-offset-2 ring-offset-charcoal' : ''}`}
                  style={{ 
                    ...(index === 0 && { 
                      outlineColor: eduaidColors.green,
                      boxShadow: `0 0 0 2px ${eduaidColors.green}`,
                    }),
                  }}
                >
                  <CardHeader className="text-center pb-2">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${eduaidColors.green}20` }}
                    >
                      <Handshake className="h-7 w-7" style={{ color: eduaidColors.green }} />
                    </div>
                    <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                    <div className="text-2xl font-bold" style={{ color: eduaidColors.lightGreen }}>
                      {tier.investment}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2 text-white/70 text-sm">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: eduaidColors.green }} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      asChild
                      className="w-full mt-6 text-white"
                      variant={index === 0 ? "default" : "outline"}
                      style={{ 
                        backgroundColor: index === 0 ? eduaidColors.green : undefined,
                        borderColor: index !== 0 ? `${eduaidColors.green}50` : undefined,
                      }}
                    >
                      <Link to="/contact?subject=eduaid-partnership">
                        Become a Partner
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Webinars Cross-Promo */}
        <section 
          className="py-16"
          style={{ backgroundColor: `${eduaidColors.green}10` }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-xl p-3">
                  <img src={eduaidLogo} alt="EduAid" className="h-12 w-auto" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">EduAid-Africa Webinar Series</h3>
                  <p className="text-white/60">Expert-led educational sessions every month</p>
                </div>
              </div>
              <Button 
                asChild
                size="lg"
                className="text-white"
                style={{ backgroundColor: eduaidColors.green }}
              >
                <Link to="/media/webinars">
                  View Webinars
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-charcoal">
          <div className="container mx-auto px-4">
            <div 
              className="max-w-4xl mx-auto rounded-3xl p-12 text-center"
              style={{ 
                background: `linear-gradient(135deg, ${eduaidColors.green}20, ${eduaidColors.brown}15)`,
                border: `1px solid ${eduaidColors.green}30`,
              }}
            >
              <Trophy className="h-16 w-16 mx-auto mb-6" style={{ color: eduaidColors.lightGreen }} />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Be Part of the Transformation
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of donors and partners who are changing the face of African education. 
                Every contribution creates ripples of opportunity.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg"
                  className="text-white text-lg px-8"
                  style={{ backgroundColor: eduaidColors.green }}
                  onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Today
                </Button>
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-white hover:bg-white/10 text-lg px-8"
                  style={{ borderColor: `${eduaidColors.green}50` }}
                >
                  <Link to="/contact?subject=eduaid">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
