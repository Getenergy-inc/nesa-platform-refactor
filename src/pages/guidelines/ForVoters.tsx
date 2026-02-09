/**
 * For Voters - Decisions Guideline Page
 * How public voting works, voter guides, ethical rules
 */

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Vote,
  ChevronRight,
  Shield,
  Award,
  Users,
  CheckCircle,
  AlertTriangle,
  Star,
  Wallet,
  Calendar,
  Eye,
  TrendingUp,
  Scale,
  ExternalLink,
} from "lucide-react";

const VOTING_TRACKS = [
  {
    track: "Gold Certificate Voting",
    weight: "100% Public Vote",
    period: "April 10 – May 16, 2026",
    description: "Your vote directly determines Gold Certificate winners.",
    color: "amber",
    icon: Award,
  },
  {
    track: "Blue Garnet Voting",
    weight: "40% Public + 60% Jury",
    period: "May 18 – June 17, 2026",
    description: "Your vote combines with expert jury assessment for Blue Garnet awards.",
    color: "blue",
    icon: Star,
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Earn Voting Credits (AGC)",
    description: "Complete verified actions like nominations, referrals, and platform engagement to earn AGC voting credits.",
    icon: Wallet,
  },
  {
    step: 2,
    title: "Review Voter Guides",
    description: "Access detailed profiles and evidence summaries for Top 3 finalists in each category.",
    icon: Eye,
  },
  {
    step: 3,
    title: "Cast Your Votes",
    description: "Use your AGC to vote for nominees during the official voting window. Each AGC = 1 vote.",
    icon: Vote,
  },
  {
    step: 4,
    title: "Track Results",
    description: "Watch live vote counts and see final results announced at the Grand Gala.",
    icon: TrendingUp,
  },
];

const SAMPLE_FINALISTS = [
  {
    rank: 1,
    name: "EduTech Innovators Ltd",
    votes: 12450,
    highlights: [
      "Reached 2.5M students across 15 countries",
      "97% user satisfaction rating",
      "UNESCO partnership for content development",
    ],
    evidence: "Independent impact report by KPMG (2024)",
  },
  {
    rank: 2,
    name: "Learn Africa Foundation",
    votes: 11230,
    highlights: [
      "Built 200+ digital learning centers",
      "Trained 5,000+ teachers in ICT",
      "Government adoption in 3 states",
    ],
    evidence: "World Bank education sector review",
  },
  {
    rank: 3,
    name: "Code4Africa Initiative",
    votes: 9875,
    highlights: [
      "100,000+ youth trained in coding",
      "85% employment rate post-program",
      "Pan-African presence in 10 countries",
    ],
    evidence: "AfDB youth employment assessment",
  },
];

const ETHICAL_RULES = [
  {
    rule: "No Vote Buying",
    description: "Do not offer or accept payment, gifts, or favors in exchange for votes.",
    icon: AlertTriangle,
  },
  {
    rule: "One Account Per Person",
    description: "Multiple accounts to inflate votes will be detected and banned.",
    icon: Users,
  },
  {
    rule: "No Bot or Automated Voting",
    description: "Automated voting tools are prohibited. All votes must be manual.",
    icon: Shield,
  },
  {
    rule: "Vote Based on Merit",
    description: "Review evidence and achievements before voting. Support genuine impact.",
    icon: Scale,
  },
  {
    rule: "Report Violations",
    description: "Report suspicious voting activity to integrity@nesa.africa.",
    icon: CheckCircle,
  },
];

const VOTING_FAQS = [
  {
    question: "How do I earn AGC voting credits?",
    answer: "Earn AGC through nominations, referrals, purchasing tickets, completing engagement tasks, or buying credit packs. Visit the 'Earn Credits' page for all options.",
  },
  {
    question: "Can I vote for multiple nominees?",
    answer: "Yes! You can distribute your AGC across any nominees you wish to support. There's no limit on how many nominees you vote for.",
  },
  {
    question: "When are results announced?",
    answer: "Final results are announced at the Grand Gala on June 27, 2026. Live vote counts are visible during voting windows.",
  },
  {
    question: "What's the difference between Gold and Blue Garnet voting?",
    answer: "Gold Certificate winners are determined 100% by public votes. Blue Garnet winners are 40% public votes + 60% jury scores.",
  },
];

export default function ForVoters() {
  return (
    <>
      <Helmet>
        <title>For Voters - Decisions Guideline | NESA-Africa 2025</title>
        <meta name="description" content="Learn how to vote for NESA-Africa 2025 nominees. Understand the voting process, earn AGC credits, and make informed decisions." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-charcoal to-charcoal" />
          
          <div className="container relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-1.5">
                <Vote className="w-4 h-4 mr-2" />
                Voter Guidelines
              </Badge>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                For Voters: Decisions Guideline
              </h1>
              
              <p className="text-white/70 text-base md:text-lg mb-6">
                Your vote shapes the future of African education. Learn how to participate
                in the NESA-Africa 2025 public voting process.
              </p>

              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                <Link to="/vote">
                  Go to Voting Portal
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Voting Tracks */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="h-6 w-6 text-gold" />
                Public Voting Tracks
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {VOTING_TRACKS.map((track, i) => (
                  <Card key={i} className={`bg-${track.color}-500/10 border-${track.color}-500/30`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 text-${track.color}-400`}>
                        <track.icon className="h-5 w-5" />
                        {track.track}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className={`bg-${track.color}-500/20 text-${track.color}-300 border-${track.color}-500/30`}>
                          {track.weight}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Calendar className="h-4 w-4" />
                        {track.period}
                      </div>
                      <p className="text-white/70 text-sm">{track.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-gold" />
                How Voting Works
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {HOW_IT_WORKS.map((step, i) => (
                  <Card key={i} className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">
                          Step {step.step}: {step.title}
                        </h3>
                        <p className="text-white/60 text-sm">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Sample Voter Guide */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Eye className="h-6 w-6 text-gold" />
                Sample Voter Guide: Top 3 Finalists
              </h2>
              <p className="text-white/60 mb-4 text-sm">
                During voting, you'll see detailed profiles for each finalist. Here's an example:
              </p>
              <div className="space-y-4">
                {SAMPLE_FINALISTS.map((finalist, i) => (
                  <Card key={i} className={`bg-white/5 border-white/10 ${i === 0 ? 'border-gold/50' : ''}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            i === 0 ? 'bg-gold text-charcoal' : 'bg-white/10 text-white/60'
                          }`}>
                            #{finalist.rank}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{finalist.name}</h3>
                            <p className="text-gold text-sm">{finalist.votes.toLocaleString()} votes</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-gold hover:bg-gold-dark text-charcoal text-xs rounded-full">
                          Vote Now
                        </Button>
                      </div>
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-white/50 uppercase mb-2">Key Highlights</h4>
                        <ul className="space-y-1">
                          {finalist.highlights.map((h, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-white/60">Evidence: {finalist.evidence}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-2 italic text-center">
                * Sample data for illustration. Actual finalists and vote counts will be displayed during voting windows.
              </p>
            </section>

            {/* Ethical Rules */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-gold" />
                Ethical Voting Rules
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {ETHICAL_RULES.map((rule, i) => (
                  <Card key={i} className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-start gap-3">
                      <rule.icon className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">{rule.rule}</h4>
                        <p className="text-white/60 text-sm">{rule.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {VOTING_FAQS.map((faq, i) => (
                  <Card key={i} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
                      <p className="text-white/60 text-sm">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Earn Credits CTA */}
            <section>
              <Card className="bg-gradient-to-br from-gold/20 to-gold/5 border-gold/30">
                <CardContent className="p-6 text-center">
                  <Wallet className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-white mb-2">Need Voting Credits?</h3>
                  <p className="text-white/60 mb-4">Earn or purchase AGC to participate in voting.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6">
                      <Link to="/earn-credits">
                        Earn Free Credits
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-6">
                      <Link to="/about-agc">
                        Learn About AGC
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Final CTA */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-white/60 mb-4">Ready to make your voice heard?</p>
              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-10">
                <Link to="/vote">
                  Enter Voting Portal
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
