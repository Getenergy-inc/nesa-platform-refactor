import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle,
  Globe,
  Heart,
  MapPin,
  School,
  Users,
} from "lucide-react";
import { useState } from "react";
import { PaymentDestinationBadge } from "@/components/payments/PaymentDestinationBadge";
import { ScefFormRequired } from "@/components/nesa/ContentRequired";
import { MiniMusicPlayer } from "@/components/nesa/MiniMusicPlayer";
import { DonorTrustPanel } from "@/components/governance/DonorTrustPanel";
import africaMapImg from "@/assets/africa-map-silhouette.png";
import { RegionalSchoolInterventionSection } from "@/components/donate/RegionalSchoolInterventionSection";
import { TOTAL_REGIONS, TOTAL_SLOTS } from "@/config/specialNeedsSchoolSlots";
import {
  FRIENDS_BRAND,
  FRIENDS_ROLE_CLARITY,
  FRIENDS_SUPPORT_AREAS,
  IMPACT_TRUST_STATEMENTS,
} from "@/config/educationSocialImpact";

const donationAmounts = [
  { value: "10", label: "$10" },
  { value: "25", label: "$25" },
  { value: "50", label: "$50" },
  { value: "100", label: "$100" },
];

// Framed with Friends of EduAid-Africa support-area language.
const impactPoints = FRIENDS_SUPPORT_AREAS.slice(0, 4);


export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState("25");
  const [customAmount, setCustomAmount] = useState("");

  return (
    <>
      <Helmet>
        <title>Friends of EduAid-Africa · Support Education for All</title>
        <meta name="description" content={FRIENDS_BRAND.shortDescription} />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-20 overflow-hidden">
          {/* Africa map watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src={africaMapImg} alt="" className="w-[400px] h-auto opacity-[0.06]" aria-hidden="true" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Global funding and support movement
                </span>
              </div>
              <h1 className="mb-3 font-display text-3xl font-bold text-white md:text-4xl">
                {FRIENDS_BRAND.name}
              </h1>
              <p className="text-lg text-white/85 mb-4">{FRIENDS_BRAND.headline}</p>
              <p className="text-sm md:text-base text-white/65 leading-relaxed">
                {FRIENDS_BRAND.body}
              </p>
              <Link
                to="/impact/friends-of-eduaid-africa"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
              >
                Learn more about Friends of EduAid-Africa →
              </Link>
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gold/25 bg-gold/[0.06] p-6">
              <p className="font-display text-base md:text-lg leading-snug text-white">
                {FRIENDS_BRAND.featureMessage}
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-widest text-gold/80 mb-3">
                Current focus · Rebuild My School Africa
              </p>
              <p className="text-sm text-white/70">
                {TOTAL_REGIONS} regions · {TOTAL_SLOTS} nomination slots · 1 special-needs
                school per region selected for the 2027 intervention.
              </p>
            </div>
          </div>
        </section>


        {/* Donor Trust */}
        <section className="py-6">
          <div className="container mx-auto px-4 max-w-3xl">
            <DonorTrustPanel />
          </div>
        </section>

        {/* Regional Special Needs School Intervention */}
        <RegionalSchoolInterventionSection />

        {/* Role clarity — who does what */}
        <section className="py-6">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-display text-lg font-bold text-gold mb-3">Who Does What</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {FRIENDS_ROLE_CLARITY.map((r) => (
                <div key={r.actor} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">{r.actor}</p>
                  <p className="mt-1 text-sm text-white/60">{r.role}</p>
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
                  <CardTitle className="text-2xl text-white">Become a Friend of EduAid-Africa</CardTitle>
                  <CardDescription className="text-white/60">
                    Your support funds verified education interventions across Africa
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
                    <p className="mb-3 text-sm font-medium text-white">
                      What Friends of EduAid-Africa support:
                    </p>

                    <ul className="space-y-2">
                      {impactPoints.map((point) => (
                        <li key={point} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <PaymentDestinationBadge
                    org="eduaid"
                    detail="Rebuild My School Africa — special-needs school interventions"
                  />

                  <ScefFormRequired kind="donation" />

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

        {/* Trust & governance */}
        <section className="border-t border-white/10 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-display text-lg font-bold text-gold mb-4">Trust and Governance</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {IMPACT_TRUST_STATEMENTS.slice(0, 2).map((t) => (
                <div key={t.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-sm font-semibold text-gold">{t.title}</h3>
                  <p className="mt-2 text-sm text-white/65">{t.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-white/45">
              Support given through Friends of EduAid-Africa is received by EduAid-Africa under
              Santos Creations Educational Foundation.
            </p>
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
