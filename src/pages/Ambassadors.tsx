import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  Globe, 
  Target, 
  Award, 
  Users, 
  Briefcase, 
  Gift, 
  Mail, 
  CreditCard,
  CheckCircle,
  Star,
  Sparkles,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const whyJoinReasons = [
  "Promote education equity and inclusion",
  "Represent your country, city, or institution in the NESA movement",
  "Gain recognition, experience, and global exposure",
  "Join high-impact teams working towards Africa's Education Agenda 2030",
];

const ambassadorTiers = [
  {
    tier: "Ambassador-1",
    description: "Local Chapter Project Ambassador (e.g., EduAid/NESA)",
    adminFee: "$10",
    annualDues: "$50/year",
    benefits: "Recognition, Project Access, Digital Certificate",
    highlight: false,
  },
  {
    tier: "Ambassador-2",
    description: "Country/Regional Representative across both EduAid & NESA",
    adminFee: "$20",
    annualDues: "$80/year",
    benefits: "Priority Participation, SCEF Badge, Chapter Leadership Eligibility",
    highlight: true,
  },
  {
    tier: "Ambassador-3",
    description: "Global or Multi-Project Strategic Ambassador",
    adminFee: "$50",
    annualDues: "$200/year",
    benefits: "Full Representation Rights, Official ID, Invitation to SCEF Board/Chapter Advisory Teams",
    highlight: false,
  },
];

const duties = [
  "Represent NESA-Africa 2025 and SCEF in your locality or diaspora network",
  "Promote nominations, scholarships, fundraising, and EduAid projects",
  "Host or support local chapter activities, online campaigns, and awareness sessions",
  "Engage communities, institutions, and media to amplify our message",
  "Submit monthly ambassador updates and referrals via the dashboard",
  "Participate in periodic trainings, webinars, and meetings",
];

const benefits = [
  "Digital Recognition Certificate",
  "NESA Africa 2025 Ambassador ID Card",
  "Access to training, international mentorship, and webinars",
  "Up to 10–20% referral/commission on funds raised or partners you introduce",
  "Media features on NESA Africa TV & \"It's In Me\" Radio",
  "Opportunity to earn allowances during major campaigns",
  "Discounted access to NESA-Africa events, merchandise, and courses",
  "Eligible for leadership or chapter appointment roles in your region",
];

const integrationChannels = [
  {
    title: "Local Chapters across Africa",
    icon: Globe,
  },
  {
    title: "Online Country Networks in the diaspora",
    icon: Users,
  },
  {
    title: "Sector-Focused Missions (Media, EduTech, Policy, Gender, Environment, etc.)",
    icon: Target,
  },
];

const diasporaContributions = [
  "In-kind contributions (equipment, platforms, time)",
  "Skills volunteering (e.g., designers, developers, advisors)",
  "Financial contributions or donor engagement",
];

const registrationSteps = [
  "Choose your Ambassador Tier (1, 2, or 3)",
  "Pay a one-time administrative fee via the GFA Wallet: Amb-1: $10 | Amb-2: $20 | Amb-3: $50",
  "Complete your ambassador profile and select your chapter of affiliation",
  "Pay annual dues ($50, $80, or $200 respectively)",
  "Begin your ambassador journey with NESA-Africa 2025!",
];

export default function Ambassadors() {
  return (
    <>
      <Helmet>
        <title>Join as an Ambassador | NESA-Africa 2025</title>
        <meta
          name="description"
          content="Become a NESA-Africa 2025 Ambassador. Contribute your skills to achieving Education for All across Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30 px-4 py-1.5">
                <Globe className="h-4 w-4 mr-2" />
                NESA-Africa 2025
              </Badge>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                🌍 Join as an Ambassador
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
                Contribute your skills to achieving Education for All across Africa.
              </p>
              
              <p className="text-lg text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
                Become part of a powerful movement transforming education in Africa. As a NESA-Africa 2025 Ambassador, 
                you are not just a representative — you are a <span className="text-gold font-semibold">changemaker</span>. 
                Whether you're in Africa or the diaspora, your voice and effort can help drive continental impact through 
                community engagement, advocacy, project promotion, and digital campaigns.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold rounded-full px-8">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-8"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                🎯 Why Join?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {whyJoinReasons.map((reason, index) => (
                <motion.div
                  key={reason}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-gold/20 hover:border-gold/40 transition-colors bg-card/50">
                    <CardContent className="pt-6">
                      <CheckCircle className="h-8 w-8 text-gold mb-4" />
                      <p className="text-foreground font-medium">{reason}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ambassador Tiers Section */}
        <section className="py-16 md:py-20 bg-charcoal">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                🏅 3 Tiers of NESA-Africa Ambassadors
              </h2>
            </motion.div>

            {/* Desktop Table */}
            <div className="hidden md:block max-w-6xl mx-auto">
              <Card className="border-gold/20 bg-charcoal-light overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/20 hover:bg-transparent">
                      <TableHead className="text-gold font-semibold">Tier</TableHead>
                      <TableHead className="text-gold font-semibold">Description</TableHead>
                      <TableHead className="text-gold font-semibold">One-Time Admin Fee</TableHead>
                      <TableHead className="text-gold font-semibold">Annual Membership Dues</TableHead>
                      <TableHead className="text-gold font-semibold">Key Benefits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ambassadorTiers.map((tier) => (
                      <TableRow 
                        key={tier.tier} 
                        className={`border-gold/20 ${tier.highlight ? 'bg-gold/10' : ''}`}
                      >
                        <TableCell className="font-semibold text-white">
                          {tier.highlight && <Star className="h-4 w-4 text-gold inline mr-2" />}
                          {tier.tier}
                        </TableCell>
                        <TableCell className="text-white/80">{tier.description}</TableCell>
                        <TableCell className="text-gold font-semibold">{tier.adminFee}</TableCell>
                        <TableCell className="text-gold font-semibold">{tier.annualDues}</TableCell>
                        <TableCell className="text-white/80">{tier.benefits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {ambassadorTiers.map((tier, index) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`border-gold/20 bg-charcoal-light ${tier.highlight ? 'ring-2 ring-gold/50' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-gold flex items-center gap-2">
                        {tier.highlight && <Star className="h-5 w-5" />}
                        {tier.tier}
                      </CardTitle>
                      <CardDescription className="text-white/70">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Admin Fee:</span>
                        <span className="text-gold font-semibold">{tier.adminFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Annual Dues:</span>
                        <span className="text-gold font-semibold">{tier.annualDues}</span>
                      </div>
                      <div className="pt-2 border-t border-gold/20">
                        <p className="text-white/80 text-sm">{tier.benefits}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-white/60 mt-8 max-w-2xl mx-auto">
              💡 All tiers are open to professionals, media advocates, educators, students (18+), and volunteers worldwide.
            </p>
          </div>
        </section>

        {/* Duties Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  💼 Duties of an Ambassador
                </h2>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-4">
                {duties.map((duty, index) => (
                  <motion.div
                    key={duty}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
                  >
                    <Briefcase className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{duty}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-20 bg-charcoal">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  💸 Benefits of Becoming an Ambassador
                </h2>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-charcoal-light border border-gold/20"
                  >
                    <Gift className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-white/90">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Global & Diaspora Integration */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  🤝 Global & Diaspora Integration
                </h2>
                <p className="text-muted-foreground text-lg">
                  Ambassadors can serve through:
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {integrationChannels.map((channel, index) => (
                  <motion.div
                    key={channel.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full text-center border-gold/20 hover:border-gold/40 transition-colors">
                      <CardContent className="pt-6">
                        <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                          <channel.icon className="h-7 w-7 text-gold" />
                        </div>
                        <p className="text-foreground font-medium">{channel.title}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="border-gold/20 bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">SCEF recognizes and mobilizes diaspora support via:</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {diasporaContributions.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-gold flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Register */}
        <section className="py-16 md:py-20 bg-charcoal">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  📩 How to Register
                </h2>
              </motion.div>

              <div className="space-y-4">
                {registrationSteps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-light border border-gold/20"
                  >
                    <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold font-bold">{index + 1}</span>
                    </div>
                    <p className="text-white/90 pt-1">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-gold/20 via-charcoal to-charcoal">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to make your mark?
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3 text-white/80">
                  <Globe className="h-5 w-5 text-gold" />
                  <span>Visit <a href="https://www.nesa.africa/ambassadors" className="text-gold hover:underline">www.nesa.africa/ambassadors</a></span>
                </div>
                <div className="flex items-center justify-center gap-3 text-white/80">
                  <Mail className="h-5 w-5 text-gold" />
                  <span>Contact: <a href="mailto:ambassador@santoscreations.org" className="text-gold hover:underline">ambassador@santoscreations.org</a></span>
                </div>
                <div className="flex items-center justify-center gap-3 text-white/80">
                  <CreditCard className="h-5 w-5 text-gold" />
                  <span>Payments via: <a href="https://www.getfinance.africa" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline inline-flex items-center gap-1">
                    GFA Wallet (www.getfinance.africa)
                    <ExternalLink className="h-3 w-3" />
                  </a></span>
                </div>
              </div>

              <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold rounded-full px-10">
                Apply as Ambassador
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
