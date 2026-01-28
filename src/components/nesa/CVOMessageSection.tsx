import { Quote, Sparkles, ArrowRight, Target, Globe2, GraduationCap, Users, BookOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import cvoImage from "@/assets/cvo-santos.png";

const sdg4Goals = [
  { icon: GraduationCap, label: "Quality Education", description: "Ensure inclusive and equitable quality education" },
  { icon: Users, label: "Lifelong Learning", description: "Promote lifelong learning opportunities for all" },
  { icon: BookOpen, label: "Universal Access", description: "Free primary and secondary education by 2030" },
];

const au2063Aspirations = [
  { icon: Lightbulb, label: "Knowledge Economy", description: "Well-educated citizens and skills revolution" },
  { icon: Globe2, label: "Pan-African Unity", description: "United Africa with shared prosperity" },
  { icon: Target, label: "Africa We Want", description: "Transformed continent by 2063" },
];

export function CVOMessageSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold/3 to-transparent rounded-full" />
      
      {/* SDG 4 & AU 2063 accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5192D] to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#006B3F] to-transparent opacity-50" />
      
      <div className="container relative">
        {/* Section Label */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-semibold tracking-wider text-gold uppercase">A Message from Our Visionary</span>
          </div>
          <Badge variant="outline" className="border-[#C5192D]/50 text-[#C5192D] bg-[#C5192D]/10 px-3 py-1.5">
            SDG 4 Aligned
          </Badge>
          <Badge variant="outline" className="border-[#006B3F]/50 text-[#006B3F] bg-[#006B3F]/10 px-3 py-1.5">
            AU 2063 Aligned
          </Badge>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center mb-16">
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
                  <span className="text-gold font-medium">legacy</span>. Together, aligned with{" "}
                  <span className="text-[#C5192D] font-medium">SDG 4</span> and{" "}
                  <span className="text-[#006B3F] font-medium">AU Agenda 2063</span>, we honor 
                  those who dare to reimagine education and inspire generations across Africa.
                  <span className="text-gold font-display font-semibold">"</span>
                </blockquote>
                
                <Quote className="absolute -bottom-4 right-0 lg:-right-4 h-12 w-12 text-gold/10 rotate-180" />
              </div>

              {/* Signature line */}
              <div className="mt-8 pt-6 border-t border-gold/20">
                <p className="text-white/50 text-sm mb-4 italic">
                  Championing Africa's educational renaissance since 2020 — Aligned with global and continental development agendas
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

          {/* SDG 4 & AU 2063 Alignment Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {/* SDG 4 Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5192D]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-charcoal-light/80 to-charcoal/80 backdrop-blur-sm rounded-2xl border border-[#C5192D]/30 p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-[#C5192D] flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">SDG 4</h3>
                    <p className="text-[#C5192D] text-sm font-medium">Quality Education</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  NESA-Africa is committed to the United Nations Sustainable Development Goal 4, 
                  ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all Africans.
                </p>
                <div className="space-y-4">
                  {sdg4Goals.map((goal, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#C5192D]/20 flex items-center justify-center flex-shrink-0">
                        <goal.icon className="h-4 w-4 text-[#C5192D]" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{goal.label}</h4>
                        <p className="text-white/50 text-xs">{goal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-6 border-[#C5192D]/40 text-[#C5192D] hover:bg-[#C5192D]/10"
                >
                  <a href="https://sdgs.un.org/goals/goal4" target="_blank" rel="noopener noreferrer">
                    Learn about SDG 4
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            {/* AU 2063 Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#006B3F]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-charcoal-light/80 to-charcoal/80 backdrop-blur-sm rounded-2xl border border-[#006B3F]/30 p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-[#006B3F] flex items-center justify-center">
                    <Globe2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">AU Agenda 2063</h3>
                    <p className="text-[#006B3F] text-sm font-medium">The Africa We Want</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  Aligned with the African Union's Agenda 2063, we champion a prosperous Africa based on inclusive growth 
                  and sustainable development, with well-educated citizens driving the continent's transformation.
                </p>
                <div className="space-y-4">
                  {au2063Aspirations.map((aspiration, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#006B3F]/20 flex items-center justify-center flex-shrink-0">
                        <aspiration.icon className="h-4 w-4 text-[#006B3F]" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{aspiration.label}</h4>
                        <p className="text-white/50 text-xs">{aspiration.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-6 border-[#006B3F]/40 text-[#006B3F] hover:bg-[#006B3F]/10"
                >
                  <a href="https://au.int/en/agenda2063/overview" target="_blank" rel="noopener noreferrer">
                    Learn about AU 2063
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
