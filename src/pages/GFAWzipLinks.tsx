import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import {
  ExternalLink,
  Ticket,
  Heart,
  Award,
  Shield,
  Globe,
  Coins,
  Vote,
  Users,
  CreditCard,
  Gift,
  Building2,
  Wallet,
  ArrowRight,
  CheckCircle,
  QrCode,
  Share2,
  Link2,
  Zap,
} from "lucide-react";

const GFAWZIP_URL = "https://www.getfinance.africa";

// Quick action links organized by category
const QUICK_ACTIONS = [
  {
    category: "Payments",
    icon: CreditCard,
    color: "hsl(var(--primary))",
    links: [
      { label: "Buy Gala Ticket", href: "/buy-your-ticket", icon: Ticket, description: "NESA-Africa Gala 2026" },
      { label: "Donate Now", href: "/donate", icon: Heart, description: "Support education causes" },
      { label: "Become a Sponsor", href: "/partners", icon: Award, description: "Corporate partnerships" },
    ],
  },
  {
    category: "Wallet",
    icon: Wallet,
    color: "hsl(var(--chart-1))",
    links: [
      { label: "My Dashboard", href: "/dashboard", icon: Coins, description: "View AGC balance & history" },
      { label: "Top Up AGC", href: "/dashboard", icon: Zap, description: "Add voting credits" },
      { label: "About AGC", href: "/about-agc", icon: Gift, description: "Learn how AGC works" },
    ],
  },
  {
    category: "Voting",
    icon: Vote,
    color: "hsl(var(--chart-2))",
    links: [
      { label: "Vote for Nominees", href: "/vote", icon: Vote, description: "Use AGC to vote" },
      { label: "View Nominees", href: "/nominees", icon: Users, description: "Browse all nominees" },
      { label: "Categories", href: "/categories", icon: Award, description: "Award categories" },
    ],
  },
  {
    category: "Engage",
    icon: Users,
    color: "hsl(var(--chart-3))",
    links: [
      { label: "Join a Chapter", href: "/chapters", icon: Building2, description: "Local communities" },
      { label: "Volunteer", href: "/volunteer", icon: Heart, description: "Get involved" },
      { label: "Refer Friends", href: "/dashboard", icon: Share2, description: "Earn referral AGC" },
    ],
  },
];

// Payment provider integrations
const PAYMENT_PROVIDERS = [
  { name: "Paystack", region: "Africa", status: "active" },
  { name: "Transactpay", region: "Africa", status: "active" },
  { name: "TapTap Send", region: "Diaspora", status: "active" },
  { name: "Zelle", region: "USA", status: "active" },
  { name: "Bancable", region: "UK/EU", status: "active" },
  { name: "Flutterwave", region: "Africa", status: "coming" },
  { name: "M-Pesa", region: "East Africa", status: "coming" },
  { name: "OPay", region: "West Africa", status: "coming" },
];

// Key features
const KEY_FEATURES = [
  { icon: Globe, title: "Multi-Currency", description: "Pay in your local currency" },
  { icon: Shield, title: "Secure", description: "Bank-grade encryption" },
  { icon: QrCode, title: "QR Receipts", description: "Instant e-tickets & confirmations" },
  { icon: Gift, title: "+5 AGC/$1", description: "Earn voting credits on payments" },
];

export default function GFAWzipLinks() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>GFAWzip Links | Quick Access to All Wallet Features</title>
        <meta
          name="description"
          content="Quick access hub for GFAWzip Wallet - Buy tickets, donate, vote, view your wallet, and connect payment providers. All NESA-Africa payment actions in one place."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        {/* Hero Header */}
        <section className="relative py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {/* Profile-style header */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-gold p-1 shadow-gold">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    <GFAWalletIcon size={56} />
                  </div>
                </div>
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Official Payment Partner
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                GFAWzip Wallet
              </h1>
              <p className="text-muted-foreground mb-4">
                @getfinance.africa
              </p>
              <p className="text-lg text-gold mb-6">
                Multi-currency payments for NESA-Africa
              </p>

              {/* Primary CTA */}
              <Button
                size="lg"
                className="bg-gradient-gold text-secondary font-semibold shadow-gold mb-4 w-full max-w-sm"
                asChild
              >
                <a href={GFAWZIP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  <GFAWalletIcon size={20} className="mr-2" />
                  Open GFAWzip Wallet
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>

              {/* Key Features Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {KEY_FEATURES.map((feature) => (
                  <div key={feature.title} className="flex flex-col items-center p-3 rounded-lg bg-card/50 border border-border">
                    <feature.icon className="h-5 w-5 text-gold mb-1" />
                    <span className="text-xs font-medium text-foreground">{feature.title}</span>
                    <span className="text-xs text-muted-foreground">{feature.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action Links */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto space-y-6">
              {QUICK_ACTIONS.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center gap-2 mb-3">
                    <category.icon className="h-5 w-5" style={{ color: category.color }} />
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {category.category}
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {category.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <link.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {link.label}
                            </p>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Connected Payment Providers */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="h-5 w-5 text-gold" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Connected Payment Providers
                </h2>
              </div>
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Multi-Currency Payment Rails
                  </CardTitle>
                  <CardDescription>
                    Pay in your local currency through integrated providers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_PROVIDERS.map((provider) => (
                      <div
                        key={provider.name}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          provider.status === "active" ? "bg-primary/5 border border-primary/20" : "bg-muted/30 border border-border"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-sm text-foreground">{provider.name}</p>
                          <p className="text-xs text-muted-foreground">{provider.region}</p>
                        </div>
                        {provider.status === "active" ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <Badge variant="outline" className="text-xs">Soon</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 2% Processing Info */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        +2% GFA Wzip Processing Fee
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        A transparent 2% markup is added to payments to support multi-currency operations. 
                        Fund accounts receive 100% of the base amount.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">$100 base</Badge>
                        <ArrowRight className="h-3 w-3" />
                        <Badge variant="outline">$102 paid</Badge>
                        <ArrowRight className="h-3 w-3" />
                        <Badge variant="secondary">$100 to funds + $2 to GFA Wzip</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AGC Disclaimer */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-center">
                <p className="text-sm text-warning font-medium mb-1">
                  ⚠️ AGC is Non-Tradeable Voting Credit
                </p>
                <p className="text-xs text-muted-foreground">
                  No withdrawals, no cash-out, no payouts. AGC is used exclusively for voting within the NESA-Africa ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/gfawzip"
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <GFAWalletIcon size={20} />
                  <span className="font-medium text-foreground">Learn More</span>
                </Link>
                <a
                  href={GFAWZIP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-gold text-secondary font-medium hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>GetFinance.africa</span>
                </a>
              </div>

              {/* Social/Share */}
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground mb-2">Share this page</p>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-3">
                    <Share2 className="h-4 w-4 mr-1" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Powered by */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Powered by{" "}
                  <a
                    href={GFAWZIP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    GetFinance.africa
                  </a>
                  {" "}• Official Payment Partner of NESA-Africa
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
