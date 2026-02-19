import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Users, PlusCircle } from "lucide-react";
import { nrcApi } from "@/api/newnrc";

function CreateNrcTeam() {
  const { user, accessToken } = useAuth();

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !user) return;

    setIsCreating(true);

    try {
      await nrcApi.createTeam(accessToken, teamName, description);

      toast.success("Team created successfully");
      setTeamName("");
      setDescription("");
      setShowDialog(false);
    } catch (error: any) {
      console.error("Failed to create team:", error);
      toast.error(error.message || "Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <NRCLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Team Management</h2>
            <p className="text-muted-foreground">
              Create and manage collaborative teams within your organization.
            </p>
          </div>

          <Button onClick={() => setShowDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Your Teams</CardTitle>
            <Badge variant="secondary">New</Badge>
          </CardHeader>

          <CardContent className="py-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-display text-xl font-semibold">
              No Teams Created
            </h3>
            <p className="mb-4 text-muted-foreground">
              Create your first team to begin collaborating with members.
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create First Team
            </Button>
          </CardContent>
        </Card>

        {/* Create Team Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Provide a name and description for your new team.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Name</label>
                <Input
                  placeholder="e.g. Research Task Force"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Team Description</label>
                <Input
                  placeholder="Short description about this team"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTeam}
                disabled={!teamName.trim() || isCreating}
              >
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NRCLayout>
  );
}

export default function CreateTeam() {
  return (
    <ProtectedRoute requiredRoles={["admin", "FREE_MEMBER"]}>
      <CreateNrcTeam />
    </ProtectedRoute>
  );
}
