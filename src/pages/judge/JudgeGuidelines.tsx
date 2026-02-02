import { Helmet } from "react-helmet-async";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Shield, 
  Scale, 
  Eye, 
  Lock, 
  Clock, 
  Users,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const GUIDELINES_SECTIONS = [
  {
    id: "ethics",
    icon: Scale,
    title: "Ethical Standards",
    items: [
      {
        q: "Impartiality Requirement",
        a: "All jury members must evaluate nominees solely based on merit, documented evidence, and the official scoring rubric. Personal relationships, professional affiliations, or any external factors must not influence your scoring.",
      },
      {
        q: "Confidentiality Obligation",
        a: "All nomination details, scoring discussions, and jury deliberations are strictly confidential. Sharing any information about nominees or scores outside the Judges Arena is a breach of your jury oath and may result in removal from the panel.",
      },
      {
        q: "Anti-Bribery Policy",
        a: "Jury members must not accept any gifts, payments, or favors from nominees, their representatives, or any party with interest in the award outcomes. Report any attempted bribery immediately to the NESA-Africa Ethics Committee.",
      },
    ],
  },
  {
    id: "coi",
    icon: Shield,
    title: "Conflict of Interest",
    items: [
      {
        q: "When to Declare COI",
        a: "You must declare a Conflict of Interest if: you have a personal relationship with the nominee, you work for or have business ties with the nominee's organization, you have previously publicly endorsed the nominee, or you have any financial interest in the nominee's success.",
      },
      {
        q: "COI Declaration Process",
        a: "Use the COI Declaration button on any assignment card to recuse yourself. Provide a brief reason for the conflict. Once declared, the nominee will be removed from your queue and reassigned to another jury member.",
      },
      {
        q: "Consequences of Undisclosed COI",
        a: "Failure to disclose a conflict of interest may result in invalidation of your scores, removal from the jury panel, and potential legal action depending on the severity of the breach.",
      },
    ],
  },
  {
    id: "process",
    icon: FileCheck,
    title: "Evaluation Process",
    items: [
      {
        q: "Evidence Review",
        a: "Before scoring any nominee, thoroughly review their evidence dossier. This includes biographical information, supporting documents, impact metrics, and any multimedia evidence provided. Spend adequate time understanding the full scope of their contributions.",
      },
      {
        q: "Scoring Methodology",
        a: "Use the 0-100 scale across all five criteria: Impact & Reach (25%), Innovation & Creativity (20%), Sustainability & Scalability (20%), Leadership & Advocacy (20%), and Evidence & Documentation (15%). Your final score is the weighted average.",
      },
      {
        q: "Comments and Feedback",
        a: "While optional, providing comments with your score helps create an audit trail and may be used in case of score disputes. Be professional and objective in your comments.",
      },
    ],
  },
  {
    id: "timeline",
    icon: Clock,
    title: "Timeline & Deadlines",
    items: [
      {
        q: "Scoring Window",
        a: "The jury scoring phase runs for approximately 4 weeks. All assigned evaluations must be completed before the deadline shown on your dashboard. Late or incomplete evaluations may affect the final results.",
      },
      {
        q: "Score Finality",
        a: "Scores are final once submitted. There is no edit or undo function. Take your time to ensure accuracy before clicking Submit Score.",
      },
      {
        q: "Results Embargo",
        a: "Final results are embargoed until the official announcement at the NESA-Africa Gala. Any premature disclosure of results is a serious breach of confidentiality.",
      },
    ],
  },
];

export default function JudgeGuidelines() {
  return (
    <>
      <Helmet>
        <title>Jury Guidelines | Judges Arena</title>
      </Helmet>

      <JudgesArenaLayout title="Jury Guidelines" description="Standards and procedures for jury members">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header Card */}
          <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-charcoal/80 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Scale className="h-7 w-7 text-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">NESA-Africa Jury Code of Conduct</h2>
                  <p className="text-white/70 mb-4">
                    As a member of the elite 27-judge Blue Garnet Jury Panel, you uphold the highest 
                    standards of integrity, fairness, and excellence in evaluating Africa's education champions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      <Users className="mr-1 h-3 w-3" /> 27 Elite Judges
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <Eye className="mr-1 h-3 w-3" /> Full Transparency
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Lock className="mr-1 h-3 w-3" /> Confidential
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines Sections */}
          <div className="space-y-6">
            {GUIDELINES_SECTIONS.map((section) => (
              <Card key={section.id} className="border-white/10 bg-white/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <section.icon className="h-5 w-5 text-gold" />
                    </div>
                    <CardTitle className="text-white">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {section.items.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`${section.id}-${index}`}
                        className="border border-white/10 rounded-lg overflow-hidden bg-white/5"
                      >
                        <AccordionTrigger className="px-4 py-3 text-white hover:text-gold hover:no-underline">
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
            ))}
          </div>

          {/* Do's and Don'ts */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Do's
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Review all evidence before scoring",
                    "Declare COI immediately when discovered",
                    "Use the full 0-100 scoring range",
                    "Complete evaluations before deadline",
                    "Maintain strict confidentiality",
                    "Score based on documented merit only",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <XCircle className="h-5 w-5" /> Don'ts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Discuss scores with other jury members",
                    "Accept gifts from nominees or representatives",
                    "Share nominee information publicly",
                    "Score nominees you have ties to",
                    "Rush through evaluations",
                    "Let external pressures influence scores",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </JudgesArenaLayout>
    </>
  );
}
