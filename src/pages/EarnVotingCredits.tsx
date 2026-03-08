import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  Calendar, 
  Vote, 
  Users, 
  Award, 
  ShoppingBag, 
  Ticket,
  Wallet,
  Check,
  Loader2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { EARN_METHODS, AGC_NON_TRADEABLE_DISCLAIMER, VOTING_SERVICES } from "@/constants/agc";
import { AgcDisclosure } from "@/components/tickets/AgcDisclosure";

const ICON_MAP: Record<string, typeof Gift> = {
  Gift,
  Calendar,
  Vote,
  Users,
  Award,
  ShoppingBag,
  Ticket,
};

export default function EarnVotingCredits() {
  const { user } = useAuth();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const handleAction = async (action: string) => {
    if (!user) {
      toast.error("Please sign in to earn credits");
      return;
    }

    setLoadingAction(action);
    
    // Mock API calls - in production these would hit real endpoints
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    switch (action) {
      case "claim-welcome":
        toast.success("Welcome Afrigold Points claimed!", {
          description: "+10 AGC added to your wallet. Use your points to vote for African education changemakers.",
        });
        break;
      case "check-in":
        toast.success("Daily Engagement Recorded!", {
          description: "+1 AGC credited. Return daily to earn more voting points.",
        });
        break;
      case "polls":
        toast("Opening polls...", { description: "No active polls at the moment. Check back soon!" });
        break;
      case "invite":
        toast.success("Referral link ready!", {
          description: "Share your link to earn Afrigold Points when friends join.",
        });
        break;
      default:
        toast.info("Action completed");
    }
    
    setCompletedActions([...completedActions, action]);
    setLoadingAction(null);
  };

  return (
    <>
      <Helmet>
        <title>Earn Voting Credits (AGC) | NESA-Africa</title>
        <meta
          name="description"
          content="Earn Afri-Gold Coins (AGC) voting credits through various activities on NESA-Africa platform."
        />
      </Helmet>

      <main className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(196,160,82,0.15),transparent_50%)]" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Sparkles className="mr-2 h-3 w-3" />
                Voting Credits
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Earn <span className="text-gold">AGC Voting Credits</span>
              </h1>
              <p className="text-white/70 text-lg mb-6">
                Participate in activities to earn Afri-Gold Coins (AGC) for voting across SCEF services.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/wallet">
                    <Wallet className="mr-2 h-4 w-4" />
                    View My Balance
                  </Link>
                </Button>
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                  <Link to="/vote">
                    <Vote className="mr-2 h-4 w-4" />
                    Go to Voting
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          {/* Where AGC is used */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-center mb-6">
              Where AGC is Used for Voting
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {VOTING_SERVICES.map((service, i) => (
                <Card key={i} className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <Vote className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Earning Methods */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              Ways to Earn AGC
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {EARN_METHODS.map((method, index) => {
                const Icon = ICON_MAP[method.icon] || Gift;
                const isCompleted = completedActions.includes(method.action);
                const isLoading = loadingAction === method.action;
                const isActionable = ["claim-welcome", "check-in", "polls", "invite"].includes(method.action);

                return (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={isCompleted ? "border-success/30 bg-success/5" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge variant="secondary" className="text-gold bg-gold/10">
                            +{method.agcReward} {method.agcReward >= 1 ? "AGC" : "AGCc"}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mt-3">{method.title}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isActionable ? (
                          <Button
                            onClick={() => handleAction(method.action)}
                            disabled={isLoading || isCompleted}
                            className="w-full"
                            variant={isCompleted ? "secondary" : "default"}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : isCompleted ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Completed
                              </>
                            ) : (
                              <>
                                Claim Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button asChild className="w-full">
                            <Link to={method.action === "nominate" ? "/nominate" : method.action === "shop" ? "/shop" : "/buy-your-ticket"}>
                              Get Started
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="max-w-2xl mx-auto">
            <AgcDisclosure variant="banner" />
          </section>
        </div>
      </main>
    </>
  );
}
