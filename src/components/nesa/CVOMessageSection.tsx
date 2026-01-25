import { Quote, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import cvoImage from "@/assets/cvo-santos.png";

export function CVOMessageSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold/3 to-transparent rounded-full" />
      
      <div className="container relative">
        {/* Section Label */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-semibold tracking-wider text-gold uppercase">A Message from Our Visionary</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* CVO Portrait - Premium Card */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-gold/30 via-gold/10 to-gold/30 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Portrait container */}
                <div className="relative bg-gradient-to-br from-charcoal-light to-charcoal p-1.5 rounded-2xl border border-gold/30">
                  <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-xl overflow-hidden">
                    <img
                      src={cvoImage}
                      alt="Babashola-Santos V. Aderibigbe - Chief Visionary Officer"
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />
                    
                    {/* Name card overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                      <h3 className="font-display text-xl font-bold text-white mb-1">
                        Babashola-Santos V. Aderibigbe
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/90 text-charcoal text-xs font-bold tracking-wide">
                        <span>Chief Visionary Officer</span>
                      </div>
                      <p className="text-white/60 text-sm mt-2">
                        Founder, SCEF
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corner accents */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold/50 rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold/50 rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold/50 rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold/50 rounded-br-lg" />
              </div>
            </div>

            {/* Message Content */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <div className="relative">
                {/* Large decorative quote */}
                <Quote className="absolute -top-6 -left-4 lg:-left-8 h-16 w-16 text-gold/10" />
                
                <blockquote className="relative z-10 text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed font-light">
                  <span className="text-gold font-display font-semibold">"</span>
                  Welcome to NESA-Africa 2025—a pan-African celebration of{" "}
                  <span className="text-gold font-medium">educational transformation</span>,{" "}
                  <span className="text-gold font-medium">social impact</span>, and{" "}
                  <span className="text-gold font-medium">legacy</span>. Together, we honor 
                  those who dare to reimagine education and inspire generations.
                  <span className="text-gold font-display font-semibold">"</span>
                </blockquote>
                
                <Quote className="absolute -bottom-4 right-0 lg:-right-4 h-12 w-12 text-gold/10 rotate-180" />
              </div>

              {/* Signature line */}
              <div className="mt-8 pt-6 border-t border-gold/20">
                <p className="text-white/50 text-sm mb-4 italic">
                  Championing Africa's educational renaissance since 2020
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mt-6">
                <Button
                  asChild
                  className="bg-gold text-charcoal hover:bg-gold-light font-semibold px-6 gap-2 group"
                >
                  <Link to="/about/vision-2035">
                    Explore Vision 2035
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 px-6"
                >
                  <Link to="/about/scef">
                    About SCEF
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
