import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Check,
  CreditCard,
  Gift,
  Heart,
  Minus,
  Plus,
  QrCode,
  Receipt,
  Shield,
  Sparkles,
  Star,
  Ticket,
  Users,
  Wallet,
  ArrowRight,
  Info,
  Clock,
  Share2,
  Vote,
} from "lucide-react";

import galaHeroImage from "@/assets/events/award-gala.jpeg";
import {
  TICKET_TIERS,
  DONATION_CAUSES,
  DONATION_FREQUENCIES,
  PAYMENT_METHODS,
  GALA_EVENT,
  GALA_FAQS,
  CHECKOUT_INFO,
  type DonationFrequencyType,
  type DonationCauseType,
} from "@/config/galaConfig";
import { AGC_BONUS_RATES, VOTING_SERVICES, REFERRAL_EARN_COPY } from "@/constants/agc";
import { TicketTierCards, ReferralLinkCard, AgcDisclosure } from "@/components/tickets";
import { useReferralCode } from "@/hooks/useReferralCode";

export default function BuyYourTicket() {
  const { currentEdition } = useSeason();
  const { toast } = useToast();
  const { referralCode } = useReferralCode();
  
  // Refs for scroll
  const ticketSectionRef = useRef<HTMLDivElement>(null);
  const donationSectionRef = useRef<HTMLDivElement>(null);
  const referralSectionRef = useRef<HTMLDivElement>(null);
  
  // State
  const [selectedTier, setSelectedTier] = useState<string>("PREMIUM");
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCause, setSelectedCause] = useState<DonationCauseType>("REBUILD_MY_SCHOOL");
  const [donationAmount, setDonationAmount] = useState<string>("50");
  const [donationTab, setDonationTab] = useState<DonationFrequencyType>("ONE_TIME");
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Scroll handling for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectedTicket = TICKET_TIERS.find((t) => t.id === selectedTier);
  const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
  const bonusAgc = subtotal * AGC_BONUS_RATES.purchaseBonus;

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && selectedTicket && newQty <= selectedTicket.maxPerOrder) {
      setQuantity(newQty);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, tab?: DonationFrequencyType) => {
    if (tab) {
      setDonationTab(tab);
    }
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "🎟️ Ticket Reserved!",
      description: `Your ${quantity}x ${selectedTicket?.name} ticket(s) have been reserved. +${bonusAgc} AGC bonus credited! QR e-ticket sent to your email.`,
    });
    setIsProcessing(false);
  };

  const handleDonate = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const frequency = donationTab === "MONTHLY" ? "monthly" : "one-time";
    toast({
      title: "❤️ Thank You!",
      description: `Your ${frequency} donation of $${donationAmount} has been processed. Receipt sent to your email.`,
    });
    setIsProcessing(false);
  };

  return (
    <>
      <Helmet>
        <title>Buy Your Ticket – NESA-Africa Gala 2026</title>
        <meta
          name="description"
          content="Purchase tickets for the NESA-Africa Grand Gala Night 2026. Join education leaders for a night of celebration and impact."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] overflow-hidden">
          <img
            src={galaHeroImage}
            alt="NESA-Africa Gala"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/90 via-charcoal/70 to-charcoal" />
          
          <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/40">
                <Calendar className="mr-2 h-3 w-3" />
                {GALA_EVENT.date}
              </Badge>
              
              <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                BUY YOUR TICKET
              </h1>
              <p className="mt-2 text-xl text-primary md:text-2xl">
                NESA-Africa Gala {GALA_EVENT.year}
              </p>
              
              <p className="mx-auto mt-4 text-2xl font-light text-white/90 italic">
                One night. One continent. One mission.
              </p>
              
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                Join education leaders, innovators, partners, and changemakers from Africa and the diaspora 
                for a red-carpet celebration of impact—and a powerful commitment to rebuild education where it matters most.
              </p>

              {/* Hero CTAs */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => scrollToSection(ticketSectionRef)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  Select Tickets
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection(donationSectionRef, "ONE_TIME")}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection(donationSectionRef, "MONTHLY")}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Start Monthly Giving
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          {/* Impact Section */}
          <section className="mb-16">
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-2">
                      ❤️ Your Ticket = Real Impact
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Every ticket purchased directly supports EduAid-Africa + SCEF services, including:
                    </p>
                    <div className="p-4 rounded-lg bg-card/50 border border-primary/20">
                      <p className="font-semibold text-primary">
                        Rebuild My School (2026–2027) — NESA-Africa Legacy Project
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Helping schools—especially special-needs and underserved communities—get the support they deserve.
                      </p>
                    </div>
                    <p className="mt-4 text-lg font-medium">
                      Attend. Celebrate. Rebuild.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Refer & Earn Section */}
          <section ref={referralSectionRef} className="mb-16 scroll-mt-24">
            <div className="mb-8 text-center">
              <Badge className="mb-3 bg-gold/20 text-gold border-gold/30">
                <Sparkles className="mr-2 h-3 w-3" />
                NEW
              </Badge>
              <h2 className="font-display text-3xl font-bold">
                🚀 Refer & Earn Voting Credits
              </h2>
              <p className="mt-2 text-muted-foreground">
                Invite friends to buy tickets and earn extra AGC voting credits.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ReferralLinkCard />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5 text-primary" />
                    Where AGC is Used for Voting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {VOTING_SERVICES.map((service, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  ))}
                  <AgcDisclosure variant="inline" className="mt-4 justify-center" />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Why Attend Section */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">✨ Why You Should Be in the Room</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Star, title: "Celebrate Africa's education champions" },
                { icon: Users, title: "Network with decision-makers (education, policy, CSR, philanthropy)" },
                { icon: Heart, title: "Be counted as a supporter of education access and equity" },
                { icon: QrCode, title: "Instant QR e-ticket confirmation" },
              ].map((item, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="p-6">
                    <item.icon className="mx-auto h-8 w-8 text-primary mb-3" />
                    <p className="font-medium">{item.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Ticket Section */}
          <section ref={ticketSectionRef} className="mb-16 scroll-mt-24">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">🎫 Ticket Seats & Prices</h2>
              <p className="mt-2 text-muted-foreground">
                Prices shown in USD. Pay in any currency—your final total is shown before you confirm.
              </p>
            </div>

            <TicketTierCards 
              selectedTier={selectedTier}
              onSelectTier={(tier) => { setSelectedTier(tier); setQuantity(1); }}
            />

            {/* Checkout Note */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              ✅ Add a donation during checkout (Ticket + Donation).
            </p>

            {/* Quantity & Checkout */}
            {selectedTicket && (
              <Card className="mx-auto mt-8 max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    {selectedTicket.name}
                  </CardTitle>
                  <CardDescription>${selectedTicket.price} USD each</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quantity</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-lg font-bold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= selectedTicket.maxPerOrder}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${subtotal} USD</span>
                  </div>

                  {/* Bonus AGC preview */}
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-gold/10 p-3 text-sm">
                    <Gift className="h-4 w-4 text-gold" />
                    <span>You'll earn <span className="font-bold text-gold">+{bonusAgc} AGC</span> bonus voting credits!</span>
                  </div>

                  {referralCode && (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-2 text-xs">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Referral code applied: <span className="font-mono font-bold">{referralCode}</span></span>
                    </div>
                  )}

                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? "Processing..." : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Complete Purchase
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout. QR e-ticket + receipt delivered instantly.</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Bonus AGC Section */}
          <section className="mb-16">
            <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-gold/10">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Gift className="h-6 w-6 text-gold" />
                  🪙 Bonus AGC Voting Credits
                </CardTitle>
                <CardDescription>
                  Every ticket purchase earns Bonus Afri-Gold Coins (AGC) for voting across SCEF services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-card/50">
                  <p className="text-lg">
                    For every <span className="font-bold">$1 (USD-equivalent)</span> you pay, you receive{" "}
                    <span className="font-bold text-gold text-2xl">{AGC_BONUS_RATES.purchaseBonus} AGC</span> Bonus.
                  </p>
                </div>
                
                <AgcDisclosure variant="card" />
              </CardContent>
            </Card>
          </section>

          {/* Donation Section */}
          <section ref={donationSectionRef} className="mb-16 scroll-mt-24">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">
                🎁 Donate to SCEF Services
              </h2>
              <p className="mt-2 text-muted-foreground">One-Time or Monthly</p>
            </div>

            <Card className="mx-auto max-w-2xl">
              <CardContent className="pt-6">
                <Tabs value={donationTab} onValueChange={(v) => setDonationTab(v as DonationFrequencyType)}>
                  <TabsList className="grid w-full grid-cols-3">
                    {DONATION_FREQUENCIES.map((freq) => (
                      <TabsTrigger key={freq.id} value={freq.id}>
                        {freq.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {DONATION_FREQUENCIES.map((freq) => (
                    <TabsContent key={freq.id} value={freq.id} className="mt-6 space-y-6">
                      <p className="text-sm text-muted-foreground">{freq.description}</p>

                      {/* Cause Selection */}
                      <div>
                        <Label className="mb-3 block">Choose a Cause</Label>
                        <RadioGroup value={selectedCause} onValueChange={(v) => setSelectedCause(v as DonationCauseType)}>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {DONATION_CAUSES.map((cause) => (
                              <Label
                                key={cause.id}
                                htmlFor={cause.id}
                                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                                  selectedCause === cause.id ? "border-primary bg-primary/5" : "border-border"
                                }`}
                              >
                                <RadioGroupItem value={cause.id} id={cause.id} className="mt-1" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span>{cause.icon}</span>
                                    <span className="font-medium text-sm">{cause.name}</span>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground">{cause.description}</p>
                                </div>
                              </Label>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Amount */}
                      <div>
                        <Label htmlFor="amount">Donation Amount (USD)</Label>
                        <div className="mt-2 flex gap-2">
                          {["25", "50", "100", "250"].map((amt) => (
                            <Button
                              key={amt}
                              variant={donationAmount === amt ? "default" : "outline"}
                              size="sm"
                              onClick={() => setDonationAmount(amt)}
                            >
                              ${amt}
                            </Button>
                          ))}
                          <Input
                            id="amount"
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="w-24"
                            placeholder="Other"
                          />
                        </div>
                      </div>

                      {freq.id === "MONTHLY" && (
                        <div className="rounded-lg bg-muted p-3 text-sm">
                          <p className="font-medium">Monthly Giving Benefits:</p>
                          <ul className="mt-2 space-y-1">
                            {CHECKOUT_INFO.monthlyDonorBenefits.map((b, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-success" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {freq.id === "CORPORATE" && (
                        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                          <p className="font-medium text-primary">Corporate Sponsorship</p>
                          <p className="mt-1 text-muted-foreground">
                            Request an invoice or submit a pledge for corporate/partner sponsorships.
                          </p>
                        </div>
                      )}

                      <Button onClick={handleDonate} disabled={isProcessing} className="w-full" size="lg">
                        {isProcessing ? "Processing..." : (
                          <>
                            <Heart className="mr-2 h-5 w-5" />
                            {freq.id === "MONTHLY" ? "Start Monthly Giving" : 
                             freq.id === "CORPORATE" ? "Request Invoice" : "Donate Now"}
                          </>
                        )}
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Payment Options */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">💳 Pay in Any Currency</h2>
              <p className="mt-2 text-muted-foreground">Fast + Secure</p>
            </div>

            <div className="mx-auto max-w-2xl">
              <div className="flex flex-wrap justify-center gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center gap-2 rounded-full border bg-card px-4 py-2"
                  >
                    <span>{method.icon}</span>
                    <span className="text-sm font-medium">{method.name}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Additional options may appear depending on location/currency.
              </p>
            </div>
          </section>

          {/* Exchange-Markup Fundraising */}
          <section className="mb-16">
            <Card className="mx-auto max-w-3xl border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-center">
                  💱 SCEF Exchange-Markup Fundraising
                </CardTitle>
                <CardDescription className="text-center">
                  Monthly Receipt Report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  SCEF uses a transparent exchange-rate markup on supported multi-currency 
                  transactions as a fundraising strategy.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>The markup is shown at checkout before you confirm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Your total monthly exchange-markup fundraising contribution is compiled and sent monthly as a <strong>Fundraising Receipt Report</strong> (with dates + transaction references)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* What You Receive */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">🧾 What You Receive</h2>
            </div>
            <div className="mx-auto max-w-2xl grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    Ticket Purchase
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Receipt + QR e-ticket (instant)</li>
                    <li>• Bonus AGC credited to wallet</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Donation
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Receipt/confirmation</li>
                    <li>• Monthly receipts for recurring</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Referral Rewards
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• AGC credited to wallet</li>
                    <li>• For voting only</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    Monthly Giving
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Monthly receipts + history</li>
                    <li>• Manage/cancel anytime</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="mx-auto max-w-2xl">
              <Accordion type="single" collapsible className="w-full">
                {GALA_FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                <AccordionItem value="faq-extra-1">
                  <AccordionTrigger className="text-left">
                    Can I earn AGC without buying a ticket?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes—AGC can be earned through other SCEF activities like daily check-ins, verified nominations, 
                    and referrals. Sponsors may also fund public voting credits. Check the{" "}
                    <Link to="/earn-voting-credits" className="text-primary underline">Earn Voting Credits</Link> page.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 md:p-12">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                This is bigger than a night out.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                It's a vote of confidence in Africa's education future.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => scrollToSection(ticketSectionRef)}
                  className="bg-primary text-primary-foreground"
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  Select Tickets
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection(referralSectionRef)}
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Get My Referral Link
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection(donationSectionRef, "ONE_TIME")}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection(donationSectionRef, "MONTHLY")}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Start Monthly Giving
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Sticky Mobile Bar */}
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 left-0 right-0 z-40 border-t bg-background/95 p-3 backdrop-blur lg:bottom-0"
          >
            <div className="container mx-auto flex items-center justify-between gap-2">
              <div className="hidden sm:block">
                <p className="text-sm font-medium">NESA-Africa Gala 2026</p>
                <p className="text-xs text-muted-foreground">{GALA_EVENT.date}</p>
              </div>
              <div className="flex flex-1 justify-end gap-2 sm:flex-none">
                <Button size="sm" onClick={() => scrollToSection(ticketSectionRef)}>
                  <Ticket className="mr-1 h-4 w-4" />
                  Buy Ticket
                </Button>
                <Button size="sm" variant="outline" onClick={() => scrollToSection(donationSectionRef, "ONE_TIME")}>
                  <Heart className="mr-1 h-4 w-4" />
                  Donate
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
