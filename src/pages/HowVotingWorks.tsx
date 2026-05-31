/**
 * /how-voting-works — voting explainer page extracted from the homepage.
 * Charcoal/Gold only. Mobile-first.
 */

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Vote, Coins, Shield, CheckCircle2, ArrowRight, Sparkles,
  Trophy, Users, Lock, FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageView } from "@/hooks/usePageView";

const STEPS = [
  {
    icon: Users,
    title: "1. Discover Nominees",
    body: "Browse Africa's education changemakers by category, region, country, or impact type.",
  },
  {
    icon: Coins,
    title: "2. Earn or Buy AGC",
    body: "1 AGC = 100 AGCc. Earn AGC by sharing, referring friends, or completing platform actions — or top up directly.",
  },
  {
    icon: Vote,
    title: "3. Cast Your Vote",
    body: "Blue Garnet categories accept public votes. Spend AGC to cast verified, one-per-session votes for your champion.",
  },
  {
    icon: Trophy,
    title: "4. Winners Honoured at the Gala",
    body: "Top-voted Blue Garnet nominees are celebrated at the 2026 Blue Garnet Awards Gala.",
  },
];

const RULES = [
  { icon: Shield, title: "One vote per session", body: "Database constraints enforce unique voting attribution to keep results fair." },
  { icon: Lock, title: "Blue Garnet only", body: "Only Blue Garnet category nominees are open for public voting. Other categories use Recommend Again." },
  { icon: FileCheck, title: "Audit trail", body: "Every vote is hashed and logged. Results are independently verifiable." },
  { icon: CheckCircle2, title: "AGC-backed integrity", body: "Voting requires AGC, which deters spam and rewards real participation." },
];

export default function HowVotingWorksPage() {
  usePageView("/how-voting-works", "How Voting Works — NESA-Africa 2026");
  return (
    <>
      <Helmet>
        <title>How Voting Works — NESA-Africa 2026</title>
        <meta
          name="description"
          content="Learn how public voting works on NESA-Africa: Blue Garnet categories, AGC credits, one-vote-per-session rules, and audit integrity."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/how-voting-works" />
        <meta property="og:title" content="How Voting Works — NESA-Africa 2026" />
        <meta property="og:description" content="Public voting rules, AGC credits, and integrity safeguards." />
        <meta property="og:url" content="https://nesaafrica.lovable.app/how-voting-works" />
        <meta property="og:type" content="article" />
      </Helmet>

      <section className="bg-charcoal py-10 md:py-16 min-h-screen">
        <div className="container max-w-5xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 bg-gold/15 text-gold border-gold/30">
              <Sparkles className="w-3 h-3 mr-1" /> Public Voting Guide
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory mb-3">
              How Voting Works
            </h1>
            <p className="text-ivory/70 max-w-2xl mx-auto">
              NESA-Africa runs a transparent, AGC-backed public voting system for Blue Garnet categories.
              Here's exactly how to participate.
            </p>
          </motion.div>

          {/* Steps */}
          <section className="mb-14">
            <h2 className="font-display text-xl md:text-2xl font-bold text-ivory mb-5 text-center">
              Four Steps to Cast Your Vote
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-gold/20 bg-charcoal-light/40 p-5 hover:border-gold/50 transition-colors"
                  >
                    <div className="h-11 w-11 rounded-xl bg-gold/15 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-display text-base font-bold text-ivory mb-1">{s.title}</h3>
                    <p className="text-xs text-ivory/65 leading-relaxed">{s.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Integrity rules */}
          <section className="mb-14">
            <h2 className="font-display text-xl md:text-2xl font-bold text-ivory mb-5 text-center">
              Integrity Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RULES.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.title}
                    className="flex gap-3 rounded-2xl border border-gold/15 bg-charcoal-light/40 p-5"
                  >
                    <div className="h-10 w-10 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-ivory mb-1">{r.title}</h3>
                      <p className="text-xs text-ivory/65 leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AGC explainer */}
          <section className="mb-14 rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-charcoal-light to-charcoal p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="h-14 w-14 rounded-2xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                <Coins className="w-7 h-7 text-gold" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl md:text-2xl font-bold text-ivory mb-2">
                  AGC — Afri-Gold Coin
                </h2>
                <p className="text-ivory/70 text-sm mb-4">
                  AGC is the platform's participation currency. <strong className="text-gold">1 AGC = 100 AGCc</strong>.
                  You earn AGC by inviting friends, sharing nominees, completing your profile, and other actions.
                  AGC is what you spend to cast a vote in any Blue Garnet category.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full">
                    <Link to="/earn-agc">Earn AGC <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
                    <Link to="/about-agc">About AGC</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <div className="text-center">
            <h3 className="font-display text-2xl font-bold text-ivory mb-3">Ready to vote?</h3>
            <p className="text-ivory/70 mb-5 max-w-lg mx-auto">
              Browse Blue Garnet nominees and back the changemakers shaping Africa's education future.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-8">
                <Link to="/vote"><Vote className="w-5 h-5 mr-1.5" /> Vote Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-8">
                <Link to="/nominees">Explore Nominees</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
