import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { nominationApi } from "@/api/nomination";
import { useAuth } from "@/contexts/AuthContext";
import { nrcApi } from "@/api/newnrc";

interface TeamMember {
  id: string;
  user_id: string;
  profile: { full_name: string | null } | null;
}

export interface pendingNominationResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  country: string;
  stateRegion: string;
  impactSummary: string;
  achievementDescription: string;
  linkedInProfile: string | null;
  website: string | null;
  profileImage: string | null;
  evidenceUrl: string[];
  appproved: string;
  accepted: string;
  createdAt: Date;
  yearOfNomination: string;
  nominee: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  category: {
    id: string;
    title: string;
    description: string;
  };
  subCategory: {
    id: string;
    title: string;
    description: string;
  };
}

export function AssignNominationSection() {
  const queryClient = useQueryClient();

  const [selectedNomination, setSelectedNomination] =
    useState<pendingNominationResponse | null>(null);

  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken, user } = useAuth();

  const { data: nominations, isLoading } = useQuery({
    queryKey: ["pending-nominations"],
    queryFn: async () => {
      const data = await nominationApi.fetchPendingNominations(accessToken);
      return data;
    },
  });

  const { data: members } = useQuery({
    queryKey: ["team-members", accessToken],
    queryFn: async () => {
      const res = await nrcApi.fetchTeamMembers(accessToken);
      const members: TeamMember[] = res.flatMap((mem) => {
        let fullName = "";
        if (user.email == mem.user.email) {
          fullName = "YOU";
        } else {
          fullName = `${mem.user.firstName} ${mem.user.lastName}`;
        }
        const member: TeamMember = {
          id: mem.teamId,
          user_id: mem.user.id,
          profile: {
            full_name: fullName,
          },
        };
        return member;
      });
      return members;
    },
  });

  const toggleReviewer = (id: string) => {
    if (selectedReviewers.includes(id)) {
      setSelectedReviewers(selectedReviewers.filter((r) => r !== id));
    } else {
      if (selectedReviewers.length >= 3) {
        toast.error("Maximum of 3 reviewers allowed");
        return;
      }
      setSelectedReviewers([...selectedReviewers, id]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedNomination) {
      toast.error("Select a nomination first");
      return;
    }

    if (selectedReviewers.length < 2) {
      toast.error("Assign at least 2 reviewers");
      return;
    }

    if (!dueDate) {
      toast.error("Due date is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        nominationId: selectedNomination.id,
        reviewersIds: selectedReviewers,
        queue: {
          priority,
          dueDate: new Date(dueDate),
          notes: notes || null,
        },
      };
      await nrcApi.assignNomination(accessToken, payload);

      toast.success("Nomination assigned successfully");

      setSelectedNomination(null);
      setSelectedReviewers([]);
      setPriority(1);
      setDueDate("");
      setNotes("");

      queryClient.invalidateQueries({
        queryKey: ["assigned-nominations"],
      });
    } catch (error) {
      console.error(error);
      toast.error("Assignment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            Pending Nominations
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!nominations || nominations.length === 0) && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-lg">📄</span>
              </div>

              <p className="text-lg font-medium">No Pending Nominations</p>

              <p className="text-sm text-muted-foreground max-w-sm">
                There are currently no nominations awaiting assignment. Once new
                nominations are submitted, they will appear here for reviewer
                assignment.
              </p>
            </div>
          )}

          {/* Nomination List */}
          {!isLoading &&
            nominations?.map((nom) => (
              <Card
                key={nom.id}
                className="cursor-pointer transition hover:bg-muted/40 hover:shadow-sm rounded-xl"
                onClick={() => setSelectedNomination(nom)}
              >
                <CardContent className="p-4 space-y-1">
                  <p className="font-semibold">{nom.fullName}</p>

                  <p className="text-sm text-muted-foreground">
                    {nom.category.title} — {nom.subCategory.title}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {nom.country}, {nom.stateRegion}
                  </p>
                </CardContent>
              </Card>
            ))}
        </CardContent>
      </Card>

      {/* Nomination Detail Modal */}
      <Dialog
        open={!!selectedNomination}
        onOpenChange={() => setSelectedNomination(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedNomination && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {selectedNomination.fullName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
                {/* ================= NOMINATION DETAILS ================= */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">Impact Summary</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedNomination.impactSummary}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-1">
                      Achievement Description
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedNomination.achievementDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-4 rounded-md">
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedNomination.category.title}
                    </div>
                    <div>
                      <span className="font-medium">Subcategory:</span>{" "}
                      {selectedNomination.subCategory.title}
                    </div>
                    <div>
                      <span className="font-medium">Country:</span>{" "}
                      {selectedNomination.country}
                    </div>
                    <div>
                      <span className="font-medium">Year:</span>{" "}
                      {selectedNomination.yearOfNomination}
                    </div>
                  </div>
                </div>

                {/* ================= ASSIGNMENT SECTION ================= */}
                <div className="border-t pt-6 space-y-5">
                  <div>
                    <p className="text-base font-semibold">
                      Assign Reviewers (2–3 required)
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select at least 2 and at most 3 reviewers who will
                      evaluate this nomination.
                    </p>
                  </div>

                  {/* Reviewers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {members?.map((m) => (
                      <div
                        key={m.user_id}
                        className="flex items-center gap-3 border rounded-md p-3 hover:bg-muted/40 transition"
                      >
                        <Checkbox
                          checked={selectedReviewers.includes(m.user_id)}
                          onCheckedChange={() => toggleReviewer(m.user_id)}
                        />
                        <span className="text-sm">
                          {m.profile?.full_name || "Unnamed Reviewer"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Priority (1–10)
                    </label>
                    <p className="text-xs text-muted-foreground">
                      1 = Highest Priority (urgent review) <br />
                      10 = Lowest Priority
                    </p>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                    />
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Review Due Date
                    </label>
                    <p className="text-xs text-muted-foreground">
                      The deadline by which all assigned reviewers must complete
                      their evaluation.
                    </p>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Internal Notes (Optional)
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Add guidance or context for reviewers (e.g., focus areas,
                      concerns, special considerations).
                    </p>
                    <Input
                      placeholder="Add assignment notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Assign Nomination
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
