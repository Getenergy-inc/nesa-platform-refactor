import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Handshake,
  Building2,
  GraduationCap,
  HeartHandshake,
  Newspaper,
  Landmark,
  Globe2,
  Sparkles,
  Quote,
  ArrowRight,
} from "lucide-react";

type SponsorGroup = {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
  examples: string[];
};

const groups: SponsorGroup[] = [
  { key: "strategic", title: "Strategic Partners", icon: Handshake, blurb: "Long-term anchors shaping NESA Africa's continental mandate.", examples: ["AUDA-NEPAD", "African Union CIEFFA", "ECOWAS Education"] },
  { key: "corporate", title: "Corporate Sponsors", icon: Building2, blurb: "Brands underwriting awards, ceremonies, and laureate scholarships.", examples: ["MTN Foundation", "Dangote Foundation", "Access Bank"] },
  { key: "education", title: "Education Partners", icon: GraduationCap, blurb: "Universities, EdTechs and academies advancing learning innovation.", examples: ["uLesson", "ALU", "Andela Learning"] },
  { key: "ngo", title: "NGO Partners", icon: HeartHandshake, blurb: "Grassroots and pan-African NGOs delivering impact at scale.", examples: ["LEAP Africa", "ActionAid", "Plan International"] },
  { key: "media", title: "Media Partners", icon: Newspaper, blurb: "Continental and diaspora media amplifying education stories.", examples: ["Channels TV", "TRT Afrika", "AllAfrica"] },
  { key: "government", title: "Government & Institutional", icon: Landmark, blurb: "Ministries and public institutions backing reform recognition.", examples: ["Ministries of Education", "UBEC", "TETFund"] },
  { key: "global", title: "Global Development Partners", icon: Globe2, blurb: "Multilateral and bilateral partners aligned with SDG 4.", examples: ["UNESCO", "UNICEF", "Mastercard Foundation"] },
];

const benefits = [
  "Pan-African brand visibility across 54 countries",
  "Co-branding on certificates, ceremony, and digital channels",
  "Speaking slots at the NESA Africa Gala & forums",
  "Sponsored AGC reward campaigns to engage 1M+ voters",
  "Direct access to laureates, NGOs and ministries",
  "Annual Education Impact Report co-authorship",
];

const packages = [
  { name: "Platinum Anchor", price: "From $250,000", perks: ["Title rights", "Plenary stage", "Bespoke laureate program", "Global PR push"] },
  { name: "Gold Champion", price: "From $100,000", perks: ["Category sponsorship", "Co-branded campaign", "VIP gala table", "Annual report feature"] },
  { name: "Silver Ally", price: "From $40,000", perks: ["Regional spotlight", "Digital ad placements", "5 gala invitations", "Press kit inclusion"] },
  { name: "Community Partner", price: "From $10,000", perks: ["Logo wall placement", "Newsletter feature", "2 gala invitations", "Impact certificate"] },
];

const metrics = [
  { value: "54", label: "African countries reached" },
  { value: "1M+", label: "Voters engaged annually" },
  { value: "12K+", label: "Nominations evaluated" },
  { value: "200+", label: "Institutional partners" },
];

const testimonials = [
  { quote: "Partnering with NESA Africa amplified our education programs across West Africa with unmatched continental credibility.", author: "Chief Sustainability Officer", org: "Pan-African Bank" },
  { quote: "The transparency of the judging process and the calibre of laureates is exactly what continental philanthropy needs.", author: "Programs Director", org: "Global Foundation" },
];

export default function SponsorsHub() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Partners & Sponsors | NESA Africa</title>
        <meta
          name="description"
          content="Discover NESA Africa's strategic partners, corporate sponsors, NGO allies, media partners and global development partners powering education impact across Africa."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/sponsors" />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden bg-charcoal text-gold">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(42_85%_52%/0.18),_transparent_60%)]" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="bg-gold/15 text-gold border border-gold/40 mb-5">Partners & Sponsors</Badge>
            <h1 className="font-playfair text-4xl md:text-6xl leading-tight text-white">
              Partners & Sponsors Powering <span className="text-gold">Education Impact</span> Across Africa
            </h1>
            <p className="mt-5 text-white/80 text-lg max-w-2xl">
              NESA Africa collaborates with visionary organizations, institutions, foundations, and brands supporting education transformation across the continent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to="/contact?topic=sponsorship">Become a Sponsor</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/60 text-gold hover:bg-gold/10">
                <Link to="#packages">View Partnership Opportunities</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMPACT METRICS */}
      <section className="bg-charcoal/95 border-y border-gold/15">
        <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="font-playfair text-3xl md:text-4xl text-gold">{m.value}</div>
              <div className="text-white/70 text-sm mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SPONSOR CATEGORIES */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl text-foreground">A continental coalition</h2>
            <p className="text-muted-foreground mt-3">Seven partner tracks, one shared mission: recognise and resource the people transforming African education.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g, i) => {
              const Icon = g.icon;
              return (
                <motion.div
                  key={g.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card className="h-full border-gold/15 hover:border-gold/40 transition-colors group">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-lg bg-gold/15 text-gold flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-playfair text-xl text-foreground">{g.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{g.blurb}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {g.examples.map((e) => (
                          <span key={e} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                            {e}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LOGO WALL (animated grayscale → color) */}
      <section className="bg-muted/40 py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl md:text-3xl text-foreground">Featured Sponsor Logos</h2>
            <Badge variant="outline" className="border-gold/40 text-gold">Updated 2025</Badge>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/2] rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground grayscale hover:grayscale-0 hover:border-gold/50 transition-all hover:shadow-[0_0_20px_-6px_hsl(42_85%_52%/0.5)]"
              >
                <Sparkles className="w-5 h-5 mr-2 text-gold/70" />
                <span className="text-xs font-medium">Sponsor {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl text-foreground">Sponsorship Benefits</h2>
            <p className="text-muted-foreground mt-3">
              Every partner receives a tailored impact package combining brand reach, programmatic involvement and measurable education outcomes.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3 p-4 rounded-lg border border-gold/15 bg-card">
                <div className="w-7 h-7 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span className="text-sm text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="bg-charcoal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl text-gold">Sponsorship Packages</h2>
            <p className="text-white/70 mt-3">Choose a tier — or co-design a bespoke partnership with our team.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map((p) => (
              <Card key={p.name} className="bg-card/5 border border-gold/20 text-white">
                <CardContent className="p-6">
                  <div className="font-playfair text-xl text-gold">{p.name}</div>
                  <div className="text-white/80 text-sm mt-1">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-sm text-white/80">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex gap-2">
                        <span className="text-gold">•</span> {perk}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-5 w-full bg-gold text-charcoal hover:bg-gold/90">
                    <Link to="/contact?topic=sponsorship">Request Deck</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-8">What our partners say</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-gold/20">
                <CardContent className="p-6">
                  <Quote className="w-6 h-6 text-gold mb-3" />
                  <p className="text-foreground italic">"{t.quote}"</p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{t.author}</span> — {t.org}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-b from-charcoal to-black text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-playfair text-3xl md:text-5xl text-gold">Become a NESA Africa Sponsor</h2>
          <p className="text-white/80 mt-4">
            Join the coalition shaping the next decade of education across Africa. Our partnerships team will craft a package aligned to your impact goals.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/contact?topic=sponsorship">Become a Sponsor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/60 text-gold hover:bg-gold/10">
              <Link to="/about">Learn About NESA Africa</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-12">
        <div className="container mx-auto px-4">
          <ExploreNomineesCTA
            title="See the nominees your sponsorship empowers"
            description="Explore approved education changemakers across every region and category — the impact you can amplify."
          />
        </div>
      </section>
    </PublicLayout>
  );
}
