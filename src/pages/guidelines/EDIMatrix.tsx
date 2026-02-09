/**
 * EDI Matrix & Guidelines Page
 * 
 * The central integrity feature of NESA-Africa 2025.
 * Comprehensive Education Development Index with all 3 levels,
 * development areas, key questions, and judging criteria.
 */

import { useState } from "react";
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
  Shield,
  Download,
  FileText,
  ChevronRight,
  Award,
  Crown,
  Star,
  AlertTriangle,
  CheckCircle,
  Users,
  BookOpen,
  Lightbulb,
  Target,
  Globe,
  Heart,
  Scale,
  TrendingUp,
  Building2,
  GraduationCap,
  Sparkles,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// EDI LEVEL DATA
// ─────────────────────────────────────────────────────────────────────────────

const LEVEL_1_PLATINUM = {
  title: "Level 1: Platinum Certificate of Merit",
  description: "Recognition-only track requiring verified contribution thresholds. No public voting. Expert evaluation by NRC panel.",
  thresholds: {
    core: { count: 7, renominations: 100 },
    standard: { count: 10, renominations: 200 },
  },
  categories: [
    {
      name: "Library Development in Education (Nigeria)",
      areas: [
        "Infrastructure investment in school libraries",
        "Collection development and resource acquisition",
        "Reading culture promotion programs",
        "Digital library integration initiatives",
        "Community library outreach programs",
      ],
      keyQuestions: [
        "How many libraries has your organization established or renovated in the past 3–5 years?",
        "What measurable improvements in student literacy have resulted from these initiatives?",
        "Describe your approach to digital library integration in underserved communities.",
        "What partnerships have you formed with schools, government, or NGOs for library development?",
        "How do you ensure sustainability and continued operation of the libraries you establish?",
      ],
    },
    {
      name: "Research & Development in Education (Nigeria)",
      areas: [
        "Educational research publications and impact",
        "Curriculum innovation and development",
        "Teacher training methodologies",
        "Learning outcomes assessment tools",
        "Policy influence through research",
      ],
      keyQuestions: [
        "List your major peer-reviewed publications on education in the past 5 years.",
        "How has your research influenced education policy or practice in Nigeria?",
        "Describe your curriculum innovation work and its adoption rate.",
        "What measurable improvements in teacher effectiveness have resulted from your training programs?",
        "How do you disseminate research findings to practitioners and policymakers?",
      ],
    },
    {
      name: "Faith-Based Education Excellence (Christian/Islamic)",
      areas: [
        "Faith-integrated curriculum development",
        "Values-based character education programs",
        "Interfaith education dialogue initiatives",
        "Community moral development outreach",
        "Religious literacy and tolerance education",
      ],
      keyQuestions: [
        "How does your institution integrate faith values with academic excellence?",
        "What character development outcomes can you demonstrate in graduates?",
        "Describe your approach to religious tolerance and interfaith understanding.",
        "How many students/beneficiaries have your programs reached in the past 3–5 years?",
        "What community moral development initiatives have you implemented?",
      ],
    },
    {
      name: "Political Leadership in Education (Nigeria)",
      areas: [
        "Education budget advocacy and increases",
        "Policy reform initiatives and legislation",
        "Public school infrastructure development",
        "Teacher welfare and recruitment improvements",
        "Educational emergency response and management",
      ],
      keyQuestions: [
        "What specific education budget increases have you championed in your tenure?",
        "List major education policies or legislation you have sponsored or supported.",
        "How many new schools or renovations have been completed under your leadership?",
        "What measurable improvements in teacher welfare can you demonstrate?",
        "How have you responded to educational emergencies in your constituency?",
      ],
    },
    {
      name: "International Education Support",
      areas: [
        "Cross-border educational partnerships",
        "International scholarship programs for Africans",
        "Global education technology transfer",
        "International teacher exchange programs",
        "Global education standards adoption",
      ],
      keyQuestions: [
        "Describe your organization's educational partnerships across African borders.",
        "How many African students have benefited from your scholarship programs?",
        "What educational technologies have you transferred to African institutions?",
        "How do your programs align with global education standards (SDG4)?",
        "What measurable capacity building have you achieved in partner institutions?",
      ],
    },
    {
      name: "Diaspora Education Contributions",
      areas: [
        "Remittance for education programs",
        "Diaspora teacher volunteer initiatives",
        "Educational material and technology donations",
        "Diaspora mentorship and career guidance",
        "Brain-gain and return programs",
      ],
      keyQuestions: [
        "Quantify your educational investments or donations to African education.",
        "How many volunteer teaching hours have you or your organization contributed?",
        "What educational materials or technologies have you donated?",
        "Describe your mentorship programs connecting diaspora professionals with African students.",
        "What brain-gain initiatives have you supported?",
      ],
    },
    {
      name: "Friends of Africa Education",
      areas: [
        "International aid for African education",
        "Cross-cultural education exchange programs",
        "Global advocacy for African education",
        "Development partner coordination",
        "Sustainable education infrastructure investment",
      ],
      keyQuestions: [
        "What total investment has your organization made in African education?",
        "How many African students or educators have benefited from your programs?",
        "Describe your coordination with African governments and local partners.",
        "What sustainable infrastructure have you built for education?",
        "How do you ensure programs are culturally appropriate and locally led?",
      ],
    },
  ],
};

const LEVEL_2_ICONS = {
  title: "Level 2: Africa Education Icon Award (Blue Garnet)",
  description: "Lifetime achievement recognition for 10+ years of sustained educational impact. Expert-selected by independent jury panel.",
  criteria: [
    {
      area: "Decade of Sustained Impact",
      description: "Minimum 10 years of continuous, documented contribution to African education",
      keyQuestions: [
        "Provide a detailed timeline of your educational contributions from 2005 to present.",
        "How has your impact evolved and scaled over this period?",
        "What major milestones mark your educational journey?",
      ],
    },
    {
      area: "Institutional Legacy Building",
      description: "Creation or transformation of educational institutions that outlast the individual",
      keyQuestions: [
        "What institutions have you founded, transformed, or significantly influenced?",
        "How do these institutions continue to function and impact education independently?",
        "What governance structures have you put in place for institutional sustainability?",
      ],
    },
    {
      area: "Generational Influence",
      description: "Impact spanning multiple generations of learners, educators, or policymakers",
      keyQuestions: [
        "How many generations of students/educators have been directly influenced by your work?",
        "Name mentees who have become education leaders in their own right.",
        "What is your legacy of knowledge transfer and capacity building?",
      ],
    },
    {
      area: "Pan-African Reach",
      description: "Influence extending beyond a single country or region across Africa",
      keyQuestions: [
        "In how many African countries has your work had documented impact?",
        "Describe your pan-African partnerships and collaborations.",
        "How has your model or approach been replicated across the continent?",
      ],
    },
    {
      area: "Transformational Innovation",
      description: "Introduction of fundamentally new approaches that changed education practice",
      keyQuestions: [
        "What fundamentally new approaches to education have you pioneered?",
        "How has your innovation been adopted and adapted by others?",
        "What problems did your innovation solve that others couldn't?",
      ],
    },
  ],
  subcategories: [
    "Africa Education Icon – Individual (Lifetime Achievement)",
    "Africa Education Icon – Institution (Organizational Legacy)",
    "Africa Education Icon – Innovation Pioneer",
  ],
};

const LEVEL_3_COMPETITIVE = {
  title: "Level 3: Competitive Awards (Gold & Blue Garnet Certificates)",
  description: "Public voting (30–50%) + Jury assessment (50–70%). 9 categories with 135 subcategories across Africa-wide and Nigeria-specific scopes.",
  categories: [
    {
      id: "media-advocacy",
      name: "Media Advocacy in Education",
      scope: "Nigeria",
      criteria: [
        { criterion: "Impact on Education Awareness", weight: 10, description: "How effectively has the media platform raised awareness about education issues?" },
        { criterion: "Reach and Audience Engagement", weight: 10, description: "Size and engagement level of the audience reached" },
        { criterion: "Quality of Educational Content", weight: 10, description: "Accuracy, depth, and relevance of educational content produced" },
        { criterion: "Advocacy Campaigns Effectiveness", weight: 10, description: "Success of campaigns in influencing education policy or practice" },
        { criterion: "Innovation in Education Reporting", weight: 10, description: "Novel approaches to education journalism and storytelling" },
        { criterion: "Community Engagement", weight: 10, description: "Level of interaction with educational communities" },
        { criterion: "Consistency of Coverage", weight: 10, description: "Regular and sustained coverage of education topics" },
        { criterion: "Awards and Recognition", weight: 5, description: "Industry recognition for education coverage" },
        { criterion: "Partnership with Education Stakeholders", weight: 10, description: "Collaboration with schools, government, and NGOs" },
        { criterion: "Ethical Standards in Reporting", weight: 5, description: "Adherence to journalistic ethics in education coverage" },
      ],
    },
    {
      id: "csr-africa",
      name: "CSR in Education",
      scope: "Africa-wide",
      criteria: [
        { criterion: "Scale of Educational Investment", weight: 10, description: "Total financial investment in educational initiatives" },
        { criterion: "Number of Beneficiaries Reached", weight: 10, description: "Students, teachers, and communities directly impacted" },
        { criterion: "Sustainability of Programs", weight: 10, description: "Long-term viability and continuity of initiatives" },
        { criterion: "Innovation in CSR Approach", weight: 10, description: "Creative and effective methods in education CSR" },
        { criterion: "Alignment with SDG 4", weight: 10, description: "Contribution to quality education goals" },
        { criterion: "Partnership Effectiveness", weight: 10, description: "Collaboration with governments, NGOs, and communities" },
        { criterion: "Measurable Learning Outcomes", weight: 10, description: "Documented improvements in educational results" },
        { criterion: "Employee Engagement in Education", weight: 5, description: "Staff volunteering and participation" },
        { criterion: "Transparency and Reporting", weight: 10, description: "Clear documentation and impact reporting" },
        { criterion: "Equity and Inclusion Focus", weight: 5, description: "Reaching marginalized and underserved populations" },
      ],
    },
    {
      id: "csr-nigeria",
      name: "CSR in Education",
      scope: "Nigeria",
      criteria: [
        { criterion: "Scale of Educational Investment", weight: 10, description: "Total financial investment in educational initiatives" },
        { criterion: "Number of Beneficiaries Reached", weight: 10, description: "Students, teachers, and communities directly impacted" },
        { criterion: "Sustainability of Programs", weight: 10, description: "Long-term viability and continuity of initiatives" },
        { criterion: "Innovation in CSR Approach", weight: 10, description: "Creative and effective methods in education CSR" },
        { criterion: "Alignment with National Education Goals", weight: 10, description: "Contribution to Nigerian education priorities" },
        { criterion: "Partnership with Government", weight: 10, description: "Collaboration with federal and state education bodies" },
        { criterion: "Measurable Learning Outcomes", weight: 10, description: "Documented improvements in educational results" },
        { criterion: "Employee Engagement in Education", weight: 5, description: "Staff volunteering and participation" },
        { criterion: "Transparency and Reporting", weight: 10, description: "Clear documentation and impact reporting" },
        { criterion: "Equity and Inclusion Focus", weight: 5, description: "Reaching marginalized and underserved populations" },
      ],
    },
    {
      id: "edutech",
      name: "EduTech Innovation",
      scope: "Africa-wide",
      criteria: [
        { criterion: "Innovation and Originality", weight: 15, description: "Novelty of the educational technology solution" },
        { criterion: "User Adoption and Growth", weight: 10, description: "Number of users and growth trajectory" },
        { criterion: "Learning Outcomes Impact", weight: 15, description: "Measurable improvements in student learning" },
        { criterion: "Accessibility and Inclusivity", weight: 10, description: "Reaching underserved and diverse populations" },
        { criterion: "Scalability Potential", weight: 10, description: "Ability to expand across regions and countries" },
        { criterion: "Teacher Empowerment", weight: 10, description: "Tools and features that enhance teaching" },
        { criterion: "Data-Driven Insights", weight: 5, description: "Use of analytics for educational improvement" },
        { criterion: "Affordability and Value", weight: 10, description: "Cost-effectiveness for target users" },
        { criterion: "Technical Reliability", weight: 5, description: "Platform stability and performance" },
        { criterion: "Partnership Ecosystem", weight: 10, description: "Collaboration with schools, governments, and content providers" },
      ],
    },
    {
      id: "ngo-africa",
      name: "NGO Contribution to Education",
      scope: "Africa-wide",
      criteria: [
        { criterion: "Reach and Coverage", weight: 10, description: "Geographic and demographic reach of programs" },
        { criterion: "Measurable Impact on Learning", weight: 15, description: "Documented improvements in educational outcomes" },
        { criterion: "Sustainability and Continuity", weight: 10, description: "Long-term viability of interventions" },
        { criterion: "Innovation in Approach", weight: 10, description: "Creative solutions to educational challenges" },
        { criterion: "Community Engagement", weight: 10, description: "Involvement of local communities in program design" },
        { criterion: "Capacity Building", weight: 10, description: "Training of local educators and leaders" },
        { criterion: "Advocacy and Policy Influence", weight: 10, description: "Impact on education policy and practice" },
        { criterion: "Transparency and Accountability", weight: 10, description: "Clear governance and reporting" },
        { criterion: "Partnership Effectiveness", weight: 10, description: "Collaboration with governments and other NGOs" },
        { criterion: "Equity Focus", weight: 5, description: "Reaching marginalized populations" },
      ],
    },
    {
      id: "ngo-nigeria",
      name: "NGO Contribution to Education",
      scope: "Nigeria",
      criteria: [
        { criterion: "Reach and Coverage", weight: 10, description: "Geographic and demographic reach within Nigeria" },
        { criterion: "Measurable Impact on Learning", weight: 15, description: "Documented improvements in educational outcomes" },
        { criterion: "Sustainability and Continuity", weight: 10, description: "Long-term viability of interventions" },
        { criterion: "Innovation in Approach", weight: 10, description: "Creative solutions to Nigerian educational challenges" },
        { criterion: "Community Engagement", weight: 10, description: "Involvement of local communities in program design" },
        { criterion: "Capacity Building", weight: 10, description: "Training of Nigerian educators and leaders" },
        { criterion: "Advocacy and Policy Influence", weight: 10, description: "Impact on Nigerian education policy" },
        { criterion: "Transparency and Accountability", weight: 10, description: "Clear governance and reporting" },
        { criterion: "Partnership with Government", weight: 10, description: "Collaboration with federal and state education bodies" },
        { criterion: "Equity Focus", weight: 5, description: "Reaching marginalized Nigerian populations" },
      ],
    },
    {
      id: "stem",
      name: "STEM Education Excellence",
      scope: "Africa-wide",
      criteria: [
        { criterion: "Program Innovation", weight: 15, description: "Novel approaches to STEM education delivery" },
        { criterion: "Student Enrollment and Retention", weight: 10, description: "Growth in STEM participation" },
        { criterion: "Learning Outcomes", weight: 15, description: "Measurable improvements in STEM competencies" },
        { criterion: "Gender Equity in STEM", weight: 10, description: "Increasing female participation in STEM" },
        { criterion: "Industry Partnerships", weight: 10, description: "Collaboration with technology and science sectors" },
        { criterion: "Teacher Training", weight: 10, description: "Professional development for STEM educators" },
        { criterion: "Infrastructure Development", weight: 10, description: "Labs, equipment, and facilities investment" },
        { criterion: "Research and Competition", weight: 5, description: "Student participation in STEM competitions and research" },
        { criterion: "Community Outreach", weight: 10, description: "STEM awareness and engagement programs" },
        { criterion: "Sustainability", weight: 5, description: "Long-term viability of STEM initiatives" },
      ],
    },
    {
      id: "creative-arts",
      name: "Creative Arts in Education",
      scope: "Nigeria",
      criteria: [
        { criterion: "Artistic Excellence and Innovation", weight: 15, description: "Quality and creativity of arts education" },
        { criterion: "Student Participation and Development", weight: 10, description: "Growth in arts education enrollment" },
        { criterion: "Cultural Preservation", weight: 10, description: "Promotion of Nigerian cultural heritage" },
        { criterion: "Career Pathway Development", weight: 10, description: "Preparing students for creative industries" },
        { criterion: "Community Impact", weight: 10, description: "Arts education's effect on local communities" },
        { criterion: "Infrastructure and Resources", weight: 10, description: "Studios, equipment, and materials investment" },
        { criterion: "Teacher Training and Development", weight: 10, description: "Professional development for arts educators" },
        { criterion: "Partnerships with Creative Industry", weight: 10, description: "Collaboration with galleries, studios, and artists" },
        { criterion: "Exhibitions and Showcases", weight: 10, description: "Student work presentations and competitions" },
        { criterion: "Accessibility and Inclusion", weight: 5, description: "Reaching diverse student populations" },
      ],
    },
    {
      id: "education-state",
      name: "Education-Friendly State",
      scope: "Nigeria",
      criteria: [
        { criterion: "Budget Allocation to Education", weight: 15, description: "Percentage and amount of state budget for education" },
        { criterion: "Enrollment and Completion Rates", weight: 10, description: "Improvements in school attendance and graduation" },
        { criterion: "Infrastructure Development", weight: 10, description: "New schools, renovations, and facilities" },
        { criterion: "Teacher Welfare and Training", weight: 10, description: "Salary payments, benefits, and professional development" },
        { criterion: "Policy Innovation", weight: 10, description: "Progressive education policies and reforms" },
        { criterion: "Learning Outcomes", weight: 15, description: "Improvements in standardized test scores and assessments" },
        { criterion: "Equity and Access", weight: 10, description: "Reaching marginalized and rural populations" },
        { criterion: "Technology Integration", weight: 5, description: "Digital learning and ICT in schools" },
        { criterion: "Community Engagement", weight: 10, description: "Parent and community involvement in education" },
        { criterion: "Accountability and Transparency", weight: 5, description: "Clear reporting on education metrics" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function EDIMatrix() {
  const [expandedLevel, setExpandedLevel] = useState<string[]>(["level-1"]);

  return (
    <>
      <Helmet>
        <title>EDI Matrix & Guidelines | NESA-Africa 2025</title>
        <meta name="description" content="The Education Development Index (EDI) Matrix is the integrity backbone of NESA-Africa 2025, ensuring transparent and fair evaluation of all nominees." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-charcoal to-charcoal" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
          
          <div className="container relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1.5">
                <Shield className="w-4 h-4 mr-2" />
                Integrity Backbone
              </Badge>
              
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                NESA-Africa 2025 Education Development Index
                <span className="block text-gold mt-2">(EDI) Matrix</span>
              </h1>
              
              <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-8">
                The comprehensive framework ensuring transparent, fair, and rigorous evaluation
                of all nominees across three distinct award levels.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full EDI Matrix PDF
                </Button>
                <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-6">
                  <Link to="/nominate">
                    <FileText className="mr-2 h-4 w-4" />
                    View Nomination Form
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Integrity Rules Box */}
        <section className="py-8 bg-charcoal-light border-y border-gold/20">
          <div className="container px-4">
            <Card className="bg-red-500/10 border-red-500/30 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Integrity & Evidence Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white/80">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      Evidence Types Required
                    </h4>
                    <ul className="text-sm space-y-1 text-white/70">
                      <li>• <strong>Tier A:</strong> Independent/Audited reports</li>
                      <li>• <strong>Tier B:</strong> Internal M&E data</li>
                      <li>• <strong>Tier C:</strong> Supporting documentation</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      Red Flags (Auto-Review)
                    </h4>
                    <ul className="text-sm space-y-1 text-white/70">
                      <li>• Unverifiable claims</li>
                      <li>• Conflicting evidence</li>
                      <li>• Missing documentation</li>
                      <li>• Ethical violations</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-400" />
                      Data Period
                    </h4>
                    <p className="text-sm text-white/70">
                      All evidence must cover activities from <strong>January 2023 – September 2025</strong>.
                      Icon Award may include earlier lifetime contributions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              
              {/* Level 1: Platinum */}
              <Accordion type="multiple" value={expandedLevel} onValueChange={setExpandedLevel} className="space-y-4">
                <AccordionItem value="level-1" className="bg-slate-500/10 border border-slate-400/30 rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:bg-slate-400/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-400/20 flex items-center justify-center">
                        <Award className="h-5 w-5 text-slate-300" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white text-lg">{LEVEL_1_PLATINUM.title}</h3>
                        <p className="text-white/60 text-sm">{LEVEL_1_PLATINUM.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="mb-6 p-4 bg-white/5 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Renomination Thresholds</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                          <span className="text-emerald-400 font-semibold">{LEVEL_1_PLATINUM.thresholds.core.count} Core Categories</span>
                          <p className="text-white/60">{LEVEL_1_PLATINUM.thresholds.core.renominations} renominations required</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <span className="text-blue-400 font-semibold">{LEVEL_1_PLATINUM.thresholds.standard.count} Standard Categories</span>
                          <p className="text-white/60">{LEVEL_1_PLATINUM.thresholds.standard.renominations} renominations required</p>
                        </div>
                      </div>
                    </div>
                    
                    <Accordion type="multiple" className="space-y-2">
                      {LEVEL_1_PLATINUM.categories.map((cat, idx) => (
                        <AccordionItem key={idx} value={`platinum-${idx}`} className="bg-white/5 border border-white/10 rounded-lg">
                          <AccordionTrigger className="px-4 py-3 hover:bg-white/5">
                            <span className="text-white text-sm font-medium text-left">{cat.name}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4">
                              <div>
                                <h5 className="text-xs font-semibold text-gold uppercase tracking-wide mb-2">Development Areas</h5>
                                <ul className="space-y-1">
                                  {cat.areas.map((area, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                      {area}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-xs font-semibold text-gold uppercase tracking-wide mb-2">Key Questions</h5>
                                <ol className="space-y-2">
                                  {cat.keyQuestions.map((q, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                                      <span className="text-gold font-semibold">{i + 1}.</span>
                                      {q}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>

                {/* Level 2: Icons */}
                <AccordionItem value="level-2" className="bg-purple-500/10 border border-purple-500/30 rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:bg-purple-500/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Crown className="h-5 w-5 text-purple-300" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white text-lg">{LEVEL_2_ICONS.title}</h3>
                        <p className="text-white/60 text-sm">{LEVEL_2_ICONS.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="mb-6">
                      <h4 className="font-medium text-white mb-3">Subcategories</h4>
                      <div className="flex flex-wrap gap-2">
                        {LEVEL_2_ICONS.subcategories.map((sub, i) => (
                          <Badge key={i} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {LEVEL_2_ICONS.criteria.map((crit, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <h5 className="font-semibold text-white mb-1">{crit.area}</h5>
                          <p className="text-white/60 text-sm mb-3">{crit.description}</p>
                          <div>
                            <h6 className="text-xs font-semibold text-gold uppercase tracking-wide mb-2">Key Questions</h6>
                            <ul className="space-y-1">
                              {crit.keyQuestions.map((q, i) => (
                                <li key={i} className="text-sm text-white/60 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gold">
                                  {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Level 3: Competitive */}
                <AccordionItem value="level-3" className="bg-blue-500/10 border border-blue-500/30 rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:bg-blue-500/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Star className="h-5 w-5 text-blue-300" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white text-lg">{LEVEL_3_COMPETITIVE.title}</h3>
                        <p className="text-white/60 text-sm">{LEVEL_3_COMPETITIVE.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <Accordion type="multiple" className="space-y-3">
                      {LEVEL_3_COMPETITIVE.categories.map((cat) => (
                        <AccordionItem key={cat.id} value={cat.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                          <AccordionTrigger className="px-4 py-3 hover:bg-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm font-medium">{cat.name}</span>
                              <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px]">
                                {cat.scope}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-white/10">
                                    <th className="text-left py-2 px-2 text-gold font-medium">#</th>
                                    <th className="text-left py-2 px-2 text-gold font-medium">Criterion</th>
                                    <th className="text-center py-2 px-2 text-gold font-medium">Weight</th>
                                    <th className="text-left py-2 px-2 text-gold font-medium">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cat.criteria.map((c, i) => (
                                    <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                      <td className="py-2 px-2 text-white/50">{i + 1}</td>
                                      <td className="py-2 px-2 text-white font-medium">{c.criterion}</td>
                                      <td className="py-2 px-2 text-center text-gold">{c.weight}%</td>
                                      <td className="py-2 px-2 text-white/60">{c.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr className="border-t border-gold/30">
                                    <td colSpan={2} className="py-2 px-2 text-white font-semibold">Total</td>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Additional Sections */}
              <div className="mt-12 space-y-8">
                {/* Scoring Rubric */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold">
                      <ClipboardCheck className="h-5 w-5" />
                      Common Scoring Rubric (20-Point Scale)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 px-3 text-gold">Score Range</th>
                            <th className="text-left py-2 px-3 text-gold">Rating</th>
                            <th className="text-left py-2 px-3 text-gold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-white/70">
                          <tr className="border-b border-white/5 bg-emerald-500/5">
                            <td className="py-2 px-3 font-semibold text-emerald-400">9–10</td>
                            <td className="py-2 px-3 text-white">Exceptional</td>
                            <td className="py-2 px-3">Outstanding performance exceeding all expectations with documented evidence</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-blue-500/5">
                            <td className="py-2 px-3 font-semibold text-blue-400">7–8</td>
                            <td className="py-2 px-3 text-white">Strong</td>
                            <td className="py-2 px-3">Above average performance with clear evidence of impact</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-amber-500/5">
                            <td className="py-2 px-3 font-semibold text-amber-400">5–6</td>
                            <td className="py-2 px-3 text-white">Adequate</td>
                            <td className="py-2 px-3">Meets basic requirements with some areas for improvement</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-orange-500/5">
                            <td className="py-2 px-3 font-semibold text-orange-400">3–4</td>
                            <td className="py-2 px-3 text-white">Developing</td>
                            <td className="py-2 px-3">Below expectations with significant gaps in evidence</td>
                          </tr>
                          <tr className="bg-red-500/5">
                            <td className="py-2 px-3 font-semibold text-red-400">1–2</td>
                            <td className="py-2 px-3 text-white">Insufficient</td>
                            <td className="py-2 px-3">Minimal or no evidence provided; does not meet criteria</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Top 3 Screening */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold">
                      <Users className="h-5 w-5" />
                      Screening of Top 3 Gold Finalists
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-white/70">
                    <p>
                      After initial NRC screening and jury scoring, the Top 3 nominees in each competitive category
                      undergo enhanced due diligence:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="font-semibold text-white mb-2">1. Enhanced Verification</h5>
                        <p className="text-sm">Cross-referencing all claims with independent sources and contacting references</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="font-semibold text-white mb-2">2. Conflict of Interest Check</h5>
                        <p className="text-sm">Ensuring no jury member has undisclosed connections to finalists</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="font-semibold text-white mb-2">3. Public Integrity Review</h5>
                        <p className="text-sm">Media and public records check for ethical concerns or controversies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Legacy RMSA & EduAid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-emerald-500/10 border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-400">
                        <Heart className="h-5 w-5" />
                        Legacy: Rebuild My School Africa (RMSA)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/70">
                      <p className="mb-3">
                        A portion of NESA-Africa proceeds supports RMSA, rebuilding and renovating
                        schools across underserved African communities.
                      </p>
                      <Button asChild variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                        <Link to="/rebuild">Learn More About RMSA</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-400">
                        <GraduationCap className="h-5 w-5" />
                        EduAid Pipeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/70">
                      <p className="mb-3">
                        Winners and finalists gain access to the EduAid network, connecting them
                        with resources, partnerships, and funding opportunities.
                      </p>
                      <Button asChild variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                        <Link to="/eduaid">Explore EduAid</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Final CTA */}
              <div className="mt-12 text-center">
                <p className="text-white/60 mb-4">Ready to nominate an education champion?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                    <Link to="/nominate">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Nomination
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8">
                    <Link to="/guidelines/nominators">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Nominator Guidelines
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
