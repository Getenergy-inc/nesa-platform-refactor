import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, ArrowRight, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type NominationType = "new" | "platinum" | null;

export function CampaignBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<NominationType>(null);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (selectedType) {
      const queryParam = selectedType === "platinum" ? "?type=platinum" : "?type=new";
      navigate(`/nominate${queryParam}`);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-charcoal via-charcoal-dark to-charcoal">
        {/* Background accent */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
        </div>
        
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <Award className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold">2025 Season Open</span>
            </div>
            
            {/* Headline */}
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              NESA-Africa 2025 –{" "}
              <span className="text-gold">Now Accepting Nominations</span>
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-3xl mx-auto leading-relaxed">
              New nominations and <span className="text-gold font-semibold">Platinum re-nominations</span> across all 17 categories are now open.
            </p>
            
            {/* Platinum highlight */}
            <div className="inline-flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-8 text-left max-w-2xl">
              <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-white/70 text-sm md:text-base">
                The <span className="text-white font-medium">Africa Education for All Platinum Certificate</span> recognises verified, scalable, and equitable impact in education across Africa.
              </p>
            </div>
            
            {/* CTA */}
            <Button 
              size="lg" 
              onClick={() => setIsModalOpen(true)}
              className="bg-gold hover:bg-gold-dark text-charcoal font-bold text-lg px-10 py-6 rounded-full shadow-gold group"
            >
              <Award className="h-5 w-5 mr-2" />
              NOMINATE NOW
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Nomination Type Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-charcoal border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-white text-center">
              Before You Proceed
            </DialogTitle>
            <DialogDescription className="text-white/70 text-center pt-2">
              Are you submitting a new nomination or upgrading an existing one for Platinum consideration?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-6">
            {/* New Nomination Option */}
            <button
              onClick={() => setSelectedType("new")}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                selectedType === "new"
                  ? "border-gold bg-gold/10"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              <div className={`p-2 rounded-lg ${selectedType === "new" ? "bg-gold/20" : "bg-white/10"}`}>
                <Sparkles className={`h-5 w-5 ${selectedType === "new" ? "text-gold" : "text-white/60"}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${selectedType === "new" ? "text-gold" : "text-white"}`}>
                  New Nomination
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Submit a first-time nomination for recognition
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedType === "new" ? "border-gold" : "border-white/30"
              }`}>
                {selectedType === "new" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                )}
              </div>
            </button>

            {/* Platinum Re-Nomination Option */}
            <button
              onClick={() => setSelectedType("platinum")}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                selectedType === "platinum"
                  ? "border-gold bg-gold/10"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              <div className={`p-2 rounded-lg ${selectedType === "platinum" ? "bg-gold/20" : "bg-white/10"}`}>
                <RefreshCw className={`h-5 w-5 ${selectedType === "platinum" ? "text-gold" : "text-white/60"}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${selectedType === "platinum" ? "text-gold" : "text-white"}`}>
                  Platinum Re-Nomination
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Upgrade an existing nominee across all 17 categories
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedType === "platinum" ? "border-gold" : "border-white/30"
              }`}>
                {selectedType === "platinum" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                )}
              </div>
            </button>
          </div>

          {/* Info note */}
          <p className="text-xs text-white/50 text-center pb-2">
            Both options are reviewed using the same Platinum impact standards.
          </p>

          {/* Proceed Button */}
          <Button
            onClick={handleProceed}
            disabled={!selectedType}
            className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold py-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
