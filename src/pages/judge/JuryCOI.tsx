import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Loader2, Calendar } from "lucide-react";
import { useJuryCOI } from "@/hooks/useJuryData";
import { format } from "date-fns";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";

export default function JuryCOI() {
  const { data: declarations, isLoading } = useJuryCOI();

  return (
    <>
      <Helmet>
        <title>COI Declarations | Judges Arena</title>
      </Helmet>

      <JudgesArenaLayout title="COI Declarations" description="Your conflict of interest records">
        <div className="p-6 max-w-3xl mx-auto">
          <div className="mb-6">
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
                <p className="text-white/60">You haven't declared any conflicts of interest yet.</p>
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
                            <h4 className="font-semibold text-white">{coi.nominee?.name || 'Unknown Nominee'}</h4>
                            <p className="text-sm text-white/60">Nominee ID: {coi.nominee?.slug || coi.nominee_id}</p>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Recused</Badge>
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
      </JudgesArenaLayout>
    </>
  );
}
