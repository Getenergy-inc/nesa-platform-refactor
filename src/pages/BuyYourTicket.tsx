import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
} from "lucide-react";

import galaHeroImage from "@/assets/events/award-gala.jpeg";
import {
  TICKET_TIERS,
  DONATION_CAUSES,
  DONATION_FREQUENCIES,
  PAYMENT_METHODS,
  GALA_EVENT,
  GALA_FAQS,
  AGC_DISCLOSURE,
  CHECKOUT_INFO,
  type TicketTier,
  type DonationFrequencyType,
  type DonationCauseType,
} from "@/config/galaConfig";

export default function BuyYourTicket() {
  const { currentEdition } = useSeason();
  const { toast } = useToast();
  
  // Refs for scroll
  const ticketSectionRef = useRef<HTMLDivElement>(null);
  const donationSectionRef = useRef<HTMLDivElement>(null);
  
  // State
  const [selectedTier, setSelectedTier] = useState<string>("PREMIUM");
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCause, setSelectedCause] = useState<DonationCauseType>("EDUAID_GENERAL");
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
      description: `Your ${quantity}x ${selectedTicket?.name} ticket(s) have been reserved. QR e-ticket + receipt sent to your email.`,
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

  const tierIcons: Record<string, typeof Star> = {
    GENERAL: Ticket,
    PREMIUM: Star,
    VIP: Sparkles,
    VVIP: Gift,
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
        <section className="relative min-h-[60vh] overflow-hidden">
          <img
            src={galaHeroImage}
            alt="NESA-Africa Gala"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/90 via-charcoal/70 to-charcoal" />
          
          <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
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
              
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                Join education leaders, innovators, partners, and changemakers from across Africa 
                and the diaspora for an unforgettable night of celebration and impact.
              </p>

              {/* Impact Notice */}
              <div className="mx-auto mt-8 max-w-xl rounded-xl border border-primary/30 bg-primary/10 p-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">Every Ticket Funds EduAid-Africa Impact</span>
                </div>
                <p className="mt-2 text-sm text-white/70">
                  Every ticket purchased helps fund EduAid-Africa services, including the 
                  <strong className="text-white"> Rebuild My School (2026–2027)</strong> – NESA-Africa Legacy Project.
                </p>
              </div>

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
          {/* Ticket Section */}
          <section ref={ticketSectionRef} className="scroll-mt-24">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">Select Your Ticket</h2>
              <p className="mt-2 text-muted-foreground">Choose your gala experience</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {TICKET_TIERS.map((tier) => {
                const Icon = tierIcons[tier.id] || Ticket;
                const isSelected = selectedTier === tier.id;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      className={`relative cursor-pointer transition-all hover:shadow-lg ${
                        isSelected ? "border-primary ring-2 ring-primary/30" : "border-border"
                      }`}
                      onClick={() => { setSelectedTier(tier.id); setQuantity(1); }}
                    >
                      {tier.id === "VIP" && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                          Popular
                        </Badge>
                      )}
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{tier.name}</CardTitle>
                        <div className="text-3xl font-bold text-primary">
                          ${tier.price}
                          <span className="text-sm font-normal text-muted-foreground"> USD</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-center text-sm text-muted-foreground">
                          {tier.seatingNote}
                        </p>
                        <Separator />
                        <ul className="space-y-2">
                          {tier.features.slice(0, 5).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {tier.features.length > 5 && (
                            <li className="text-sm text-muted-foreground">
                              +{tier.features.length - 5} more
                            </li>
                          )}
                        </ul>
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-2 text-xs">
                          <QrCode className="h-4 w-4 text-primary" />
                          <span>Instant QR e-ticket + receipt</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

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

          {/* Donation Section */}
          <section ref={donationSectionRef} className="mt-24 scroll-mt-24">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">
                Donate to SCEF Services
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
                        <Label className="mb-3 block">Select Cause</Label>
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

            {/* Donation CTAs */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="outline" onClick={() => setDonationTab("ONE_TIME")}>
                <Heart className="mr-2 h-4 w-4" />
                Donate Now
              </Button>
              <Button variant="outline" onClick={() => setDonationTab("MONTHLY")}>
                <Clock className="mr-2 h-4 w-4" />
                Start Monthly Giving
              </Button>
              <Button variant="outline" onClick={() => setDonationTab("CORPORATE")}>
                <Users className="mr-2 h-4 w-4" />
                Sponsor a Project
              </Button>
            </div>
          </section>

          {/* How Payment Works */}
          <section className="mt-24">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">How Payment Works</h2>
              <p className="mt-2 text-muted-foreground">(Important)</p>
            </div>

            <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2">
              {/* AGC Disclosure */}
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-amber-500" />
                    {AGC_DISCLOSURE.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {AGC_DISCLOSURE.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Checkout Delivers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Receipt className="h-5 w-5 text-primary" />
                    Checkout Provides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Ticket Purchase:</p>
                    <ul className="mt-1 space-y-1">
                      {CHECKOUT_INFO.ticketDeliverables.map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-success" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Donation:</p>
                    <ul className="mt-1 space-y-1">
                      {CHECKOUT_INFO.donationDeliverables.map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-success" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Payment Options */}
          <section className="mt-24">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">Multi-Currency Payment Options</h2>
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
          <section className="mt-24">
            <Card className="mx-auto max-w-3xl border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-center">
                  SCEF Exchange-Markup Fundraising
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
                <p>
                  The markup is shown at checkout before you confirm.
                </p>
                <p>
                  Your total monthly exchange-markup donation is compiled and sent monthly 
                  as a <strong>Fundraising Receipt Report</strong> (with dates + transaction references).
                </p>
              </CardContent>
            </Card>
          </section>

          {/* FAQs */}
          <section className="mt-24">
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
              </Accordion>
            </div>
          </section>

          {/* Final CTA */}
          <section className="mt-24 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 md:p-12">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Attend. Celebrate. Rebuild. Sponsor.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Be part of the movement transforming education across Africa.
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
