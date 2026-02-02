import { Helmet } from "react-helmet-async";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle,
  FileQuestion,
  Shield,
  Star,
  Clock,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How do I score a nominee?",
    a: "Navigate to your Dashboard or Scoring Queue, find the pending assignment, click 'Score' to open the scoring dialog. Use the slider to set your score (0-100), optionally add a comment, then click Submit. Scores are final once submitted.",
  },
  {
    q: "What if I know a nominee personally?",
    a: "You must declare a Conflict of Interest (COI) immediately. Click the Shield icon on the assignment card, provide a brief reason, and submit. The nominee will be removed from your queue and reassigned to another judge.",
  },
  {
    q: "Can I change my score after submitting?",
    a: "No, scores are final and cannot be modified after submission. This is to ensure the integrity of the evaluation process. Take your time before submitting.",
  },
  {
    q: "What happens if I miss the deadline?",
    a: "Incomplete evaluations may affect the final results and your standing as a jury member. If you anticipate missing the deadline, contact the Jury Coordinator immediately.",
  },
  {
    q: "How is the final score calculated?",
    a: "Jury scores account for 60% of the final Blue Garnet score. The remaining 40% comes from public voting. Your individual scores are aggregated with other jury members' scores for each nominee.",
  },
  {
    q: "What should I look for in the evidence dossier?",
    a: "Review all documentation thoroughly: impact metrics, testimonials, media coverage, awards, publications, and any supporting evidence. Consider the five scoring criteria: Impact, Innovation, Sustainability, Leadership, and Evidence quality.",
  },
  {
    q: "Who can see my individual scores?",
    a: "Individual scores are confidential. Only the Jury Coordinator and system administrators have access for audit purposes. Final results show aggregated scores only.",
  },
  {
    q: "Can I discuss nominees with other judges?",
    a: "No. To maintain independence and prevent bias, jury members must not discuss specific nominees, scores, or rankings with each other until after the official announcement.",
  },
];

export default function JudgeHelp() {
  return (
    <>
      <Helmet>
        <title>Help & FAQ | Judges Arena</title>
      </Helmet>

      <JudgesArenaLayout title="Help & FAQ" description="Support resources for jury members">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="border-gold/20 bg-gold/5">
              <CardContent className="p-4 text-center">
                <Mail className="h-8 w-8 text-gold mx-auto mb-3" />
                <h3 className="font-medium text-white mb-1">Email Support</h3>
                <p className="text-xs text-white/60 mb-3">Response within 24 hours</p>
                <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10" asChild>
                  <a href="mailto:jury@nesa-africa.org">
                    jury@nesa-africa.org
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-4 text-center">
                <Phone className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-medium text-white mb-1">Jury Hotline</h3>
                <p className="text-xs text-white/60 mb-3">Mon-Fri, 9AM-5PM WAT</p>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" asChild>
                  <a href="tel:+2349000000000">
                    +234 900 000 0000
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-medium text-white mb-1">WhatsApp</h3>
                <p className="text-xs text-white/60 mb-3">For urgent matters only</p>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" asChild>
                  <a href="https://wa.me/2349000000000" target="_blank" rel="noopener noreferrer">
                    Chat Now <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="border-white/10 bg-white/5 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-gold" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQ_ITEMS.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="border border-white/10 rounded-lg overflow-hidden bg-white/5"
                  >
                    <AccordionTrigger className="px-4 py-3 text-white hover:text-gold hover:no-underline text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-white/70">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Scoring Range</h4>
                    <p className="text-sm text-white/60">
                      Use the full 0-100 scale. Average scores cluster around 50-70. 
                      Reserve 80+ for truly exceptional candidates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">COI Protocol</h4>
                    <p className="text-sm text-white/60">
                      When in doubt, declare. It's better to recuse yourself 
                      than risk the integrity of your evaluation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Time Management</h4>
                    <p className="text-sm text-white/60">
                      Budget 15-20 minutes per evaluation. Review dossier thoroughly 
                      before scoring.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Emergency Contact</h4>
                    <p className="text-sm text-white/60">
                      For ethics violations or security concerns, email 
                      ethics@nesa-africa.org immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </JudgesArenaLayout>
    </>
  );
}
