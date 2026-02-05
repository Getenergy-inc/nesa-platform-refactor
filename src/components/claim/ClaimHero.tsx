import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TicketCheck, Wallet, Sparkles, Coins } from "lucide-react";

export function ClaimHero() {
  return (
    <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(196,160,82,0.1),transparent_40%)]" />
        
        {/* Floating coins animation */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Coins className="h-6 w-6 text-gold/30" />
          </motion.div>
        ))}
      </div>
      
      <div className="container relative">
        <motion.div 
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Badge className="mb-6 px-4 py-2 bg-gold/20 text-gold border-gold/40 text-sm font-medium">
              <TicketCheck className="mr-2 h-4 w-4" />
              Sponsor Credits
            </Badge>
          </motion.div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Claim Your{" "}
            <span className="relative">
              <span className="text-gold">Voting Credits</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </h1>
          
          <p className="text-white/70 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Redeem voucher codes, scan QR codes at events, or claim from sponsor-funded public pools to power your votes.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all"
            >
              <Link to="/wallet">
                <Wallet className="mr-2 h-5 w-5" />
                View My Balance
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-charcoal font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <Link to="/earn-voting-credits">
                <Sparkles className="mr-2 h-5 w-5" />
                Earn More AGC
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
