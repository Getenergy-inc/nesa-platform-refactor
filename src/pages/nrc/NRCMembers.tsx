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

function NRCMembersContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: members, isLoading: membersLoading } = useNRCMembers();
  const { data: stats } = useNRCStats();
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const filteredMembers = members?.filter((member) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.profile?.full_name?.toLowerCase().includes(query) ||
      member.profile?.email?.toLowerCase().includes(query)
    );
  });

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !user) return;

    // Check member cap
    if ((stats?.total_members || 0) >= 30) {
      toast.error("NRC member limit (30) reached");
      return;
    }

    setIsInviting(true);
    try {
      // Generate invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase.from("nrc_invitations").insert({
        email: inviteEmail.trim().toLowerCase(),
        token,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setShowInviteDialog(false);
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
    } catch (error: any) {
      console.error("Failed to send invitation:", error);
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleStatusChange = async (
    member: NRCMember,
    newStatus: "active" | "suspended" | "removed"
  ) => {
    try {
      const updates: Partial<NRCMember> = { status: newStatus };
      if (newStatus === "active" && !member.joined_at) {
        updates.joined_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("nrc_members")
        .update(updates)
        .eq("id", member.id);

      if (error) throw error;

      // If activating, also add NRC role
      if (newStatus === "active") {
        await supabase.from("user_roles").upsert(
          { user_id: member.user_id, role: "nrc" },
          { onConflict: "user_id,role" }
        );
      }

      // If suspending/removing, remove NRC role
      if (newStatus === "suspended" || newStatus === "removed") {
        await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", member.user_id)
          .eq("role", "nrc");
      }

      queryClient.invalidateQueries({ queryKey: ["nrc-members"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
      toast.success(`Member ${newStatus}`);
    } catch (error) {
      console.error("Failed to update member:", error);
      toast.error("Failed to update member status");
    }
  };

  const getStatusBadge = (status: NRCMember["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success/10 text-success">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive">
            <ShieldOff className="mr-1 h-3 w-3" />
            Suspended
          </Badge>
        );
      case "removed":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Removed
          </Badge>
        );
      default:
        return null;
    }
  };

  const memberCapPercent = stats ? (stats.total_members / 30) * 100 : 0;
  const canInvite = (stats?.total_members || 0) < 30;

  return (
    <NRCLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">NRC Members</h2>
            <p className="text-muted-foreground">
              Manage the Nominee Research Corps team
            </p>
          </div>

          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button disabled={!canInvite}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite NRC Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join the Nominee Research Corps.
                  Members can review and approve nominations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="font-medium">Member Capacity</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={memberCapPercent} className="h-2 flex-1" />
                    <span className="text-muted-foreground">
                      {stats?.total_members || 0}/30
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || isInviting}
                >
                  {isInviting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Capacity Bar */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Team Capacity</span>
              <span className="text-muted-foreground">
                {stats?.total_members || 0} of 30 members
              </span>
            </div>
            <Progress value={memberCapPercent} className="mt-2 h-2" />
            {!canInvite && (
              <p className="mt-2 text-xs text-warning">
                Maximum capacity reached. Remove inactive members to invite new ones.
              </p>
            )}
          </CardContent>
        </Card>

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
                <CardContent className="flex items-center gap-4 py-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.profile?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">
                        {member.profile?.full_name || "Unknown"}
                      </p>
                      {getStatusBadge(member.status)}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {member.profile?.email}
                    </p>
                  </div>

                  <div className="hidden items-center gap-6 text-center sm:flex">
                    <div>
                      <p className="text-lg font-semibold">{member.review_count}</p>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {member.approval_rate.toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Approval</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {member.status === "pending" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(member, "active")}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Activate Member
                        </DropdownMenuItem>
                      )}
                      {member.status === "active" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(member, "suspended")}
                          className="text-warning"
                        >
                          <ShieldOff className="mr-2 h-4 w-4" />
                          Suspend Member
                        </DropdownMenuItem>
                      )}
                      {member.status === "suspended" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(member, "active")}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Reactivate Member
                        </DropdownMenuItem>
                      )}
                      {member.status !== "removed" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(member, "removed")}
                          className="text-destructive"
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove Member
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-display text-xl font-semibold">
                No Members Yet
              </h3>
              <p className="mb-4 text-muted-foreground">
                Start building your NRC team by inviting members
              </p>
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite First Member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </NRCLayout>
  );
}

export default function NRCMembers() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <NRCMembersContent />
    </ProtectedRoute>
  );
}
