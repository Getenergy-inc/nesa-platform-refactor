import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  const [isInviting, setIsInviting] = useState(false);

  const filteredMembers = members?.filter((member) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.profile?.full_name?.toLowerCase().includes(query) ||
      member.profile?.email?.toLowerCase().includes(query)
    );
  });
  const handleInviteToTeam = async (member: NRCMember) => {
    if (!user) return;

    setIsInviting(true);

    try {
      const invite = {
        inviteeEmail: member.profile.email,
        inviteeId: member.user_id,
        inviteeName: member.profile.full_name,
      };
      await nrcApi.inviteToTeam(accessToken, invite);
      // const { error } = await supabase.from("team_members").insert({
      //   team_id: teamId,
      //   user_id: member.user_id,
      // });
      // if (error) {
      //   if (error.code === "23505") {
      //     toast.error("Member already in team");
      //   } else {
      //     throw error;
      //   }
      //   return;
      // }
      toast.success("Member invited to team");
      // queryClient.invalidateQueries({
      //   queryKey: ["team-members", teamId],
      // });
      // setInvitingMemberId(null);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to invite member Error: ${error.message}`);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold">
          Invite NRC Members to Team
        </h2>
        <p className="text-muted-foreground">
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
          className="pl-10"
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
            <Card key={member.id}>
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={member.profile?.avatar_url || undefined}
                    />
                    <AvatarFallback>
                      {member.profile?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">
                      {member.profile?.full_name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.profile?.email}
                    </p>
                  </div>
                </div>

                <Dialog
                  open={invitingMemberId === member.id}
                  onOpenChange={(open) =>
                    setInvitingMemberId(open ? member.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite to Team
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Invite {member.profile?.full_name}?
                      </DialogTitle>
                      <DialogDescription>
                        This will send the member an email invite to your team.
                        They have the option to accept the invitation or not
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setInvitingMemberId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleInviteToTeam(member)}
                        disabled={isInviting}
                      >
                        {isInviting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirm Invite
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-display text-xl font-semibold">
              No NRC Members Found
            </h3>
            <p className="text-muted-foreground">
              There are currently no NRC members available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
