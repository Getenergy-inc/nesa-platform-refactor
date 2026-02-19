import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { assignednominationsResponse, nominationApi } from "@/api/nomination";
import { useAuth } from "@/contexts/AuthContext";
import { Users, FileText, Loader2 } from "lucide-react";

export function AssignedNominationsSection() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: assigned, isLoading } = useQuery({
    queryKey: ["assigned-nominations"],
    queryFn: async () => {
      const res = await nominationApi.fetchAssignedNominations(accessToken);
      return res;
    },
  });

  const removeReviewer = async (nominationId: string, reviewerId: string) => {
    await supabase.rpc("update_nomination_reviewers", {
      nominationId,
      reviewerId,
      action: "remove",
    });

    toast.success("Reviewer removed");
    queryClient.invalidateQueries({
      queryKey: ["assigned-nominations"],
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-primary" />
          Assigned Nominations
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!assigned || assigned.length === 0) && (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-3">
            <Users className="h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium">No Assigned Nominations</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              You currently don’t have any nominations assigned for review. Once
              assignments are made, they will appear here.
            </p>
          </div>
        )}

        {/* Assigned Nominations */}
        {assigned?.map((nom: assignednominationsResponse) => (
          <div
            key={nom.nominationId}
            className="rounded-xl border bg-background p-5 space-y-5 transition hover:shadow-md"
          >
            {/* Nomination Info */}
            <div className="space-y-1">
              <p className="text-lg font-semibold">{nom.fullName}</p>
              <p className="text-sm text-muted-foreground">
                Priority: <span className="font-medium">{nom.priority}</span> •
                Due:{" "}
                <span className="font-medium">
                  {new Date(nom.dueDate).toLocaleDateString()}
                </span>
              </p>
              {nom.notes && (
                <p className="text-sm italic text-muted-foreground mt-2">
                  {nom.notes}
                </p>
              )}
            </div>

            {/* Reviewers Section */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">
                  Currently Assigned Reviewers
                </p>
                <p className="text-xs text-muted-foreground">
                  These reviewers are responsible for evaluating this
                  nomination.
                </p>
              </div>

              {nom.assignedTo.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  No reviewers assigned yet.
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {nom.assignedTo.map((r: any) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-3 rounded-full border px-4 py-2 bg-muted/40"
                    >
                      <span className="text-sm font-medium">{r.name}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => removeReviewer(nom.nominationId, r.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
