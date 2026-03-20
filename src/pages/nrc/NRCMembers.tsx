import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { useNRCMembers, useNRCStats } from "@/hooks/useNRCData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  UserPlus,
  MoreVertical,
  Mail,
  Shield,
  ShieldOff,
  UserMinus,
  Loader2,
  Search,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";
import type { NRCMember } from "@/types/nrc";
import { nrcApi } from "@/api/newnrc";

export function NRCMembersContent() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const { data: members, isLoading: membersLoading } = useNRCMembers();

  const [searchQuery, setSearchQuery] = useState("");
  const [invitingMemberId, setInvitingMemberId] = useState<string | null>(null);

  const inviteMutation = useMutation({
    mutationFn: async (member: NRCMember) => {
      if (!user) throw new Error("User not authenticated");

      const invite = {
        inviteeEmail: member.profile.email,
        inviteeId: member.user_id,
        inviteeName: member.profile.full_name,
      };
      return nrcApi.inviteToTeam(accessToken, invite);
    },
    onSuccess: () => {
      toast.success("Member invited to team");
      setInvitingMemberId(null);
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error(`Failed to invite member Error: ${error.message}`);
    },
  });

  const filteredMembers = members?.filter((member) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.profile?.full_name?.toLowerCase().includes(query) ||
      member.profile?.email?.toLowerCase().includes(query)
    );
  });

  const handleInviteToTeam = async (member: NRCMember) => {
    inviteMutation.mutate(member);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold break-words">
          Invite NRC Members to Team
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select NRC members and add them to your team.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Members List */}
      {membersLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredMembers && filteredMembers.length > 0 ? (
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Member Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage
                        src={member.profile?.avatar_url || undefined}
                      />
                      <AvatarFallback className="text-xs">
                        {member.profile?.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {member.profile?.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.profile?.email}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Dialog
                    open={invitingMemberId === member.id}
                    onOpenChange={(open) =>
                      setInvitingMemberId(open ? member.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-shrink-0 h-8 px-3 text-xs"
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                        Invite
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[calc(100%-32px)] max-w-[400px] mx-auto rounded-lg p-5">
                      <DialogHeader className="space-y-2">
                        <DialogTitle className="text-base">
                          Invite {member.profile?.full_name?.split(" ")[0]}?
                        </DialogTitle>
                        <DialogDescription className="text-xs leading-relaxed">
                          This will send an email invite to{" "}
                          <span className="font-medium text-foreground break-all">
                            {member.profile?.email}
                          </span>
                          . They can choose to accept or decline joining your
                          team.
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="flex flex-col gap-2 mt-4">
                        <Button
                          onClick={() => handleInviteToTeam(member)}
                          disabled={inviteMutation.isPending}
                          className="w-full"
                          size="sm"
                        >
                          {inviteMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                              Sending Invite...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-3.5 w-3.5" />
                              Send Invite
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setInvitingMemberId(null)}
                          className="w-full"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 px-4 text-center">
            <Award className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
            <h3 className="mb-1 font-display text-base font-semibold">
              No Members Found
            </h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? "No members match your search criteria."
                : "There are currently no NRC members available."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
