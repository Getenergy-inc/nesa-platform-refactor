import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ExternalLink,
  Ticket,
  Heart,
  Award,
  Shield,
  Globe,
  FileText,
  CheckCircle,
  Gift,
  Users,
  Clock,
  Coins,
  ArrowRight,
} from "lucide-react";

const GFAWZIP_URL = "https://www.getfinance.africa";

const TRUST_FEATURES = [
  { icon: Globe, label: "Multi-Currency" },
  { icon: FileText, label: "Instant Receipts" },
  { icon: Shield, label: "Secure Checkout" },
  { icon: Wallet, label: "Wallet Audit Trail" },
];

const PAYMENT_STEPS = [
  { step: 1, title: "Choose", description: "Ticket / Donate / Sponsor" },
  { step: 2, title: "Checkout", description: "Using GFAWzip Wallet (multi-currency)" },
  { step: 3, title: "Receive", description: "Receipt/confirmation instantly" },
  { step: 4, title: "Earn", description: "AGC voting credits in your wallet" },
];

const EARNING_METHODS = [
  { icon: Gift, title: "Support Bonus", description: "$1 = 5 Bonus AGC (eligible transactions)" },
  { icon: Clock, title: "Daily Sign-in", description: "+1 AGCc/day (10 AGCc = 1 AGC)" },
  { icon: Users, title: "Referral (1st Payment)", description: "+15 AGC when referred user pays" },
  { icon: Users, title: "Referral (2nd Payment)", description: "+5 AGC on second payment" },
];

const FAQS = [
  {
    question: "Can I withdraw AGC?",
    answer: "No. AGC is non-tradeable voting credit. There is no cash-out, no withdrawals, and no payouts.",
  },
  {
    question: "Is AGC cryptocurrency?",
    answer: "No. AGC is an internal voting credit used only within the SCEF/NESA-Africa ecosystem.",
  },
  {
    question: "What do I receive after payment?",
    answer: "You receive instant receipts, QR e-tickets (for ticket purchases), donation confirmations, or sponsorship acknowledgements.",
  },
  {
    question: "How do I earn AGC from payments?",
    answer: "$1 = 5 Bonus AGC for eligible transactions. Credits are added to your wallet after successful payment.",
  },
  {
    question: "Where do I see my AGC?",
    answer: "Visit your Wallet (/wallet) to view your balance and complete transaction history.",
  },
];

function AGCDisclaimer() {
  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-center">
      <p className="text-sm text-warning font-medium">
        ⚠️ AGC is non-tradeable voting credit — no withdrawals, no cash-out, no payouts.
      </p>
    </div>
  );
}

export default function GFAWzipWallet() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      <Helmet>
        <title>GFAWzip Wallet | Multi-Currency Payments for NESA-Africa</title>
        <meta
          name="description"
          content="Pay NESA-Africa tickets, donations, and sponsorships in any currency using the GFAWzip Wallet on getfinance.africa. Get instant receipts, confirmations, and AGC voting credit bonuses. AGC is non-tradeable — no cash-out."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                Official Payment Partner
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                GFAWzip Wallet
                <span className="block text-2xl md:text-3xl text-muted-foreground mt-2">
                  (GetFinance.africa)
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gold mb-4">
                Pay in any currency. Get instant receipts. Earn AGC voting credits.
              </p>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Secure, transparent checkout with multi-currency support for NESA-Africa payments.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-gold text-secondary font-semibold shadow-gold"
                  asChild
                >
                  <a href={GFAWZIP_URL} target="_blank" rel="noopener noreferrer">
                    <Wallet className="mr-2 h-5 w-5" />
                    Open GFAWzip Wallet
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/buy-your-ticket">
                    <Ticket className="mr-2 h-5 w-5" />
                    Buy Your Ticket
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/donate">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/partners">
                    <Award className="mr-2 h-4 w-4" />
                    Sponsor NESA-Africa
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <Coins className="mr-2 h-4 w-4" />
                    View My Wallet
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-8 bg-card/50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TRUST_FEATURES.map((feature) => (
                <div key={feature.label} className="flex items-center justify-center gap-3">
                  <feature.icon className="h-6 w-6 text-gold" />
                  <span className="text-foreground font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What is GFAWzip */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
                What is GFAWzip Wallet?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card/50 border-border">
                  <CardContent className="pt-6">
                    <Globe className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Official Payment Hub</h3>
                    <p className="text-sm text-muted-foreground">
                      The official payment experience for multi-currency collections for NESA-Africa.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border">
                  <CardContent className="pt-6">
                    <Ticket className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Pay for Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Use it for tickets, donations, sponsorships, and approved ecosystem services.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border">
                  <CardContent className="pt-6">
                    <FileText className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Instant Receipts</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive a receipt/confirmation instantly after successful payment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
                What You Get After Payment
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <Ticket className="h-8 w-8 text-gold mb-2" />
                    <CardTitle className="text-lg">Ticket Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        QR e-ticket
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Payment receipt
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <Heart className="h-8 w-8 text-gold mb-2" />
                    <CardTitle className="text-lg">Donations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Donation confirmation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Donation receipt
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <Award className="h-8 w-8 text-gold mb-2" />
                    <CardTitle className="text-lg">Sponsorship</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Sponsor confirmation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Acknowledgement certificate
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Currency */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                Multi-Currency Payments
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Pay in any currency; available payment methods appear based on your location.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Paystack", "Transactpay", "TapTap Send", "Zelle", "Bancable"].map((method) => (
                  <Badge key={method} variant="secondary" className="text-sm py-2 px-4">
                    {method}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Additional options may appear depending on location/currency.
              </p>
            </div>
          </div>
        </section>

        {/* Earn AGC */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4 text-center">
                Earn AGC Voting Credits
              </h2>
              <p className="text-center text-muted-foreground mb-6">
                Participate and earn voting credits through various activities.
              </p>
              
              <AGCDisclaimer />
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {EARNING_METHODS.map((method) => (
                  <Card key={method.title} className="bg-card border-border">
                    <CardContent className="pt-6 flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{method.title}</h3>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Sponsors may fund public participation pools that grant claimable AGC voting credits (where enabled).
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
                How It Works
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {PAYMENT_STEPS.map((step, index) => (
                  <div key={step.step} className="relative">
                    <Card className="bg-card border-border h-full">
                      <CardContent className="pt-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-gold text-secondary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                          {step.step}
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                    {index < PAYMENT_STEPS.length - 1 && (
                      <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 h-6 w-6 text-muted-foreground z-10" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Integrity */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Shield className="h-12 w-12 text-gold mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                Trust & Integrity
              </h2>
              <ul className="space-y-4 text-left max-w-md mx-auto">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Transparent confirmations and receipts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Wallet audit trail for AGC credits and vote spending</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Integrity rule: sponsors/partners do not influence winners</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-8">
                <AGCDisclaimer />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-r from-primary/20 to-gold/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Ready to Get Started?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-gold text-secondary font-semibold shadow-gold"
                  asChild
                >
                  <a href={GFAWZIP_URL} target="_blank" rel="noopener noreferrer">
                    <Wallet className="mr-2 h-5 w-5" />
                    Open GFAWzip Wallet
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/buy-your-ticket">
                    <Ticket className="mr-2 h-5 w-5" />
                    Buy Your Ticket
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">
                    <Coins className="mr-2 h-5 w-5" />
                    View Wallet
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
