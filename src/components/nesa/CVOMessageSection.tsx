import { Quote, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import cvoImage from "@/assets/cvo-santos.png";

export function CVOMessageSection() {
  return (
    <section className="bg-charcoal-light py-16 md:py-20">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
            {/* CVO Portrait */}
            <div className="md:col-span-2 flex justify-center">
              <div className="relative">
                {/* Decorative Border */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-gold/30 via-gold/10 to-transparent blur-sm" />
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-gold/40 shadow-gold">
                  <img
                    src={cvoImage}
                    alt="Chief Visionary Officer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gold text-charcoal text-xs font-semibold rounded-full whitespace-nowrap">
                  Chief Visionary Officer
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="md:col-span-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
                <MessageSquare className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-gold">Message from the CVO</span>
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-gold/20" />
                <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed pl-6 md:pl-8">
                  Welcome to NESA-Africa 2025—New Education Standard Award Africa, a pan-African 
                  celebration of educational transformation, social impact, and legacy. Together, 
                  we honor those who dare to reimagine education and inspire generations.
                </blockquote>
              </div>

              <div className="mt-6 pt-6 border-t border-gold/20">
                <p className="text-gold font-display text-lg font-semibold">
                  Santos Akhilele Okungbowa
                </p>
                <p className="text-white/60 text-sm">
                  Founder & Chief Visionary Officer, SCEF
                </p>
              </div>

              <Button
                variant="outline"
                className="mt-6 border-gold/40 text-gold hover:bg-gold/10 rounded-full"
              >
                Learn About Our Vision
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
