/**
 * For Nominators - Guidelines Page
 * Step-by-step guide for nominators with ethical guidelines and FAQ
 */

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  ChevronRight,
  Shield,
  Award,
  HelpCircle,
  BookOpen,
  UserPlus,
  ClipboardCheck,
  Send,
  ThumbsUp,
} from "lucide-react";

const STEPS = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Register on the NESA-Africa platform with a valid email address. Verify your email to activate your nominator privileges.",
    icon: UserPlus,
    tips: ["Use a professional email for credibility", "Complete your profile for trust scoring"],
  },
  {
    step: 2,
    title: "Select Award Category",
    description: "Choose the appropriate award category and subcategory that best matches your nominee's contributions.",
    icon: Award,
    tips: ["Review all 17 categories before selecting", "Check if nominee fits Platinum, Icon, or Competitive track"],
  },
  {
    step: 3,
    title: "Provide Nominee Information",
    description: "Enter the nominee's full name, title, organization, and contact information. Ensure accuracy for NRC verification.",
    icon: FileText,
    tips: ["Use official names as they appear in documents", "Provide working email and phone for acceptance letter"],
  },
  {
    step: 4,
    title: "Answer EDI Questions",
    description: "Complete the Education Development Index questions specific to the chosen category. Be detailed and evidence-based.",
    icon: ClipboardCheck,
    tips: ["Reference specific dates, numbers, and locations", "Include hyperlinks to public evidence where possible"],
  },
  {
    step: 5,
    title: "Upload Supporting Evidence",
    description: "Attach documentation that supports your nomination claims: reports, photos, news articles, certificates.",
    icon: FileText,
    tips: ["Tier A evidence (audited reports) carries most weight", "Max 10 files, 10MB each"],
  },
  {
    step: 6,
    title: "Submit & Track",
    description: "Review your nomination and submit. You'll receive a confirmation email and can track status in your dashboard.",
    icon: Send,
    tips: ["Save draft if you need to gather more evidence", "Check spam folder for confirmation email"],
  },
];

const WHO_CAN_NOMINATE = [
  { role: "Educators & Teachers", description: "Recognize colleagues making a difference" },
  { role: "Students & Alumni", description: "Honor mentors and institutions that shaped you" },
  { role: "Parents & Guardians", description: "Celebrate schools and educators impacting your children" },
  { role: "NGO & Development Workers", description: "Spotlight partners and innovators in the field" },
  { role: "Corporate Professionals", description: "Nominate CSR programs and education champions" },
  { role: "Government Officials", description: "Recognize outstanding public service in education" },
  { role: "Media Professionals", description: "Highlight education advocates and storytellers" },
  { role: "General Public", description: "Anyone who knows an education champion" },
];

const ETHICAL_GUIDELINES = [
  {
    rule: "Truthfulness",
    description: "All claims must be accurate and verifiable. Exaggeration or false claims will result in disqualification.",
    icon: CheckCircle,
  },
  {
    rule: "No Self-Nomination",
    description: "You cannot nominate yourself. Third-party nominations only, unless you're authorized by an organization to nominate on their behalf.",
    icon: Users,
  },
  {
    rule: "Conflict of Interest Disclosure",
    description: "Disclose any personal or professional relationship with the nominee. This doesn't disqualify, but transparency is required.",
    icon: Shield,
  },
  {
    rule: "No Inducement",
    description: "Do not offer or accept any payment, gift, or favor in exchange for a nomination.",
    icon: AlertTriangle,
  },
  {
    rule: "Respect for Privacy",
    description: "Only share nominee information that is publicly known or you have permission to disclose.",
    icon: Shield,
  },
];

const FAQS = [
  {
    question: "How many nominees can I submit?",
    answer: "There is no limit. You can nominate as many education champions as you believe deserve recognition. However, each nomination should be thoroughly completed with proper evidence.",
  },
  {
    question: "Can I nominate the same person for multiple categories?",
    answer: "Yes, if the nominee's work spans multiple categories. However, each nomination must be submitted separately with category-specific evidence.",
  },
  {
    question: "What happens after I submit a nomination?",
    answer: "The NRC (Nominee Research Corps) reviews all nominations within 72 hours. The nominee receives an acceptance letter and you receive status updates via email.",
  },
  {
    question: "Can I edit my nomination after submitting?",
    answer: "No. Once submitted, nominations cannot be edited. However, the NRC may request additional information during the verification process.",
  },
  {
    question: "Do I earn any rewards for nominating?",
    answer: "Yes! Verified nominations earn you AGC (Award Governance Credits) that can be used for voting. You also become part of the NESA Champion Nominators community.",
  },
  {
    question: "What if my nominee declines the acceptance?",
    answer: "The nomination is withdrawn. Nominees have the right to decline recognition. You may receive credit for the nomination effort.",
  },
  {
    question: "How do I know if my nominee was selected?",
    answer: "You'll receive email notifications at each stage: NRC clearance, competitive shortlisting (if applicable), and final results announcement.",
  },
  {
    question: "What evidence is most valuable?",
    answer: "Tier A evidence (independent audits, third-party reports, media coverage) carries the most weight. Internal reports (Tier B) and testimonials (Tier C) are supporting evidence.",
  },
];

export default function ForNominators() {
  return (
    <>
      <Helmet>
        <title>For Nominators - Guidelines | NESA-Africa 2025</title>
        <meta name="description" content="Learn how to nominate education champions for NESA-Africa 2025 awards. Step-by-step guide, ethical guidelines, and FAQs." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-charcoal to-charcoal" />
          
          <div className="container relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30 px-4 py-1.5">
                <Users className="w-4 h-4 mr-2" />
                Nominator Guidelines
              </Badge>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                For Nominators
              </h1>
              
              <p className="text-white/70 text-base md:text-lg mb-6">
                Your nomination can change lives. Learn how to effectively recognize
                the education champions transforming Africa.
              </p>

              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                <Link to="/nominate">
                  Start Nominating Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Who Can Nominate */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-gold" />
                Who Can Nominate?
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {WHO_CAN_NOMINATE.map((item, i) => (
                  <Card key={i} className="bg-white/5 border-white/10 hover:border-gold/30 transition-colors">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-white text-sm mb-1">{item.role}</h3>
                      <p className="text-white/60 text-xs">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Step by Step */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ClipboardCheck className="h-6 w-6 text-gold" />
                Step-by-Step Nomination Process
              </h2>
              <div className="space-y-4">
                {STEPS.map((step, i) => (
                  <Card key={i} className="bg-white/5 border-white/10">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gold/20 flex items-center justify-center">
                          <span className="text-gold font-bold text-lg">{step.step}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
                            <step.icon className="h-4 w-4 text-gold" />
                            {step.title}
                          </h3>
                          <p className="text-white/70 text-sm mb-3">{step.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {step.tips.map((tip, j) => (
                              <span key={j} className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                                <Lightbulb className="h-3 w-3" />
                                {tip}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Tips for EDI Questions */}
            <section>
              <Card className="bg-gold/10 border-gold/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gold">
                    <BookOpen className="h-5 w-5" />
                    Tips for Answering EDI Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-white/80 text-sm">
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p><strong className="text-white">Be Specific:</strong> Use exact numbers, dates, and locations. "Trained 500 teachers in Lagos State between 2022–2024" is better than "trained many teachers."</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p><strong className="text-white">Show Impact:</strong> Focus on outcomes, not just activities. How did beneficiaries' lives change?</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p><strong className="text-white">Provide Evidence:</strong> Every major claim should have supporting documentation. Link to reports, news articles, or testimonials.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p><strong className="text-white">Address All Areas:</strong> Complete every question. Blank responses lower the nomination's credibility.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Ethical Guidelines */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-gold" />
                Ethical Guidelines
              </h2>
              <div className="space-y-3">
                {ETHICAL_GUIDELINES.map((rule, i) => (
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

            {/* FAQ */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-gold" />
                Frequently Asked Questions
              </h2>
              <Accordion type="multiple" className="space-y-2">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 text-left hover:bg-white/5">
                      <span className="text-white text-sm font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-white/70 text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Final CTA */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-white/60 mb-4">Ready to recognize an education champion?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                  <Link to="/nominate">
                    Start Nominating
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
