import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSeason } from "@/contexts/SeasonContext";
import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  Award, 
  Vote, 
  FileCheck, 
  Users, 
  Shield, 
  Wallet,
  MessageCircle
} from "lucide-react";
import { useState, useMemo } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqCategories = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "nominations", label: "Nominations", icon: Award },
  { id: "voting", label: "Voting", icon: Vote },
  { id: "awards", label: "Award Tiers", icon: FileCheck },
  { id: "governance", label: "Governance", icon: Shield },
  { id: "participation", label: "Participation", icon: Users },
  { id: "payments", label: "Payments & Wallet", icon: Wallet },
];

const faqs: FAQItem[] = [
  // Nominations
  {
    category: "nominations",
    question: "Who can submit a nomination?",
    answer: "Anyone can submit a nomination for an individual or organization making a positive impact in African education. You must create an account and provide supporting evidence for your nomination. Self-nominations are also accepted."
  },
  {
    category: "nominations",
    question: "What is the nomination process?",
    answer: "The nomination process involves: 1) Creating an account, 2) Selecting the appropriate award category and subcategory, 3) Providing nominee details including name, title, and organization, 4) Submitting supporting evidence (photos, documents, links), and 5) Writing a justification explaining why this nominee deserves recognition."
  },
  {
    category: "nominations",
    question: "What happens after I submit a nomination?",
    answer: "After submission, your nomination enters the NRC (Nominee Review Committee) review queue. The NRC verifies all evidence and validates the nomination. If approved, the nominee may receive Platinum certification or advance to competitive voting rounds."
  },
  {
    category: "nominations",
    question: "Can I nominate someone for multiple categories?",
    answer: "Yes, you can nominate the same individual or organization for multiple categories, provided they meet the eligibility criteria for each category and you submit separate nominations with relevant evidence for each."
  },
  {
    category: "nominations",
    question: "What is the renomination counter?",
    answer: "The renomination counter tracks how many times a nominee has been independently nominated (up to 200). Higher renomination counts indicate broader community recognition and may strengthen a nomination during NRC review."
  },
  // Voting
  {
    category: "voting",
    question: "How does public voting work?",
    answer: "Public voting opens during the designated voting stage. Authenticated users can cast one vote per nominee per category. For Gold Certificate awards, voting is 100% public. For Blue Garnet awards, public voting counts for 40% of the final score."
  },
  {
    category: "voting",
    question: "Can I vote for multiple nominees?",
    answer: "Yes, you can vote for multiple nominees across different categories. However, you can only cast one vote per nominee — duplicate votes are prevented by the system."
  },
  {
    category: "voting",
    question: "When does voting open and close?",
    answer: "Voting stages are season-specific and controlled by our governance system. Check the Programme Timeline page or the stage banner on the homepage for current dates. You'll be notified when voting opens."
  },
  {
    category: "voting",
    question: "How is the Blue Garnet winner determined?",
    answer: "Blue Garnet winners are determined by a combined score: 40% from public voting and 60% from jury scoring. The jury consists of education experts, industry leaders, and governance professionals who evaluate finalists based on impact, innovation, and sustainability."
  },
  // Award Tiers
  {
    category: "awards",
    question: "What are the different award tiers?",
    answer: "NESA-Africa has four award tiers: 1) Platinum Certificate — baseline recognition for all verified nominees, 2) Gold Certificate — regional recognition through public voting, 3) Blue Garnet Award — highest honor determined by jury + public vote, 4) Africa Education Icon — lifetime recognition for transformational leaders."
  },
  {
    category: "awards",
    question: "What is the Platinum Certificate?",
    answer: "The Platinum Certificate is a non-competitive baseline recognition awarded to all nominees who pass NRC verification. It validates the nominee's contribution to African education and is valid for one year."
  },
  {
    category: "awards",
    question: "How do I qualify for the Gold Certificate?",
    answer: "Gold Certificate is awarded to the top-voted nominees in each regional subcategory through 100% public voting. Nominees must first receive Platinum certification, then compete in the public voting stage."
  },
  {
    category: "awards",
    question: "What is the Africa Education Icon award?",
    answer: "The Africa Education Icon is a lifetime recognition for individuals who have made transformational, generational impact on African education. It is awarded across three subcategories: African Icons, Diaspora Icons, and Friends of Africa."
  },
  // Governance
  {
    category: "governance",
    question: "What are governance firewalls?",
    answer: "Governance firewalls are integrity measures that ensure fair, transparent, and unbiased award processes. They include: sponsor isolation (sponsors cannot influence voting/nominations), stage locking (actions restricted to appropriate phases), audit trails, and conflict of interest disclosures."
  },
  {
    category: "governance",
    question: "Can sponsors influence nominations or voting?",
    answer: "Absolutely not. Our sponsor isolation firewall ensures that sponsors have no access to nomination data, voting systems, jury scoring, or results until public announcement. Sponsor branding is never displayed on certificates or voting interfaces."
  },
  {
    category: "governance",
    question: "How is data integrity maintained?",
    answer: "All critical actions (nominations, votes, reviews, scores) are recorded in immutable audit logs with timestamps, user IDs, and IP addresses. The NRC review process includes evidence validation, and all changes are tracked."
  },
  {
    category: "governance",
    question: "What is the role of the NRC?",
    answer: "The Nominee Review Committee (NRC) is an independent body that reviews all nominations, validates evidence, and determines Platinum certification. NRC members must disclose any conflicts of interest and follow strict ethical guidelines."
  },
  // Participation
  {
    category: "participation",
    question: "How can I become a judge?",
    answer: "Jury members are selected based on expertise in education, governance, or related fields. You can apply through the 'Become a Judge' page. Applicants must have 10+ years of experience, demonstrate thought leadership, and pass conflict of interest screening."
  },
  {
    category: "participation",
    question: "How can I start a local chapter?",
    answer: "Local chapters expand NESA's reach to specific regions or countries. To start a chapter, visit the Chapters page and submit an expression of interest. Chapter leads manage up to 4 local categories and coordinate regional events."
  },
  {
    category: "participation",
    question: "Can I volunteer with NESA-Africa?",
    answer: "Yes! We welcome volunteers for various roles including event coordination, content creation, translation, community outreach, and technical support. Visit the Volunteer page to explore opportunities."
  },
  {
    category: "participation",
    question: "How do I attend the Awards Gala?",
    answer: "Tickets for the NESA-Africa Awards Gala can be purchased through our platform when available. The ceremony celebrates all award recipients with live entertainment, networking, and the presentation of Blue Garnet awards."
  },
  // Payments & Wallet
  {
    category: "payments",
    question: "What is the NESA Wallet?",
    answer: "The NESA Wallet is a UI-only transaction record system that tracks your donations, ticket purchases, and other financial transactions. It does not store actual funds — all payments are processed through secure payment gateways (Paystack, Flutterwave)."
  },
  {
    category: "payments",
    question: "How are donations allocated?",
    answer: "Donations follow the GFA WZIP (Giving For Africa Within Zone Implementation Plan) split: portions are allocated to education programs, local chapter operations, platform maintenance, and strategic initiatives. Full transparency reports are available."
  },
  {
    category: "payments",
    question: "What payment methods are accepted?",
    answer: "We accept payments via Paystack and Flutterwave, supporting bank cards, bank transfers, mobile money, and other regional payment methods across Africa."
  },
  {
    category: "payments",
    question: "Can I get a receipt for my donation?",
    answer: "Yes, all successful transactions generate a receipt that is emailed to you and stored in your Wallet transaction history. Receipts can be downloaded for tax or record-keeping purposes."
  },
];

export default function FAQ() {
  const { currentEdition } = useSeason();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch = searchQuery === "" || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | {currentEdition.name}</title>
        <meta
          name="description"
          content="Find answers to common questions about NESA-Africa nominations, voting, award tiers, governance, and participation."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal py-16 sm:py-20">
          <div className="container">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="max-w-3xl">
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                <HelpCircle className="h-3 w-3 mr-1" />
                Help Center
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Frequently Asked <span className="text-gold">Questions</span>
              </h1>
              <p className="text-white/70 text-lg">
                Find answers to common questions about nominations, voting, awards, and how to participate in NESA-Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 border-b border-gold/10">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-charcoal-light border-gold/20 text-white placeholder:text-white/40"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {faqCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat.id)}
                    className={
                      activeCategory === cat.id
                        ? "bg-gold text-charcoal hover:bg-gold-light"
                        : "border-gold/30 text-gold hover:bg-gold/10"
                    }
                  >
                    <cat.icon className="h-3 w-3 mr-1.5" />
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 sm:py-16">
          <div className="container max-w-4xl">
            {filteredFaqs.length === 0 ? (
              <Card className="bg-charcoal-light border-gold/10">
                <CardContent className="py-12 text-center">
                  <HelpCircle className="h-12 w-12 text-gold/30 mx-auto mb-4" />
                  <p className="text-white/70">No questions found matching your search.</p>
                  <Button
                    variant="link"
                    className="text-gold mt-2"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="bg-charcoal-light border border-gold/10 rounded-lg px-6 data-[state=open]:border-gold/30"
                  >
                    <AccordionTrigger className="text-white hover:text-gold text-left py-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="text-xs border-gold/30 text-gold shrink-0 mt-0.5">
                          {faqCategories.find(c => c.id === faq.category)?.label || faq.category}
                        </Badge>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70 pb-4 pl-0">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Results count */}
            <p className="text-white/50 text-sm mt-6 text-center">
              Showing {filteredFaqs.length} of {faqs.length} questions
            </p>
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="py-12 sm:py-16 border-t border-gold/10">
          <div className="container">
            <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20 max-w-2xl mx-auto">
              <CardContent className="py-10 text-center">
                <MessageCircle className="h-12 w-12 text-gold mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-white mb-3">
                  Still Have Questions?
                </h2>
                <p className="text-white/70 mb-6">
                  Can't find what you're looking for? Our team is here to help.
                </p>
                <Link to="/contact">
                  <Button className="bg-gold hover:bg-gold-light text-charcoal font-semibold">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
