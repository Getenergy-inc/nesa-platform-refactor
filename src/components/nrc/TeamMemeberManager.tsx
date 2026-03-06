import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { nrcApi, NrcTeamMembersResponse } from "@/api/newnrc";

interface Member {
  id: string;
  fullName: string;
  email: string;
}

export function TeamMembersManager() {
  const { accessToken, user } = useAuth();
  const [memberToRemove, setMemberToRemove] =
    useState<NrcTeamMembersResponse | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ["team-members-manager"],
    queryFn: async () => {
      return await nrcApi.fetchTeamMembers(accessToken);
    },
  });

  // Filter out the current user from the members list
  const otherMembers = members?.filter(
    (member: NrcTeamMembersResponse) => member.user.email !== user?.email,
  );

  const handleRemoveClick = (member: NrcTeamMembersResponse) => {
    setMemberToRemove(member);
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;

    setIsRemoving(true);
    try {
      await nrcApi.removeTeamMember(accessToken, memberToRemove.user.id);
      toast.success(
        `${memberToRemove.user.firstName} ${memberToRemove.user.lastName} has been removed from the team`,
      );
      queryClient.invalidateQueries({
        queryKey: ["team-members-manager"],
      });
      setMemberToRemove(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove member");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancelRemove = () => {
    setMemberToRemove(null);
  };

  return (
    <>
      <Card className="bg-charcoal-light border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Team Members</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
            </div>
          )}

          {!isLoading && otherMembers?.length === 0 && (
            <p className="text-sm text-white/50 text-center">
              No other team members found.
            </p>
          )}

          {!isLoading &&
            otherMembers?.map((member: NrcTeamMembersResponse) => (
              <div
                key={member.user.id}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition"
              >
                <div>
                  <p className="text-white font-medium">{`${member.user.firstName} ${member.user.lastName}`}</p>
                  <p className="text-xs text-white/50">{member.user.email}</p>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveClick(member)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && handleCancelRemove()}
      >
        <DialogContent className="bg-charcoal-light border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-white">
                {memberToRemove?.user.firstName} {memberToRemove?.user.lastName}
              </span>{" "}
              from the team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelRemove}
              className="border-white/10 bg-transparent text-white hover:bg-white/10"
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="flex items-center gap-2"
            >
              {isRemoving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isRemoving ? "Removing..." : "Remove Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
