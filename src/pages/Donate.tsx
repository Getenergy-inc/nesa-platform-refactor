import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle,
  CreditCard,
  Globe,
  Heart,
  MapPin,
  School,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { MiniMusicPlayer } from "@/components/nesa/MiniMusicPlayer";
import africaMapImg from "@/assets/africa-map-silhouette.png";

// African textile patterns
import kenteImg from "@/assets/patterns/kente-west-africa.jpg";
import ethiopianImg from "@/assets/patterns/ethiopian-east-africa.jpg";
import ndebeleImg from "@/assets/patterns/ndebele-southern-africa.jpg";
import kubaImg from "@/assets/patterns/kuba-central-africa.jpg";
import zelligeImg from "@/assets/patterns/zellige-north-africa.jpg";

const regions = [
  {
    name: "West Africa",
    school: "Hope Academy",
    country: "Nigeria",
    pattern: kenteImg,
    patternName: "Kente Cloth",
    color: "from-amber-500/80",
    accent: "border-amber-500/40",
  },
  {
    name: "East Africa",
    school: "Sunrise Inclusive School",
    country: "Kenya",
    pattern: ethiopianImg,
    patternName: "Ethiopian Weave",
    color: "from-blue-500/80",
    accent: "border-blue-500/40",
  },
  {
    name: "Southern Africa",
    school: "Rainbow Learning Centre",
    country: "South Africa",
    pattern: ndebeleImg,
    patternName: "Ndebele Art",
    color: "from-green-500/80",
    accent: "border-green-500/40",
  },
  {
    name: "North Africa",
    school: "Al-Noor Academy",
    country: "Morocco",
    pattern: zelligeImg,
    patternName: "Zellige Mosaic",
    color: "from-purple-500/80",
    accent: "border-purple-500/40",
  },
  {
    name: "Central Africa",
    school: "Unity Special Education",
    country: "Cameroon",
    pattern: kubaImg,
    patternName: "Kuba Cloth",
    color: "from-orange-500/80",
    accent: "border-orange-500/40",
  },
];

const donationAmounts = [
  { value: "10", label: "$10" },
  { value: "25", label: "$25" },
  { value: "50", label: "$50" },
  { value: "100", label: "$100" },
];

const impactPoints = [
  "Scholarships for underprivileged students",
  "Learning materials and textbooks",
  "School infrastructure development",
  "Teacher training programs",
];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState("25");
  const [customAmount, setCustomAmount] = useState("");

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    console.log(`Donating $${amount}`);
  };

  return (
    <>
      <Helmet>
        <title>Donate | Support African Education</title>
        <meta
          name="description"
          content="Support African education through NESA-Africa. Your donation transforms lives across the continent."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-20 overflow-hidden">
          {/* Africa map watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src={africaMapImg} alt="" className="w-[400px] h-auto opacity-[0.06]" aria-hidden="true" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Rebuild My School Africa</span>
              </div>
              <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                5 Schools. 5 Regions. <span className="text-primary">One Mission.</span>
              </h1>
              <p className="text-white/70">
                Each donation supports a special needs school in one of Africa's five regions — upgrading inclusive education facilities.
              </p>
            </div>
          </div>
        </section>

        {/* Regional School Cards with African Textiles */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-2 text-center font-display text-xl font-semibold text-white">
              Choose a School to Support
            </h2>
            <p className="mb-8 text-center text-sm text-white/50">
              Each card features the cultural textile heritage of its region
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {regions.map((region) => (
                <div key={region.name} className={`group relative overflow-hidden rounded-xl border ${region.accent}`}>
                  {/* Pattern background */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={region.pattern}
                      alt={`${region.patternName} — ${region.name}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t ${region.color} to-transparent opacity-70`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="h-3 w-3 text-white/60" />
                      <span className="text-[10px] text-white/60 uppercase tracking-wider">{region.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <School className="h-3.5 w-3.5 text-white" />
                      <h3 className="font-semibold text-white text-sm">{region.school}</h3>
                    </div>
                    <p className="text-[10px] text-white/60">{region.country} • {region.patternName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-xl">
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Make Your Donation</CardTitle>
                  <CardDescription className="text-white/60">
                    Every contribution helps build a brighter future
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Selection */}
                  <RadioGroup
                    value={customAmount ? "custom" : selectedAmount}
                    onValueChange={(val) => {
                      if (val !== "custom") {
                        setSelectedAmount(val);
                        setCustomAmount("");
                      }
                    }}
                    className="grid grid-cols-4 gap-3"
                  >
                    {donationAmounts.map((amount) => (
                      <Label
                        key={amount.value}
                        htmlFor={amount.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border py-3 font-semibold transition-all ${
                          selectedAmount === amount.value && !customAmount
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-white/20 text-white/70 hover:border-white/40"
                        }`}
                      >
                        <RadioGroupItem value={amount.value} id={amount.value} className="sr-only" />
                        {amount.label}
                      </Label>
                    ))}
                  </RadioGroup>

                  {/* Custom Amount */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/60">Or enter custom:</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">$</span>
                      <Input
                        type="number"
                        min="1"
                        placeholder="0"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="border-white/20 bg-white/5 pl-7 text-white"
                      />
                    </div>
                  </div>

                  {/* Impact Points */}
                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="mb-3 text-sm font-medium text-white">Your donation supports:</p>
                    <ul className="space-y-2">
                      {impactPoints.map((point) => (
                        <li key={point} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                    <Shield className="h-4 w-4" />
                    Secure payment via Paystack / Flutterwave
                  </div>

                  {/* Donate Button */}
                  <Button
                    onClick={handleDonate}
                    size="lg"
                    className="w-full bg-primary text-primary-foreground"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Donate ${customAmount || selectedAmount}
                  </Button>

                  <p className="text-center text-xs text-white/50">
                    NESA-Africa is a programme of Santos Creations Educational Foundation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Music For A Cause */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-xl">
              <div className="text-center mb-4">
                <p className="text-sm text-white/60">
                  <span className="text-gold font-medium">Music for a Cause</span> — Stream our anthems while you give
                </p>
              </div>
              <MiniMusicPlayer />
            </div>
          </div>
        </section>

        {/* Other Ways Section */}
        <section className="border-t border-white/10 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6">
              <Link to="/partners" className="group flex items-center gap-2 text-white/70 hover:text-primary">
                <Users className="h-5 w-5" />
                <span className="text-sm">Become a Partner</span>
              </Link>
              <Link to="/volunteer" className="group flex items-center gap-2 text-white/70 hover:text-primary">
                <Heart className="h-5 w-5" />
                <span className="text-sm">Volunteer</span>
              </Link>
              <Link to="/chapters" className="group flex items-center gap-2 text-white/70 hover:text-primary">
                <Globe className="h-5 w-5" />
                <span className="text-sm">Join a Chapter</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} Santos Creations Educational Foundation. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
