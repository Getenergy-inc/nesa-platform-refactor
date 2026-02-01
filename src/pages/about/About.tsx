import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Globe,
  Heart,
  Shield,
  Target,
  Trophy,
  Users,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Building2,
  Lightbulb,
} from "lucide-react";
import africanSchoolImage from "@/assets/african-school-classroom.jpg";

const pillars = [
  {
    icon: Trophy,
    title: "Recognition",
    description: "Celebrating Africa's education champions through merit-based awards across 17 categories.",
    gradient: "from-gold/20 to-gold/5",
  },
  {
    icon: Shield,
    title: "Accountability",
    description: "Governance-grade firewalls ensure sponsor independence and voting integrity.",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Globe,
    title: "Continental Reach",
    description: "Region-first approach covering all 5 African regions plus Diaspora and Friends of Africa.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: Heart,
    title: "Legacy Impact",
    description: "Driving Education for All through visibility, validation, and Rebuild My School Africa.",
    gradient: "from-rose-500/20 to-rose-500/5",
  },
];

const impactStats = [
  { value: "54", label: "African Countries", icon: Globe },
  { value: "5", label: "Regions + Diaspora", icon: Building2 },
  { value: "17", label: "Award Categories", icon: Award },
  { value: "15+", label: "Years of Vision", icon: Lightbulb },
];

const awardTiers = [
  {
    title: "Platinum Certificate",
    subtitle: "Foundation Recognition",
    description: "Baseline recognition for service contribution to Education for All. Non-competitive, NRC verified, valid for 1 year.",
    color: "from-slate-300 to-slate-400",
    textColor: "text-slate-300",
    borderColor: "border-slate-400/30",
  },
  {
    title: "Africa Education Icon",
    subtitle: "Lifetime Achievement",
    description: "Honoring individuals with 15+ years of transformative impact. Covers Africa, Diaspora, and Friends of Africa.",
    color: "from-gold to-amber-600",
    textColor: "text-gold",
    borderColor: "border-gold/30",
  },
  {
    title: "Gold Certificate",
    subtitle: "Public Choice Award",
    description: "Competitive recognition through 100% public voting with AGC. Region-first approach feeds into Blue Garnet.",
    color: "from-yellow-400 to-amber-500",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-400/30",
  },
  {
    title: "Blue Garnet Award",
    subtitle: "Africa's Highest Honour",
    description: "The pinnacle recognition — 60% Jury scoring, 40% Public voting. 9 winners announced at the live Gala.",
    color: "from-blue-500 to-indigo-600",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
];

const quickLinks = [
  { label: "Vision 2035", href: "/about/vision-2035", icon: Target, description: "Our 15-year strategic roadmap" },
  { label: "Governance & Firewalls", href: "/about/governance", icon: Shield, description: "Integrity systems & policies" },
  { label: "Programme Timeline", href: "/about/timeline", icon: BookOpen, description: "Full awards cycle schedule" },
  { label: "SCEF Foundation", href: "/about/scef", icon: Users, description: "Our founding organization" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>About NESA-Africa | New Education Standard Award Africa</title>
        <meta
          name="description"
          content="NESA-Africa is a governance-grade education accountability platform recognizing Africa's changemakers shaping the future of education."
        />
      </Helmet>

      {/* Hero Section with Image */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={africanSchoolImage}
            alt="African school classroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-gold">{currentEdition?.displayYear} Edition</span>
              </div>
              
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl leading-tight">
                About <span className="text-gold">NESA-Africa</span>
              </h1>
              
              <p className="mb-4 text-xl text-white/90 font-medium">
                More than an awards platform.
              </p>
              
              <p className="mb-8 text-lg text-white/70 leading-relaxed max-w-xl">
                NESA-Africa is a <strong className="text-white">governance-grade education accountability system</strong> — 
                celebrating, validating, and amplifying Africa's education champions while funding 
                measurable legacy impact through <span className="text-gold">Rebuild My School Africa</span>.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                  <Link to="/categories">
                    <Award className="mr-2 h-5 w-5" />
                    Explore Categories
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
                  <Link to="/nominate">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Nominate Now
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Impact Stats Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-charcoal/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                <h3 className="text-gold font-display text-xl font-semibold mb-6 text-center">Our Reach</h3>
                <div className="grid grid-cols-2 gap-6">
                  {impactStats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5">
                      <stat.icon className="h-6 w-6 text-gold mx-auto mb-2" />
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Stats Strip */}
      <section className="lg:hidden bg-charcoal border-y border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-gold">{stat.value}</p>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="inline-block mb-4 text-gold text-sm font-semibold uppercase tracking-wider">Our Mission</span>
            <h2 className="mb-8 font-display text-3xl lg:text-4xl font-bold text-white leading-tight">
              "Advocating & Achieving{" "}
              <span className="text-gold">Education For All</span> In Africa"
            </h2>
            <p className="text-lg lg:text-xl leading-relaxed text-white/70">
              To recognize, validate, and celebrate individuals, organizations, and institutions
              driving transformative change in African education — through transparent, merit-based awards 
              that inspire action, ensure accountability, and fund lasting legacy impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="bg-charcoal py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block mb-4 text-gold text-sm font-semibold uppercase tracking-wider">Foundation</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
              Our Four Pillars
            </h2>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {pillars.map((pillar, index) => (
              <motion.div key={pillar.title} variants={itemVariants}>
                <Card className={`h-full border-white/10 bg-gradient-to-br ${pillar.gradient} backdrop-blur-sm hover:border-gold/30 transition-all duration-300 group`}>
                  <CardHeader>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-charcoal/50 border border-white/10 group-hover:border-gold/30 transition-colors">
                      <pillar.icon className="h-7 w-7 text-gold" />
                    </div>
                    <CardTitle className="text-white text-xl">{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/60 text-base leading-relaxed">
                      {pillar.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Award Tiers */}
      <section className="bg-gradient-to-b from-charcoal/95 to-charcoal py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block mb-4 text-gold text-sm font-semibold uppercase tracking-wider">Recognition Levels</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
              Award Tiers
            </h2>
            <p className="mx-auto max-w-2xl text-white/60 text-lg">
              Four distinct recognition platforms, each with unique criteria and selection processes.
            </p>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2"
          >
            {awardTiers.map((tier) => (
              <motion.div key={tier.title} variants={itemVariants}>
                <Card className={`h-full border ${tier.borderColor} bg-white/5 hover:bg-white/8 transition-all duration-300 overflow-hidden group`}>
                  <div className={`h-1 bg-gradient-to-r ${tier.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className={`${tier.textColor} text-xl flex items-center gap-2`}>
                          <Trophy className="h-5 w-5" />
                          {tier.title}
                        </CardTitle>
                        <p className="text-white/50 text-sm mt-1">{tier.subtitle}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 leading-relaxed">{tier.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full">
              <Link to="/categories">
                View All Categories
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-charcoal py-20 lg:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block mb-4 text-gold text-sm font-semibold uppercase tracking-wider">Explore</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
              Learn More
            </h2>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2"
          >
            {quickLinks.map((link) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  to={link.href}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-gold/50 hover:bg-white/10 hover:shadow-lg hover:shadow-gold/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors">
                      <link.icon className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{link.label}</span>
                      <span className="text-sm text-white/50">{link.description}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-6 font-display text-3xl lg:text-4xl font-bold text-white">
              Join the Movement
            </h2>
            <p className="mb-8 text-lg text-white/70">
              Be part of Africa's most trusted education recognition platform. Nominate a changemaker, 
              vote with AGC, or partner with us to amplify impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
                <Link to="/nominate">
                  <Award className="mr-2 h-5 w-5" />
                  Nominate Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8">
                <Link to="/vote">
                  Vote with AGC
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-8">
                <Link to="/partners">
                  Become a Partner
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
