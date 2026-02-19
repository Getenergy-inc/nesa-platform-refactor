import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Loader2,
  MoreVertical,
  Mail,
  UserMinus,
  Search,
  Users,
} from "lucide-react";
import { nrcApi } from "@/api/newnrc";

interface TeamMember {
  id: string;
  user_id: string;
  profile: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

export default function TeamMembersSection({ teamId }: { teamId: string }) {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ["team-members", teamId],
    queryFn: async () => {
      const res = await nrcApi.fetchTeamMembers(accessToken);
      const data: TeamMember[] = res.flatMap((mem) => {
        const members: TeamMember = {
          id: mem.teamId,
          user_id: mem.user.id,
          profile: {
            full_name: `${mem.user.firstName} ${mem.user.lastName}`,
            email: mem.user.email,
            avatar_url: mem.user.profilePic,
          },
        };
        return members;
      });
      return data;
    },
  });

  const filteredMembers = members?.filter((member) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      member.profile?.full_name?.toLowerCase().includes(q) ||
      member.profile?.email?.toLowerCase().includes(q)
    );
  });

  const handleRemoveMember = async (member: TeamMember) => {
    try {
      //   const { error } = await supabase
      //     .from("team_members")
      //     .delete()
      //     .eq("id", member.id);

      //   if (error) throw error;

      //   toast.success("Member removed from team");

      queryClient.invalidateQueries({
        queryKey: ["team-members", teamId],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove member");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedMember || !message.trim() || !user) return;

    setIsSending(true);

    try {
      //   const { error } = await supabase.from("team_messages").insert({
      //     team_id: teamId,
      //     sender_id: user.id,
      //     recipient_id: selectedMember.user_id,
      //     content: message.trim(),
      //   });

      //   if (error) throw error;

      toast.success("Message sent");
      setMessage("");
      setSelectedMember(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
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

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredMembers && filteredMembers.length > 0 ? (
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedMember(member)}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleRemoveMember(member)}
                      className="text-destructive"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              No members in this team yet.
            </p>
          </div>
        )}
      </CardContent>

      {/* Message Dialog */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Send Message to {selectedMember?.profile?.full_name}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMember(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
            >
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
