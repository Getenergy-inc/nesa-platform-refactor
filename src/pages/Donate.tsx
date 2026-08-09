import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { toast } from "sonner";
import { initPayment } from "@/api/payments";
import { PaymentDestinationBadge } from "@/components/payments/PaymentDestinationBadge";
import { paymentProgram, WALLET_NAME } from "@/config/walletBranding";
import { MiniMusicPlayer } from "@/components/nesa/MiniMusicPlayer";
import { DonorTrustPanel } from "@/components/governance/DonorTrustPanel";
import africaMapImg from "@/assets/africa-map-silhouette.png";
import { RegionalSchoolInterventionSection } from "@/components/donate/RegionalSchoolInterventionSection";
import { ProvidusBankAccounts } from "@/components/donate/ProvidusBankAccounts";
import { TOTAL_REGIONS, TOTAL_SLOTS } from "@/config/specialNeedsSchoolSlots";

const donationAmounts = [
  { value: "10", label: "$10" },
  { value: "25", label: "$25" },
  { value: "50", label: "$50" },
  { value: "100", label: "$100" },
];

const impactPoints = [
  "Accessibility upgrades for inclusive classrooms",
  "Assistive learning tools & special-needs materials",
  "Teacher support & inclusive education training",
  "WASH, digital learning, and safety improvements",
];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState("25");
  const [customAmount, setCustomAmount] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const returnTo = searchParams.get("return_to");
  const isPledgeMode = Boolean(returnTo);

  const [submitting, setSubmitting] = useState(false);

  const handleDonate = async () => {
    const amount = Number(customAmount || selectedAmount);

    if (isPledgeMode) {
      if (returnTo) {
        try {
          const url = new URL(returnTo, window.location.origin);
          url.searchParams.set("pledged", "success");
          navigate(url.pathname + url.search + url.hash, { replace: true });
        } catch {
          navigate(returnTo, { replace: true });
        }
      }
      return;
    }

    if (!amount || amount < 1) {
      toast.error("Enter a donation amount of at least $1.");
      return;
    }

    setSubmitting(true);
    try {
      // EduAid-Africa receives every donation made here (Rebuild My School Africa).
      const { data, error } = await initPayment(
        amount,
        paymentProgram("eduaid", "rebuild_my_school"),
        "USD",
        { destination: "eduaid", cause: "rebuild_my_school_africa", wallet: WALLET_NAME }
      );

      if (error || !data?.success) {
        toast.error(error || "We could not start that payment. Please try again.");
        return;
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }

      toast.success(
        data.message || "Donation recorded. A receipt will be sent once payment is confirmed."
      );
    } catch (e) {
      console.error("Donation init failed", e);
      toast.error("We could not start that payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                {TOTAL_REGIONS} Regions. {TOTAL_SLOTS} Nominations.{" "}
                <span className="text-primary">{TOTAL_REGIONS} Schools Picked for 2027.</span>
              </h1>
              <p className="text-white/70">
                Through EduAid-Africa and Rebuild My School Africa, NESA-Africa 2026
                opens 20 Special Needs School nomination slots in each of the approved
                8 African regions. After regional intervention voting, only{" "}
                <span className="text-gold font-semibold">1 school per region</span> —
                8 schools continent-wide — will be selected for the 2027 intervention.
              </p>
            </div>
          </div>
        </section>

        {isPledgeMode && (
          <section className="pt-2">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-white/80 flex items-start gap-3">
                <Heart className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <p>
                  <span className="text-gold font-semibold">Pledge mode.</span> No payment will be
                  processed here. Submitting records your pledge interest and returns you to the
                  Rebuild My School Africa page with a confirmation.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Donor Trust */}
        <section className="py-6">
          <div className="container mx-auto px-4 max-w-3xl">
            <DonorTrustPanel />
          </div>
        </section>

        {/* Regional Special Needs School Intervention */}
        <RegionalSchoolInterventionSection />

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

                  <PaymentDestinationBadge
                    org="eduaid"
                    detail="Rebuild My School Africa — special-needs school interventions"
                  />

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                    <Shield className="h-4 w-4" />
                    Secure checkout via the {WALLET_NAME} (Paystack / Flutterwave)
                  </div>

                  {/* Donate / Pledge Button */}
                  <Button
                    onClick={handleDonate}
                    size="lg"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground"
                  >
                    {isPledgeMode ? (
                      <>
                        <Heart className="mr-2 h-5 w-5" />
                        Submit Pledge ${customAmount || selectedAmount}
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Donate ${customAmount || selectedAmount}
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-white/50">
                    NESA-Africa is a programme of Santos Creations Educational Foundation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Providus Bank Manual Transfer Hub */}
        <ProvidusBankAccounts />

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
