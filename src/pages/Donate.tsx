import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  BookOpen,
  CheckCircle,
  CreditCard,
  Globe,
  GraduationCap,
  Heart,
  School,
  Shield,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";

const donationAmounts = [
  { value: "5", label: "$5", description: "General Support" },
  { value: "20", label: "$20", description: "Certificate-Linked" },
  { value: "50", label: "$50", description: "Student Sponsor" },
  { value: "100", label: "$100", description: "Program Support" },
  { value: "500", label: "$500", description: "Major Donor" },
];

const impactStats = [
  { icon: Users, value: "50,000+", label: "Students Impacted" },
  { icon: School, value: "150+", label: "Schools Supported" },
  { icon: BookOpen, value: "100,000+", label: "Learning Materials" },
  { icon: Globe, value: "30+", label: "Countries Reached" },
];

const fundingSplits = [
  { name: "Platform Operations", percentage: 40, description: "Running the awards program" },
  { name: "EduAid-Africa", percentage: 25, description: "Direct student support" },
  { name: "Rebuild My School", percentage: 25, description: "Infrastructure development" },
  { name: "Local Chapters", percentage: 10, description: "Regional operations" },
];

export default function Donate() {
  const { currentEdition } = useSeason();
  const [selectedAmount, setSelectedAmount] = useState("20");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("general");

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    // TODO: Integrate with Paystack/Flutterwave
    console.log(`Donating $${amount} to ${selectedProgram}`);
  };

  return (
    <>
      <Helmet>
        <title>Donate | Support NESA-Africa Education Initiatives</title>
        <meta
          name="description"
          content="Support African education through NESA-Africa, EduAid-Africa, and Rebuild My School Africa. Every donation transforms lives."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Transform Lives
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Support African <span className="text-primary">Education</span>
              </h1>
              <p className="mb-8 text-lg text-white/70">
                Your donation powers the recognition of education champions, provides direct
                student support, and rebuilds schools across Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
              {impactStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Form */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
              {/* Left: Program Selection */}
              <div>
                <h2 className="mb-6 font-display text-2xl font-bold text-white">
                  Choose a Program
                </h2>
                <Tabs value={selectedProgram} onValueChange={setSelectedProgram} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-white/5">
                    <TabsTrigger value="general" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      General
                    </TabsTrigger>
                    <TabsTrigger value="eduaid" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      EduAid
                    </TabsTrigger>
                    <TabsTrigger value="rebuild" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      Rebuild
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general">
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-white">NESA-Africa General Fund</CardTitle>
                        <CardDescription className="text-white/60">
                          Support the entire NESA-Africa ecosystem — awards, media, and operations.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {fundingSplits.map((split) => (
                          <div key={split.name} className="flex items-center justify-between text-sm">
                            <span className="text-white/70">{split.name}</span>
                            <Badge variant="outline" className="border-white/20 text-white/60">
                              {split.percentage}%
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="eduaid">
                    <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent">
                      <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                          <GraduationCap className="h-6 w-6 text-blue-400" />
                        </div>
                        <CardTitle className="text-white">EduAid-Africa</CardTitle>
                        <CardDescription className="text-white/60">
                          Direct student support — scholarships, learning materials, and educational resources.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {[
                            "Scholarships for underprivileged students",
                            "School supplies and textbooks",
                            "Digital learning devices",
                            "Tuition assistance programs",
                          ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="rebuild">
                    <Card className="border-white/10 bg-gradient-to-br from-green-500/10 to-transparent">
                      <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                          <School className="h-6 w-6 text-green-400" />
                        </div>
                        <CardTitle className="text-white">Rebuild My School Africa</CardTitle>
                        <CardDescription className="text-white/60">
                          Infrastructure development — renovating special needs education facilities across Africa.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {[
                            "Classroom construction and renovation",
                            "Library and laboratory equipment",
                            "Accessible facilities for special needs",
                            "Clean water and sanitation",
                          ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right: Amount Selection */}
              <div>
                <h2 className="mb-6 font-display text-2xl font-bold text-white">
                  Select Amount
                </h2>
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="space-y-6 pt-6">
                    <RadioGroup
                      value={customAmount ? "custom" : selectedAmount}
                      onValueChange={(val) => {
                        if (val !== "custom") {
                          setSelectedAmount(val);
                          setCustomAmount("");
                        }
                      }}
                      className="grid grid-cols-3 gap-3"
                    >
                      {donationAmounts.map((amount) => (
                        <Label
                          key={amount.value}
                          htmlFor={amount.value}
                          className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-all ${
                            selectedAmount === amount.value && !customAmount
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-white/10 text-white/70 hover:border-white/30"
                          }`}
                        >
                          <RadioGroupItem value={amount.value} id={amount.value} className="sr-only" />
                          <span className="text-lg font-bold">{amount.label}</span>
                          <span className="text-xs opacity-60">{amount.description}</span>
                        </Label>
                      ))}
                      <div
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all ${
                          customAmount
                            ? "border-primary bg-primary/10"
                            : "border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        <Label htmlFor="custom-amount" className="text-sm font-medium text-white/70">
                          Custom
                        </Label>
                        <div className="relative mt-2">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60">$</span>
                          <Input
                            id="custom-amount"
                            type="number"
                            min="1"
                            placeholder="0"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="w-20 border-white/20 bg-white/5 pl-6 text-center text-white"
                          />
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="space-y-4 border-t border-white/10 pt-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Donation Amount</span>
                        <span className="font-semibold text-white">
                          ${customAmount || selectedAmount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <Shield className="h-4 w-4" />
                        Secure payment via Paystack / Flutterwave
                      </div>
                    </div>

                    <Button
                      onClick={handleDonate}
                      size="lg"
                      className="w-full bg-primary text-primary-foreground"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Donate ${customAmount || selectedAmount}
                    </Button>

                    <p className="text-center text-xs text-white/50">
                      NESA-Africa is a programme of Santos Creations Educational Foundation,
                      a registered non-profit organization.
                    </p>
                  </CardContent>
                </Card>

                {/* AfriGold Coin */}
                <Card className="mt-6 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg text-white">AfriGold Coin</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-white/70">
                      Earn recognition points with every donation. AfriGold Coins unlock exclusive
                      benefits and voting power — not a security or stored value.
                    </p>
                    <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
                      <Link to="/wallet">
                        <Wallet className="mr-2 h-4 w-4" />
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Other Ways to Support */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-2xl font-bold text-white">
              Other Ways to Support
            </h2>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5 text-center">
                <CardHeader>
                  <Users className="mx-auto h-10 w-10 text-primary" />
                  <CardTitle className="text-white">Become a Partner</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-white/60">
                    Corporate sponsorship and partnership opportunities.
                  </p>
                  <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/partners">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-center">
                <CardHeader>
                  <Heart className="mx-auto h-10 w-10 text-primary" />
                  <CardTitle className="text-white">Volunteer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-white/60">
                    Join the NRC or event volunteer team.
                  </p>
                  <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/volunteer">Get Involved</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-center">
                <CardHeader>
                  <Globe className="mx-auto h-10 w-10 text-primary" />
                  <CardTitle className="text-white">Join a Chapter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-white/60">
                    Connect with your regional chapter.
                  </p>
                  <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/chapters">Find Chapters</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
