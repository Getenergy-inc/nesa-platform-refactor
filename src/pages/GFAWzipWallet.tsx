import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import {
  TrustBar,
  PaymentSteps,
  EarningMethods,
  GFAWzipFAQ,
} from "@/components/gfawzip";
import {
  ExternalLink,
  Ticket,
  Heart,
  Award,
  Shield,
  Globe,
  FileText,
  CheckCircle,
  Coins,
} from "lucide-react";

const GFAWZIP_URL = "https://www.getfinance.africa";
const GFA_WZIP_MARKUP_PERCENT = 2;

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

      <div className="min-h-screen bg-background">
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
                  <a href={GFAWZIP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <GFAWalletIcon size={20} className="mr-2" />
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
                  <Link to="/wallet">
                    <Coins className="mr-2 h-4 w-4" />
                    View My Wallet
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* What is GFAWzip */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
                What is GFAWzip Wallet?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card shadow-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Globe className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Official Payment Hub</h3>
                    <p className="text-sm text-muted-foreground">
                      The official payment experience for multi-currency collections for NESA-Africa.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card shadow-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Ticket className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Pay for Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Use it for tickets, donations, sponsorships, and approved ecosystem services.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card shadow-card border-border hover:shadow-lg transition-shadow">
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

        {/* 2% Processing Fee Section */}
        <section className="py-12 bg-primary/5 border-y border-primary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">Payment Processing</Badge>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                {GFA_WZIP_MARKUP_PERCENT}% GFA Wzip Processing Fee
              </h2>
              <p className="text-muted-foreground mb-6">
                All payments processed through GFA Wzip include a transparent {GFA_WZIP_MARKUP_PERCENT}%
                markup that supports the payment gateway infrastructure and multi-currency operations.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-medium">Transparent</p>
                  <p className="text-muted-foreground text-xs">Clearly disclosed before checkout</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-medium">Supports Operations</p>
                  <p className="text-muted-foreground text-xs">Powers secure payment infrastructure</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-medium">Audit Trail</p>
                  <p className="text-muted-foreground text-xs">All fees recorded in settlement reports</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
                What You Get After Payment
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card shadow-card border-border">
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
                <Card className="bg-card shadow-card border-border">
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
                <Card className="bg-card shadow-card border-border">
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

        <EarningMethods />
        <PaymentSteps />

        {/* Trust & Integrity */}
        <section className="py-16 bg-muted/30">
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

        <GFAWzipFAQ />

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
                  <a href={GFAWZIP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <GFAWalletIcon size={20} className="mr-2" />
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
                  <Link to="/wallet">
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
