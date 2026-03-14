import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Gift, 
  QrCode, 
  Vote,
  Loader2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CLAIM_SOURCES } from "@/constants/agc";
import { AgcDisclosure } from "@/components/tickets/AgcDisclosure";
import { ClaimHero } from "@/components/claim/ClaimHero";
import { ClaimMethodCard } from "@/components/claim/ClaimMethodCard";
import { PublicPoolItem } from "@/components/claim/PublicPoolItem";

interface PublicPool {
  id: string;
  name: string;
  sponsor: string;
  available_agc: number;
  expires_at: string;
}

export default function ClaimVotingCredits() {
  const { user } = useAuth();
  const [voucherCode, setVoucherCode] = useState("");
  const [isClaimingVoucher, setIsClaimingVoucher] = useState(false);
  const [isClaimingQR, setIsClaimingQR] = useState(false);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [publicPools, setPublicPools] = useState<PublicPool[]>([]);
  const [hasCheckedPools, setHasCheckedPools] = useState(false);

  const handleVoucherClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to claim credits");
      return;
    }

    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    setIsClaimingVoucher(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (voucherCode.toUpperCase().startsWith("NESA")) {
      toast.success("Voucher claimed! +50 AGC added to your wallet.");
      setVoucherCode("");
    } else {
      toast.error("Invalid or expired voucher code");
    }
    
    setIsClaimingVoucher(false);
  };

  const handleQRClaim = async () => {
    if (!user) {
      toast.error("Please sign in to claim credits");
      return;
    }

    setIsClaimingQR(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.info("QR scanning coming soon!", {
      description: "Visit our event booth to scan sponsor QR codes."
    });
    
    setIsClaimingQR(false);
  };

  const checkPublicPools = async () => {
    setIsLoadingPools(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockPools: PublicPool[] = [
      {
        id: "pool-1",
        name: "Education Champions Pool",
        sponsor: "SCEF Foundation",
        available_agc: 1000,
        expires_at: "2026-06-30",
      },
      {
        id: "pool-2",
        name: "Tech Innovators Fund",
        sponsor: "AfriTech Alliance",
        available_agc: 45,
        expires_at: "2026-05-15",
      },
    ];
    
    setPublicPools(mockPools);
    setHasCheckedPools(true);
    setIsLoadingPools(false);
  };

  const claimFromPool = async (poolId: string) => {
    if (!user) {
      toast.error("Please sign in to claim credits");
      return;
    }

    toast.success("Claimed 10 AGC from sponsor pool!", {
      description: "Credits added to your wallet for voting."
    });
    
    setPublicPools(pools => 
      pools.map(p => 
        p.id === poolId ? { ...p, available_agc: p.available_agc - 10 } : p
      )
    );
  };

  return (
    <>
      <Helmet>
        <title>Claim Sponsor Voting Credits | NESA-Africa</title>
        <meta
          name="description"
          content="Claim AGC voting credits from sponsors, vouchers, and public pools on NESA-Africa."
        />
      </Helmet>

      <main className="min-h-screen bg-charcoal">
        <ClaimHero />

        <div className="container py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Voucher Code */}
            <ClaimMethodCard
              icon={<Gift className="h-6 w-6" />}
              title={CLAIM_SOURCES.voucher.title}
              description={CLAIM_SOURCES.voucher.description}
              delay={0}
            >
              <form onSubmit={handleVoucherClaim} className="flex gap-3">
                <div className="relative flex-1">
                  <Input
                    placeholder="Enter voucher code (e.g., NESA2026)"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    className="font-mono text-lg h-12 pr-4 border-2 focus:border-primary transition-colors"
                    disabled={isClaimingVoucher}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isClaimingVoucher || !voucherCode.trim()}
                  size="lg"
                  className="h-12 px-6 font-semibold"
                >
                  {isClaimingVoucher ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Claim
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </ClaimMethodCard>

            {/* QR Code Scan */}
            <ClaimMethodCard
              icon={<QrCode className="h-6 w-6" />}
              title={CLAIM_SOURCES.qr.title}
              description={CLAIM_SOURCES.qr.description}
              delay={0.1}
            >
              <Button 
                onClick={handleQRClaim} 
                disabled={isClaimingQR}
                className="w-full h-12 text-base font-medium"
                variant="outline"
              >
                {isClaimingQR ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <QrCode className="mr-2 h-5 w-5" />
                )}
                Open QR Scanner
              </Button>
            </ClaimMethodCard>

            {/* Public Pools */}
            <ClaimMethodCard
              icon={<Vote className="h-6 w-6" />}
              title={CLAIM_SOURCES.publicPool.title}
              description={CLAIM_SOURCES.publicPool.description}
              variant="gold"
              delay={0.2}
            >
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {!hasCheckedPools ? (
                    <motion.div
                      key="check-button"
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Button 
                        onClick={checkPublicPools} 
                        disabled={isLoadingPools}
                        className="w-full h-12 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-charcoal font-semibold shadow-lg"
                      >
                        {isLoadingPools ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <Search className="mr-2 h-5 w-5" />
                        )}
                        {isLoadingPools ? "Searching..." : "Check Available Pools"}
                      </Button>
                    </motion.div>
                  ) : publicPools.length === 0 ? (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-8 text-center"
                    >
                      <div className="p-4 rounded-full bg-muted mb-4">
                        <AlertCircle className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">No public pools available at the moment.</p>
                      <p className="text-sm text-muted-foreground mt-1">Check back later or earn AGC through other methods.</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pools-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {publicPools.map((pool, index) => (
                        <PublicPoolItem
                          key={pool.id}
                          pool={pool}
                          onClaim={claimFromPool}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ClaimMethodCard>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <AgcDisclosure variant="banner" />
            </motion.div>

            {/* Navigation */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button asChild variant="outline" size="lg">
                <Link to="/earn-voting-credits">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Earn More Credits
                </Link>
              </Button>
              <Button asChild size="lg" className="shadow-lg">
                <Link to="/vote">
                  <Vote className="mr-2 h-5 w-5" />
                  Start Voting
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
