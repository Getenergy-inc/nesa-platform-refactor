import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle,
  CreditCard,
  Globe,
  Heart,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";

// Regional education images
import westAfricaImg from "@/assets/regions/west-africa-education.jpg";
import eastAfricaImg from "@/assets/regions/east-africa-education.jpg";
import southernAfricaImg from "@/assets/regions/southern-africa-education.jpg";
import northAfricaImg from "@/assets/regions/north-africa-education.jpg";
import centralAfricaImg from "@/assets/regions/central-africa-education.jpg";

const regions = [
  { 
    name: "West Africa", 
    image: westAfricaImg, 
    countries: "Nigeria, Ghana, Senegal...",
    color: "from-amber-500/80"
  },
  { 
    name: "East Africa", 
    image: eastAfricaImg, 
    countries: "Kenya, Tanzania, Uganda...",
    color: "from-blue-500/80"
  },
  { 
    name: "Southern Africa", 
    image: southernAfricaImg, 
    countries: "South Africa, Botswana, Zimbabwe...",
    color: "from-green-500/80"
  },
  { 
    name: "North Africa", 
    image: northAfricaImg, 
    countries: "Egypt, Morocco, Tunisia...",
    color: "from-red-500/80"
  },
  { 
    name: "Central Africa", 
    image: centralAfricaImg, 
    countries: "DRC, Cameroon, Gabon...",
    color: "from-purple-500/80"
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
        <section className="relative py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Make a Difference</span>
              </div>
              <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                Support African <span className="text-primary">Education</span>
              </h1>
              <p className="text-white/70">
                Your donation powers educational transformation across all five regions of Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Regional Showcase */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-display text-xl font-semibold text-white">
              The Future of Education Across Africa
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {regions.map((region) => (
                <div key={region.name} className="group relative overflow-hidden rounded-xl">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={region.image}
                      alt={`Education in ${region.name}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t ${region.color} to-transparent opacity-80`} />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-semibold text-white">{region.name}</h3>
                    <p className="text-xs text-white/80">{region.countries}</p>
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
