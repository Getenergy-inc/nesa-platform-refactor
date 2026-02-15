import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CertificateGallery } from "@/components/nesa/CertificateGallery";
import { AwardTVShowSection } from "@/components/awards/AwardTVShowSection";
import { AwardHeroSection } from "@/components/awards/AwardHeroSection";
import { AwardCategoriesGrid } from "@/components/awards/AwardCategoriesGrid";
import { getTVShowByAward } from "@/config/awardTVShows";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Award, Globe, Trophy, Users, Vote, Coins, ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import goldCertificateImage from "@/assets/certificates/gold-certificate-showcase.jpg";

const goldTVShow = getTVShowByAward("gold");

const features = [
  { icon: Vote, title: "100% Public Voting", description: "Winners determined entirely by public votes — no jury influence." },
  { icon: Globe, title: "Region-First", description: "Regional winners qualify for continental competition." },
  { icon: Users, title: "Top 3 Per Subcategory", description: "405 Gold Certificate winners across 135 subcategories." },
  { icon: Trophy, title: "Feeds Blue Garnet", description: "All 405 Gold winners compete for the 9 Blue Garnet Awards." },
];

const regions = [
  { name: "North Africa", countries: "Egypt, Morocco, Tunisia, Algeria, Libya" },
  { name: "West Africa", countries: "Nigeria, Ghana, Senegal, Côte d'Ivoire" },
  { name: "East Africa", countries: "Kenya, Tanzania, Uganda, Ethiopia, Rwanda" },
  { name: "Central Africa", countries: "DR Congo, Cameroon, Gabon, Chad" },
  { name: "Southern Africa", countries: "South Africa, Zimbabwe, Zambia, Botswana" },
];

export default function GoldAward() {
  return (
    <>
      <Helmet>
        <title>Gold Certificate | NESA-Africa Public-Voted Recognition</title>
        <meta
          name="description"
          content="The Gold Certificate is NESA-Africa's competitive public-voted recognition — Top 3 winners per subcategory (405 total) across 5 African regions. Vote with AGC."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-20">
          <Breadcrumbs 
            items={[
              { label: "Awards", href: "/categories" },
              { label: "Gold Certificate" },
            ]}
            className="text-ivory/60"
          />
        </div>

        {/* Hero */}
        <AwardHeroSection
          variant="gold"
          title="Gold"
          titleAccent="Certificate"
          description="The competitive stage of NESA recognition. Top 3 highest-voted nominees per subcategory win Gold Certificates — 405 winners across 9 categories, all advancing to the Blue Garnet competition."
          features={["100% Public Voting", "No Judges", "Region-First Competition"]}
          primaryAction={{
            label: "Nominate for Gold",
            href: "/nominate",
            icon: Award,
          }}
          secondaryAction={{
            label: "Vote Now — Apr 10, 2026",
          }}
        />

        {/* AGC Voting Integration */}
        <section className="border-t border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-charcoal py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-4">
                    <Coins className="h-4 w-4 text-gold" />
                    <span className="text-sm font-medium text-gold">Vote with AGC</span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                    Earn Voting Points. <span className="text-amber-400">Decide Winners.</span>
                  </h3>
                  <p className="text-white/70 mb-6">
                    Your participation earns <span className="text-gold font-semibold">AGC voting credits</span>. 
                    Use them during the Gold Certificate voting window to support your favorite nominees.
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {[
                      "1 Vote = 1 AGC — simple and transparent",
                      "Earn AGC through nominations, daily sign-ins, referrals",
                      "All votes recorded with full audit trail",
                    ].map((point) => (
                      <li key={point} className="flex items-start gap-2 text-white/80 text-sm">
                        <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/earn-voting-credits">
                      <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                        <Sparkles className="h-4 w-4" />
                        Earn AGC Now
                      </Button>
                    </Link>
                    <Link to="/about-agc">
                      <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
                        How AGC Works
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Earning Methods */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "+5 AGCc", desc: "Per Nomination" },
                    { label: "+1 AGCc", desc: "Daily Sign-in" },
                    { label: "+15 AGC", desc: "First Referral" },
                    { label: "+5 AGC", desc: "Second Referral" },
                  ].map((method) => (
                    <div key={method.label} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                      <p className="text-amber-400 font-bold text-lg">{method.label}</p>
                      <p className="text-white/60 text-sm">{method.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Strip */}
        <section className="border-t border-white/10 bg-charcoal py-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-6 text-center md:grid-cols-4">
              {[
                { phase: "Nominations", date: "Now Open", status: "active" },
                { phase: "Voting Opens", date: "Apr 10, 2026", status: "upcoming" },
                { phase: "Voting Closes", date: "May 16, 2026", status: "upcoming" },
                { phase: "Winners", date: "May 17, 2026", status: "upcoming" },
              ].map((step) => (
                <div key={step.phase} className={step.status === 'active' ? '' : 'opacity-60'}>
                  <div className={`h-2 w-2 mx-auto rounded-full mb-2 ${step.status === 'active' ? 'bg-amber-400' : 'bg-white/30'}`} />
                  <div className="text-xs uppercase tracking-wider text-white/50">{step.phase}</div>
                  <div className={`mt-1 font-semibold ${step.status === 'active' ? 'text-amber-400' : 'text-white'}`}>{step.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Key Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-amber-500/20 bg-amber-500/5 text-center h-full hover:border-amber-500/40 transition-colors">
                    <CardHeader>
                      <feature.icon className="mx-auto mb-2 h-8 w-8 text-amber-400" />
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/60">{feature.description}</CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Regions */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center font-display text-3xl font-bold text-white">
              Region-First Approach
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-white/60">
              Winners are selected at regional level first, ensuring fair representation across the continent.
            </p>
            <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-5">
              {regions.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-center hover:border-amber-500/50 transition-colors"
                >
                  <p className="text-amber-400 font-semibold text-sm">{region.name}</p>
                  <p className="text-white/50 text-xs mt-1">{region.countries}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              How It Works
            </h2>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
              {[
                { step: 1, title: "Nomination", desc: "Submit or receive nomination with evidence", icon: Award },
                { step: 2, title: "NRC Review", desc: "Validation by Nominee Research Corps", icon: Check },
                { step: 3, title: "Public Voting", desc: "Vote with AGC during official window", icon: Vote },
                { step: 4, title: "Gold Winner", desc: "Top vote-getter wins Gold Certificate", icon: Trophy },
              ].map((s, index) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/20 text-xl font-bold text-amber-400">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className="text-amber-400 text-xs font-medium mb-1">Step {s.step}</div>
                  <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TV Show Section */}
        {goldTVShow && <AwardTVShowSection show={goldTVShow} accentColor="gold" />}

        {/* Award Categories - 9 Gold categories with 135 subcategories, Top 3 winners each = 405 */}
        <AwardCategoriesGrid 
          tier="gold"
          accentColor="amber"
          title="Gold Certificate Categories"
          description="9 major categories with 135 subcategories — Top 3 highest-voted nominees per subcategory win Gold Certificates (405 total winners), all competing for the 9 Blue Garnet Awards."
        />

        {/* Certificate Gallery */}
        <CertificateGallery />

        {/* CTA */}
        <section className="bg-gradient-to-b from-charcoal to-amber-900/20 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">100% Public Voting</span>
            </div>
            <h2 className="mb-4 font-display text-3xl md:text-4xl font-bold text-white">
              Ready to Compete for Gold?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Nominate Africa's education champions or earn AGC to vote during the official window.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-charcoal font-semibold rounded-full gap-2">
                <Link to="/nominate">
                  <Award className="h-4 w-4" />
                  Submit Nomination
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                <Link to="/earn-voting-credits">
                  <Coins className="h-4 w-4" />
                  Earn Voting Credits
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full gap-2">
                <Link to="/vote">
                  <Vote className="h-4 w-4" />
                  Vote Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
