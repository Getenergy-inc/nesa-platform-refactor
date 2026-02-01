import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  QrCode, 
  Wallet,
  Vote,
  Check,
  Loader2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  TicketCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CLAIM_SOURCES, AGC_NON_TRADEABLE_DISCLAIMER } from "@/constants/agc";
import { AgcDisclosure } from "@/components/tickets/AgcDisclosure";

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
    
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate validation
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
    
    // In production, this would open camera/scanner
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.info("QR scanning coming soon!", {
      description: "Visit our event booth to scan sponsor QR codes."
    });
    
    setIsClaimingQR(false);
  };

  const checkPublicPools = async () => {
    setIsLoadingPools(true);
    
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock data - in production this would come from API
    const mockPools: PublicPool[] = [
      {
        id: "pool-1",
        name: "Education Champions Pool",
        sponsor: "SCEF Foundation",
        available_agc: 1000,
        expires_at: "2026-06-30",
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
    
    // Update pool availability
    setPublicPools(pools => 
      pools.map(p => 
        p.id === poolId ? { ...p, available_agc: p.available_agc - 10 } : p
      )
    );
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>Claim Sponsor Voting Credits | NESA-Africa</title>
        <meta
          name="description"
          content="Claim AGC voting credits from sponsors, vouchers, and public pools on NESA-Africa."
        />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.15),transparent_50%)]" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <TicketCheck className="mr-2 h-3 w-3" />
                Sponsor Credits
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Claim <span className="text-gold">Voting Credits</span>
              </h1>
              <p className="text-white/70 text-lg mb-6">
                Redeem voucher codes, scan QR codes, or claim from sponsor-funded public pools.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/wallet">
                    <Wallet className="mr-2 h-4 w-4" />
                    View My Balance
                  </Link>
                </Button>
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                  <Link to="/earn-voting-credits">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Earn More AGC
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Voucher Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{CLAIM_SOURCES.voucher.title}</CardTitle>
                      <CardDescription>{CLAIM_SOURCES.voucher.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVoucherClaim} className="flex gap-2">
                    <Input
                      placeholder="Enter voucher code (e.g., NESA2026)"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      className="font-mono"
                      disabled={isClaimingVoucher}
                    />
                    <Button type="submit" disabled={isClaimingVoucher || !voucherCode.trim()}>
                      {isClaimingVoucher ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Claim
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* QR Code Scan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <QrCode className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{CLAIM_SOURCES.qr.title}</CardTitle>
                      <CardDescription>{CLAIM_SOURCES.qr.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleQRClaim} 
                    disabled={isClaimingQR}
                    className="w-full"
                    variant="outline"
                  >
                    {isClaimingQR ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <QrCode className="mr-2 h-4 w-4" />
                    )}
                    Open QR Scanner
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Public Pools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gold/10">
                      <Vote className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <CardTitle>{CLAIM_SOURCES.publicPool.title}</CardTitle>
                      <CardDescription>{CLAIM_SOURCES.publicPool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!hasCheckedPools ? (
                    <Button 
                      onClick={checkPublicPools} 
                      disabled={isLoadingPools}
                      className="w-full"
                    >
                      {isLoadingPools ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Check Available Pools
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : publicPools.length === 0 ? (
                    <div className="flex flex-col items-center py-6 text-center">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No public pools available at the moment.</p>
                      <p className="text-sm text-muted-foreground mt-1">Check back later or earn AGC through other methods.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {publicPools.map((pool) => (
                        <div 
                          key={pool.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                        >
                          <div>
                            <p className="font-medium">{pool.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Sponsored by {pool.sponsor}
                            </p>
                            <Badge variant="secondary" className="mt-1">
                              {pool.available_agc} AGC available
                            </Badge>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => claimFromPool(pool.id)}
                            disabled={pool.available_agc < 10}
                          >
                            Claim 10 AGC
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Disclaimer */}
            <AgcDisclosure variant="banner" />

            {/* Navigation */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild variant="outline">
                <Link to="/earn-voting-credits">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Earn More Credits
                </Link>
              </Button>
              <Button asChild>
                <Link to="/vote">
                  <Vote className="mr-2 h-4 w-4" />
                  Start Voting
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
