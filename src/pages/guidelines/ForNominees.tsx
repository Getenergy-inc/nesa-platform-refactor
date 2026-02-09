/**
 * For Nominees - Acceptance Guidelines Page
 * Journey after nomination, NRC screening, dashboard status
 */

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Shield,
  ChevronRight,
  User,
  FileText,
  Download,
  Users,
  AlertTriangle,
  Star,
  Crown,
  Trophy,
  TrendingUp,
} from "lucide-react";

const JOURNEY_STEPS = [
  {
    step: 1,
    title: "Nomination Received",
    description: "Someone has recognized your contribution to African education and submitted a nomination on your behalf.",
    status: "completed",
    icon: User,
  },
  {
    step: 2,
    title: "Acceptance Letter Sent",
    description: "You receive an email with a secure link to view your nomination and respond.",
    status: "completed",
    icon: Mail,
  },
  {
    step: 3,
    title: "Accept or Decline",
    description: "Review the nomination details and choose to accept (with optional edits) or decline recognition.",
    status: "current",
    icon: CheckCircle,
  },
  {
    step: 4,
    title: "NRC Verification",
    description: "The Nominee Research Corps verifies your credentials and evidence (72-hour SLA).",
    status: "pending",
    icon: Shield,
  },
  {
    step: 5,
    title: "Clearance & Next Steps",
    description: "Based on your award tier, you proceed to certificate download, competitive shortlist, or jury review.",
    status: "pending",
    icon: Award,
  },
];

const NRC_OUTCOMES = [
  {
    result: "PASS",
    description: "Nomination verified. You proceed to the appropriate award track.",
    color: "emerald",
    icon: CheckCircle,
    nextSteps: [
      "Platinum: Download certificate once renomination threshold is met",
      "Competitive (Gold/Blue Garnet): Enter public voting phase",
      "Icon: Proceed to jury evaluation",
    ],
  },
  {
    result: "QUERY",
    description: "Additional information needed. You have 48–72 hours to provide clarification.",
    color: "amber",
    icon: Clock,
    nextSteps: [
      "Check your email for specific queries",
      "Respond through your nominee dashboard",
      "Provide additional evidence if requested",
    ],
  },
  {
    result: "FAIL",
    description: "Nomination did not meet verification criteria. You may reapply in future cycles.",
    color: "red",
    icon: XCircle,
    nextSteps: [
      "Review the rejection reason in your email",
      "Address gaps for future nominations",
      "Contact support for clarification",
    ],
  },
];

const TIER_NEXT_STEPS = [
  {
    tier: "Platinum Certificate of Merit",
    icon: Award,
    color: "slate",
    description: "Expert-selected recognition based on verified contribution thresholds.",
    steps: [
      "Track your renomination count in the dashboard",
      "Core categories: 100 renominations unlock certificate download",
      "Standard categories: 200 renominations unlock certificate download",
      "Certificate becomes available immediately upon reaching threshold",
      "No public voting required",
    ],
  },
  {
    tier: "Competitive Awards (Gold & Blue Garnet)",
    icon: Star,
    color: "blue",
    description: "Public voting (30–50%) combined with jury assessment (50–70%).",
    steps: [
      "Your profile appears in the public voting portal",
      "Share your profile to encourage verified votes",
      "Top scorers enter Top 3 screening",
      "Final winners determined by combined public + jury scores",
      "Voting window: April 10 – June 17, 2026",
    ],
  },
  {
    tier: "Africa Education Icon Award",
    icon: Crown,
    color: "purple",
    description: "Lifetime achievement recognition for 10+ years of sustained impact.",
    steps: [
      "Your profile goes directly to jury evaluation",
      "No public voting for Icon tier",
      "Jury assesses against 5 Icon criteria",
      "Shortlisted candidates may be interviewed",
      "Winners announced at Grand Gala",
    ],
  },
];

const RESPONSIBILITIES = [
  {
    title: "Evidence Accuracy",
    description: "Ensure all information in your profile is accurate and up-to-date. Misrepresentation leads to disqualification.",
    icon: FileText,
  },
  {
    title: "Ethical Campaigning",
    description: "You may share your profile and encourage votes, but no paid vote-buying, false claims, or negative campaigning against other nominees.",
    icon: Shield,
  },
  {
    title: "Responsive Communication",
    description: "Respond to NRC queries within the specified timeframe. Failure to respond may result in nomination withdrawal.",
    icon: Mail,
  },
  {
    title: "Accept with Integrity",
    description: "If you win, represent the award with honor. Winners become ambassadors for African education excellence.",
    icon: Trophy,
  },
];

export default function ForNominees() {
  return (
    <>
      <Helmet>
        <title>For Nominees - Acceptance Guidelines | NESA-Africa 2025</title>
        <meta name="description" content="Understand your journey as a NESA-Africa nominee. Learn about NRC screening, acceptance process, and next steps for each award tier." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-charcoal to-charcoal" />
          
          <div className="container relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1.5">
                <Award className="w-4 h-4 mr-2" />
                Nominee Guidelines
              </Badge>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                For Nominees: Acceptance Guidelines
              </h1>
              
              <p className="text-white/70 text-base md:text-lg mb-6">
                Congratulations on being nominated! Here's everything you need to know
                about your journey as a NESA-Africa 2025 nominee.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Journey Timeline */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-gold" />
                Your Nomination Journey
              </h2>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
                <div className="space-y-4">
                  {JOURNEY_STEPS.map((step, i) => (
                    <div key={i} className="relative pl-14">
                      <div className={`absolute left-4 top-4 w-4 h-4 rounded-full border-2 ${
                        step.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                        step.status === 'current' ? 'bg-gold border-gold' :
                        'bg-charcoal border-white/30'
                      }`} />
                      <Card className={`bg-white/5 border-white/10 ${step.status === 'current' ? 'border-gold/50 bg-gold/5' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <step.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                              step.status === 'completed' ? 'text-emerald-400' :
                              step.status === 'current' ? 'text-gold' :
                              'text-white/40'
                            }`} />
                            <div>
                              <h3 className="font-semibold text-white mb-1">Step {step.step}: {step.title}</h3>
                              <p className="text-white/60 text-sm">{step.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* NRC Screening Outcomes */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-gold" />
                NRC Screening Outcomes
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {NRC_OUTCOMES.map((outcome, i) => (
                  <Card key={i} className={`bg-${outcome.color}-500/10 border-${outcome.color}-500/30`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`flex items-center gap-2 text-${outcome.color}-400 text-lg`}>
                        <outcome.icon className="h-5 w-5" />
                        {outcome.result}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-white/70 text-sm">{outcome.description}</p>
                      <div>
                        <h4 className="text-xs font-semibold text-white/50 uppercase mb-2">Next Steps:</h4>
                        <ul className="space-y-1">
                          {outcome.nextSteps.map((step, j) => (
                            <li key={j} className="text-white/60 text-xs flex items-start gap-1.5">
                              <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Next Steps by Tier */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-gold" />
                Next Steps by Award Tier
              </h2>
              <div className="space-y-4">
                {TIER_NEXT_STEPS.map((tier, i) => (
                  <Card key={i} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-white">
                        <div className={`h-10 w-10 rounded-lg bg-${tier.color}-500/20 flex items-center justify-center`}>
                          <tier.icon className={`h-5 w-5 text-${tier.color}-400`} />
                        </div>
                        <div>
                          <span className="block">{tier.tier}</span>
                          <span className="text-sm text-white/60 font-normal">{tier.description}</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {tier.steps.map((step, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="text-gold font-semibold">{j + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Mock Dashboard Status */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-gold" />
                Your Nominee Dashboard
              </h2>
              <Card className="bg-charcoal-light border-gold/30">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gold">47</p>
                      <p className="text-xs text-white/60">Renominations</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-400">CLEARED</p>
                      <p className="text-xs text-white/60">NRC Status</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-amber-400">53</p>
                      <p className="text-xs text-white/60">To Unlock Certificate</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-blue-400">1,250</p>
                      <p className="text-xs text-white/60">Public Votes</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <h4 className="font-semibold text-white">Award Track: Platinum (Core Category)</h4>
                      <p className="text-white/60 text-sm">Library Development in Education – Nigeria</p>
                    </div>
                    <Button disabled className="bg-white/10 text-white/50">
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate (Locked)
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <p className="text-white/50 text-xs mt-2 text-center italic">
                * This is a sample dashboard view. Actual data will reflect your nomination.
              </p>
            </section>

            {/* Responsibilities */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-gold" />
                Your Responsibilities
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {RESPONSIBILITIES.map((item, i) => (
                  <Card key={i} className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-white/60 text-sm">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-white/60 mb-4">Have questions about your nomination?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                  <Link to="/contact">
                    Contact Support
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8">
                  <Link to="/guidelines/edi-matrix">
                    View EDI Matrix
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
