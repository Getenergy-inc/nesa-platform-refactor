import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Sparkles } from "lucide-react";

interface PublicPool {
  id: string;
  name: string;
  sponsor: string;
  available_agc: number;
  expires_at: string;
}

interface PublicPoolItemProps {
  pool: PublicPool;
  onClaim: (poolId: string) => void;
  index: number;
}

export function PublicPoolItem({ pool, onClaim, index }: PublicPoolItemProps) {
  const isLowSupply = pool.available_agc < 50;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative p-4 rounded-xl border-2 border-gold/20 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 hover:border-gold/40 hover:shadow-lg transition-all duration-300"
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12" />
      
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-gold shrink-0" />
            <p className="font-semibold truncate">{pool.name}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Sponsored by <span className="text-foreground font-medium">{pool.sponsor}</span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="secondary" 
              className={isLowSupply 
                ? "bg-destructive/10 text-destructive border-destructive/20" 
                : "bg-gold/10 text-gold border-gold/20"
              }
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {pool.available_agc} AGC available
            </Badge>
            {isLowSupply && (
              <span className="text-xs text-destructive font-medium animate-pulse">
                Running low!
              </span>
            )}
          </div>
        </div>
        
        <Button 
          size="sm"
          onClick={() => onClaim(pool.id)}
          disabled={pool.available_agc < 10}
          className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-charcoal font-semibold shadow-lg hover:shadow-xl transition-all duration-300 shrink-0"
        >
          Claim 10 AGC
        </Button>
      </div>
    </motion.div>
  );
}
