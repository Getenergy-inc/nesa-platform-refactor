import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gavel, 
  ArrowLeft,
  Shield,
  AlertTriangle,
  Loader2,
  Calendar
} from "lucide-react";
import { useJuryCOI } from "@/hooks/useJuryData";
import { format } from "date-fns";

export default function JuryCOI() {
  const { user, roles, loading: authLoading } = useAuth();
  const { data: declarations, isLoading } = useJuryCOI();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent("/judge/coi")}`} replace />;
  }

  const isJudge = roles.includes("jury") || roles.includes("admin");
  if (!isJudge) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Helmet>
        <title>COI Declarations | Judges Arena</title>
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <header className="bg-charcoal border-b border-gold/20">
          <div className="container py-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
                <Link to="/judge/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-white">COI Declarations</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Conflict of Interest Declarations</h1>
              <p className="text-white/60">
                Review your declared conflicts of interest. These nominees have been removed from your scoring queue.
              </p>
            </div>

            {isLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" />
              </div>
            ) : declarations?.length === 0 ? (
              <Card className="border-white/10 bg-white/5">
                <CardContent className="py-12 text-center">
                  <Shield className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No COI Declarations</h3>
                  <p className="text-white/60">
                    You haven't declared any conflicts of interest yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {declarations?.map((coi) => (
                  <Card key={coi.id} className="border-orange-500/20 bg-orange-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-semibold text-white">
                                {coi.nominee?.name || 'Unknown Nominee'}
                              </h4>
                              <p className="text-sm text-white/60">
                                Nominee ID: {coi.nominee?.slug || coi.nominee_id}
                              </p>
                            </div>
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              Recused
                            </Badge>
                          </div>
                          <div className="bg-charcoal/50 rounded-lg p-3 mb-2">
                            <p className="text-sm text-white/80">{coi.reason}</p>
                          </div>
                          <div className="flex items-center text-xs text-white/40">
                            <Calendar className="h-3 w-3 mr-1" />
                            Declared on {coi.declared_at ? format(new Date(coi.declared_at), 'MMM d, yyyy') : 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
