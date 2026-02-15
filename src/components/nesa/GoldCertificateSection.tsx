import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Vote, Users, ArrowRight, Trophy, Coins, Globe, Check } from "lucide-react";
import goldCertificateImage from "@/assets/certificates/gold-certificate-showcase.jpg";

export function GoldCertificateSection() {
  const features = [
    { icon: Vote, label: "100% Public Voting", description: "No jury influence — your votes decide winners" },
    { icon: Globe, label: "5 African Regions", description: "North, West, East, Central & Southern Africa" },
    { icon: Users, label: "Top 3 Per Subcategory", description: "405 Gold Certificate winners across 135 subcategories" },
    { icon: Trophy, label: "Feeds Blue Garnet", description: "All 405 Gold winners compete for the 9 Blue Garnet Awards" },
  ];

  return (
    <section className="relative bg-gradient-to-b from-charcoal via-charcoal-light/20 to-charcoal py-16 md:py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Africa's Public Choice Award</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Gold Certificate{" "}
              <span className="text-amber-400">Award</span>
            </h2>

            <p className="text-lg text-white/70 mb-6 leading-relaxed">
              The competitive stage of NESA recognition. Winners are determined entirely by{" "}
              <span className="text-amber-400 font-semibold">public votes</span> — your participation 
              decides who represents Africa's education excellence.
            </p>

            {/* AGC Integration Message */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Coins className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Vote with AGC Credits</p>
                  <p className="text-white/70 text-sm">
                    Earn voting points through participation. Use AGC to vote for Gold winners. 
                    <span className="text-amber-400"> 1 Vote = 1 AGC</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <feature.icon className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">{feature.label}</p>
                    <p className="text-white/50 text-xs">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link to="/awards/gold">
                <Button 
                  size="lg" 
                  className="bg-amber-500 hover:bg-amber-600 text-charcoal font-semibold rounded-full gap-2 shadow-lg"
                >
                  <Trophy className="h-4 w-4" />
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/vote?tier=gold">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 rounded-full gap-2"
                >
                  <Vote className="h-4 w-4" />
                  Vote for Gold
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Certificate Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/30 via-gold/20 to-amber-500/30 rounded-3xl blur-2xl opacity-60" />
              
              {/* Certificate Image */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-900/30">
                <img
                  src={goldCertificateImage}
                  alt="NESA Gold Certificate Award"
                  className="w-full h-auto"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                
                {/* Floating Info Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-charcoal/90 backdrop-blur-md border border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 font-display font-bold text-lg">Gold Certificate</p>
                      <p className="text-white/60 text-sm">100% Public Voting Winner</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">2026 Edition</p>
                      <p className="text-white/50 text-xs">Opens Apr 10</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -left-4 top-1/4 px-4 py-2 rounded-xl bg-charcoal/95 backdrop-blur-md border border-amber-500/40 shadow-xl hidden lg:block"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-amber-400" />
                  <div>
                    <p className="text-white font-bold text-sm">5 Regions</p>
                    <p className="text-white/50 text-xs">Continent-Wide</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -right-4 top-2/3 px-4 py-2 rounded-xl bg-charcoal/95 backdrop-blur-md border border-amber-500/40 shadow-xl hidden lg:block"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-400" />
                  <div>
                    <p className="text-white font-bold text-sm">135+</p>
                    <p className="text-white/50 text-xs">Subcategories</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Voting Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            {[
              { phase: "Nominations", date: "Now Open", active: true },
              { phase: "Voting Opens", date: "Apr 10, 2026", active: false },
              { phase: "Voting Closes", date: "May 16, 2026", active: false },
              { phase: "Winners", date: "May 17, 2026", active: false },
            ].map((step, index) => (
              <div key={step.phase} className="text-center">
                <div className={`h-2 w-2 mx-auto rounded-full mb-2 ${step.active ? 'bg-amber-400' : 'bg-white/20'}`} />
                <p className={`text-sm font-medium ${step.active ? 'text-amber-400' : 'text-white/50'}`}>
                  {step.phase}
                </p>
                <p className={`text-xs ${step.active ? 'text-white' : 'text-white/40'}`}>
                  {step.date}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
