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
import { Loader2, Trash2, Users } from "lucide-react";
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
      <Card className="bg-charcoal-light border-white/10 shadow-xl w-full">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-white text-lg sm:text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-gold" />
            Team Members
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          )}

          {!isLoading && otherMembers?.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-white/20 mb-3" />
              <p className="text-sm text-white/50">
                No other team members found.
              </p>
            </div>
          )}

          {!isLoading &&
            otherMembers?.map((member: NrcTeamMembersResponse) => (
              <div
                key={member.user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">
                    {`${member.user.firstName} ${member.user.lastName}`}
                  </p>
                  <p className="text-xs text-white/50 truncate">
                    {member.user.email}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveClick(member)}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span className="sm:hidden">Remove Member</span>
                  <span className="hidden sm:inline">Remove</span>
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
        <DialogContent className="bg-charcoal-light border-white/10 text-white w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg sm:text-xl">
              Confirm Removal
            </DialogTitle>
            <DialogDescription className="text-white/70 text-sm sm:text-base">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-white block sm:inline mt-1 sm:mt-0">
                {memberToRemove?.user.firstName} {memberToRemove?.user.lastName}
              </span>{" "}
              from the team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
            <Button
              variant="outline"
              onClick={handleCancelRemove}
              className="border-white/10 bg-transparent text-white hover:bg-white/10 w-full sm:w-auto order-2 sm:order-1"
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
            >
              {isRemoving && (
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              )}
              <span className="truncate">
                {isRemoving ? "Removing..." : "Remove Member"}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
