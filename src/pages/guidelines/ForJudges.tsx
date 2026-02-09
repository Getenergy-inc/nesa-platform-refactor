/**
 * For Judges - Decisions Guideline Page
 * Full 20-point criteria tables, weighted scoring, screening process
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
  Scale,
  Download,
  ChevronRight,
  Shield,
  Award,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
  Target,
  Eye,
  Lock,
} from "lucide-react";

const JUDGING_CATEGORIES = [
  {
    id: "media-advocacy",
    name: "Media Advocacy in Education (Nigeria)",
    criteria: [
      { name: "Impact on Education Awareness", weight: 10 },
      { name: "Reach and Audience Engagement", weight: 10 },
      { name: "Quality of Educational Content", weight: 10 },
      { name: "Advocacy Campaigns Effectiveness", weight: 10 },
      { name: "Innovation in Education Reporting", weight: 10 },
      { name: "Community Engagement", weight: 10 },
      { name: "Consistency of Coverage", weight: 10 },
      { name: "Awards and Recognition", weight: 5 },
      { name: "Partnership with Education Stakeholders", weight: 10 },
      { name: "Ethical Standards in Reporting", weight: 5 },
    ],
  },
  {
    id: "csr-africa",
    name: "CSR in Education (Africa-wide)",
    criteria: [
      { name: "Scale of Educational Investment", weight: 10 },
      { name: "Number of Beneficiaries Reached", weight: 10 },
      { name: "Sustainability of Programs", weight: 10 },
      { name: "Innovation in CSR Approach", weight: 10 },
      { name: "Alignment with SDG 4", weight: 10 },
      { name: "Partnership Effectiveness", weight: 10 },
      { name: "Measurable Learning Outcomes", weight: 10 },
      { name: "Employee Engagement in Education", weight: 5 },
      { name: "Transparency and Reporting", weight: 10 },
      { name: "Equity and Inclusion Focus", weight: 5 },
    ],
  },
  {
    id: "csr-nigeria",
    name: "CSR in Education (Nigeria)",
    criteria: [
      { name: "Scale of Educational Investment", weight: 10 },
      { name: "Number of Beneficiaries Reached", weight: 10 },
      { name: "Sustainability of Programs", weight: 10 },
      { name: "Innovation in CSR Approach", weight: 10 },
      { name: "Alignment with National Education Goals", weight: 10 },
      { name: "Partnership with Government", weight: 10 },
      { name: "Measurable Learning Outcomes", weight: 10 },
      { name: "Employee Engagement in Education", weight: 5 },
      { name: "Transparency and Reporting", weight: 10 },
      { name: "Equity and Inclusion Focus", weight: 5 },
    ],
  },
  {
    id: "edutech",
    name: "EduTech Innovation (Africa-wide)",
    criteria: [
      { name: "Innovation and Originality", weight: 15 },
      { name: "User Adoption and Growth", weight: 10 },
      { name: "Learning Outcomes Impact", weight: 15 },
      { name: "Accessibility and Inclusivity", weight: 10 },
      { name: "Scalability Potential", weight: 10 },
      { name: "Teacher Empowerment", weight: 10 },
      { name: "Data-Driven Insights", weight: 5 },
      { name: "Affordability and Value", weight: 10 },
      { name: "Technical Reliability", weight: 5 },
      { name: "Partnership Ecosystem", weight: 10 },
    ],
  },
  {
    id: "ngo-africa",
    name: "NGO Contribution to Education (Africa-wide)",
    criteria: [
      { name: "Reach and Coverage", weight: 10 },
      { name: "Measurable Impact on Learning", weight: 15 },
      { name: "Sustainability and Continuity", weight: 10 },
      { name: "Innovation in Approach", weight: 10 },
      { name: "Community Engagement", weight: 10 },
      { name: "Capacity Building", weight: 10 },
      { name: "Advocacy and Policy Influence", weight: 10 },
      { name: "Transparency and Accountability", weight: 10 },
      { name: "Partnership Effectiveness", weight: 10 },
      { name: "Equity Focus", weight: 5 },
    ],
  },
  {
    id: "ngo-nigeria",
    name: "NGO Contribution to Education (Nigeria)",
    criteria: [
      { name: "Reach and Coverage", weight: 10 },
      { name: "Measurable Impact on Learning", weight: 15 },
      { name: "Sustainability and Continuity", weight: 10 },
      { name: "Innovation in Approach", weight: 10 },
      { name: "Community Engagement", weight: 10 },
      { name: "Capacity Building", weight: 10 },
      { name: "Advocacy and Policy Influence", weight: 10 },
      { name: "Transparency and Accountability", weight: 10 },
      { name: "Partnership with Government", weight: 10 },
      { name: "Equity Focus", weight: 5 },
    ],
  },
  {
    id: "creative-arts",
    name: "Creative Arts in Education (Nigeria)",
    criteria: [
      { name: "Artistic Excellence and Innovation", weight: 15 },
      { name: "Student Participation and Development", weight: 10 },
      { name: "Cultural Preservation", weight: 10 },
      { name: "Career Pathway Development", weight: 10 },
      { name: "Community Impact", weight: 10 },
      { name: "Infrastructure and Resources", weight: 10 },
      { name: "Teacher Training and Development", weight: 10 },
      { name: "Partnerships with Creative Industry", weight: 10 },
      { name: "Exhibitions and Showcases", weight: 10 },
      { name: "Accessibility and Inclusion", weight: 5 },
    ],
  },
];

const SCORING_EXAMPLE = {
  nominee: "Example Foundation",
  category: "CSR in Education (Africa)",
  weights: [
    { criterion: "Scale of Investment", score: 8, weight: 10, weighted: 0.8 },
    { criterion: "Beneficiaries Reached", score: 9, weight: 10, weighted: 0.9 },
    { criterion: "Sustainability", score: 7, weight: 10, weighted: 0.7 },
    { criterion: "Innovation", score: 8, weight: 10, weighted: 0.8 },
    { criterion: "SDG 4 Alignment", score: 9, weight: 10, weighted: 0.9 },
    { criterion: "Partnerships", score: 8, weight: 10, weighted: 0.8 },
    { criterion: "Learning Outcomes", score: 7, weight: 10, weighted: 0.7 },
    { criterion: "Employee Engagement", score: 6, weight: 5, weighted: 0.3 },
    { criterion: "Transparency", score: 8, weight: 10, weighted: 0.8 },
    { criterion: "Equity Focus", score: 7, weight: 5, weighted: 0.35 },
  ],
  totalWeighted: 7.25,
  juryScore: 72.5,
};

const SCREENING_STEPS = [
  {
    step: 1,
    title: "Initial Jury Scoring",
    description: "All cleared nominees are scored independently by 3+ jury members using the 10-point criteria scale.",
  },
  {
    step: 2,
    title: "Score Aggregation",
    description: "Individual scores are averaged. Outliers (>2 std dev) are reviewed for bias or COI.",
  },
  {
    step: 3,
    title: "Top 3 Identification",
    description: "Highest-scoring nominees in each subcategory enter the Top 3 screening phase.",
  },
  {
    step: 4,
    title: "Enhanced Due Diligence",
    description: "Top 3 undergo additional verification: reference checks, public integrity review, COI audit.",
  },
  {
    step: 5,
    title: "Final Jury Deliberation",
    description: "Jury panel meets to discuss finalists and confirm winner selection before public announcement.",
  },
];

const COI_RULES = [
  "Must declare any personal, professional, or financial relationship with nominees",
  "Cannot score nominees from your own organization or direct competitors",
  "Must recuse from categories where you have active partnerships",
  "Violation results in immediate removal from jury panel and potential public disclosure",
];

export default function ForJudges() {
  return (
    <>
      <Helmet>
        <title>For Judges - Decisions Guideline | NESA-Africa 2025</title>
        <meta name="description" content="Complete judging criteria and guidelines for NESA-Africa 2025 jury members. 20-point scoring rubrics, weighted calculations, and integrity protocols." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-charcoal to-charcoal" />
          
          <div className="container relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-1.5">
                <Scale className="w-4 h-4 mr-2" />
                Jury Guidelines
              </Badge>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                For Judges: Decisions Guideline
              </h1>
              
              <p className="text-white/70 text-base md:text-lg mb-6">
                Your impartial assessment determines who receives recognition for excellence
                in African education. Review the scoring criteria and integrity protocols below.
              </p>

              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6">
                <Download className="mr-2 h-4 w-4" />
                Download Judge Scoring Sheet Template
              </Button>
            </motion.div>
          </div>
        </section>

        <div className="container px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Scoring Criteria Tables */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-gold" />
                20-Point Judging Criteria by Category
              </h2>
              
              <Accordion type="multiple" className="space-y-3">
                {JUDGING_CATEGORIES.map((cat) => (
                  <AccordionItem key={cat.id} value={cat.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:bg-white/5">
                      <span className="text-white text-sm font-medium text-left">{cat.name}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-2 px-2 text-gold font-medium">#</th>
                              <th className="text-left py-2 px-2 text-gold font-medium">Criterion</th>
                              <th className="text-center py-2 px-2 text-gold font-medium">Weight (%)</th>
                              <th className="text-center py-2 px-2 text-gold font-medium">Score (1–10)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cat.criteria.map((c, i) => (
                              <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                <td className="py-2 px-2 text-white/50">{i + 1}</td>
                                <td className="py-2 px-2 text-white">{c.name}</td>
                                <td className="py-2 px-2 text-center text-gold">{c.weight}%</td>
                                <td className="py-2 px-2 text-center text-white/40">___</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gold/30">
                              <td colSpan={2} className="py-2 px-2 text-white font-semibold">Total Weight</td>
                              <td className="py-2 px-2 text-center text-gold font-bold">100%</td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Weighted Scoring Example */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Scale className="h-6 w-6 text-gold" />
                Weighted Scoring Example
              </h2>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    {SCORING_EXAMPLE.nominee} – {SCORING_EXAMPLE.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-2 text-gold font-medium">Criterion</th>
                          <th className="text-center py-2 px-2 text-gold font-medium">Score</th>
                          <th className="text-center py-2 px-2 text-gold font-medium">Weight</th>
                          <th className="text-center py-2 px-2 text-gold font-medium">Weighted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SCORING_EXAMPLE.weights.map((w, i) => (
                          <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                            <td className="py-2 px-2 text-white">{w.criterion}</td>
                            <td className="py-2 px-2 text-center text-white">{w.score}</td>
                            <td className="py-2 px-2 text-center text-white/60">{w.weight}%</td>
                            <td className="py-2 px-2 text-center text-gold">{w.weighted.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gold/30 bg-gold/10">
                          <td colSpan={3} className="py-3 px-2 text-white font-semibold">Total Weighted Score</td>
                          <td className="py-3 px-2 text-center text-gold font-bold text-lg">{SCORING_EXAMPLE.totalWeighted} / 10</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td colSpan={3} className="py-2 px-2 text-white/80">Jury Score (out of 100)</td>
                          <td className="py-2 px-2 text-center text-gold font-bold">{SCORING_EXAMPLE.juryScore}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <p className="text-white/60 text-xs italic">
                    * Final score = (Weighted Score × 10). For Blue Garnet categories: Final = (0.40 × Public%) + (0.60 × Jury%)
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Top 3 Screening */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-gold" />
                Top 3 Screening & Final Voting Process
              </h2>
              <div className="space-y-3">
                {SCREENING_STEPS.map((step, i) => (
                  <Card key={i} className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-gold font-bold">{step.step}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                        <p className="text-white/60 text-sm">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* COI Rules */}
            <section>
              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    Conflict of Interest (COI) Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {COI_RULES.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                        <Lock className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Access Panel */}
            <section>
              <Card className="bg-purple-500/10 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-white mb-2">Ready to Score?</h3>
                  <p className="text-white/60 mb-4">Access the Judges Arena to begin scoring assigned nominees.</p>
                  <Button asChild className="bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full px-8">
                    <Link to="/judge">
                      Enter Judges Arena
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* CTA */}
            <div className="text-center pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                  <Download className="mr-2 h-4 w-4" />
                  Download Scoring Template
                </Button>
                <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8">
                  <Link to="/guidelines/edi-matrix">
                    View Full EDI Matrix
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
