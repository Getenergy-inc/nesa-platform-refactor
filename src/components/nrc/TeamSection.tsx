import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { nrcApi } from "@/api/newnrc";

export interface TeamInfo {
  id: string;
  name: string;
  description: string;
}

export function TeamInfoSection() {
  const { accessToken } = useAuth();
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    id: "",
    name: "",
    description: "",
  });
  const [originalTeamInfo, setOriginalTeamInfo] = useState<TeamInfo>({
    id: "",
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch team information on component mount
  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const fetchedTeamInfo = await nrcApi.fetchTeamInfo(accessToken);
        const teamData = {
          id: fetchedTeamInfo.id,
          name: fetchedTeamInfo.name,
          description: fetchedTeamInfo.description || "",
        };
        setTeamInfo(teamData);
        setOriginalTeamInfo(teamData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch team information");
      } finally {
        setFetching(false);
      }
    };

    fetchTeamInfo();
  }, [accessToken]);

  const handleInputChange = (field: keyof TeamInfo, value: string) => {
    setTeamInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasChanges = () => {
    return (
      teamInfo.name !== originalTeamInfo.name ||
      teamInfo.description !== originalTeamInfo.description
    );
  };

  const handleUpdate = async () => {
    if (!teamInfo.name.trim()) {
      toast.error("Team name cannot be empty");
      return;
    }

    if (!hasChanges()) {
      toast.info("No changes detected");
      return;
    }

    try {
      setLoading(true);
      await nrcApi.updateTeamInfo(accessToken, teamInfo);
      setOriginalTeamInfo(teamInfo);
      toast.success("Team information updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update team information");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card className="bg-charcoal-light border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-charcoal-light border-white/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-lg">Team Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white/70">Team Name</label>
          <Input
            value={teamInfo.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter team name"
            className="bg-white/5 border-white/15 text-white focus:border-gold/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70">Team Description</label>
          <Textarea
            value={teamInfo.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter team description"
            className="bg-white/5 border-white/15 text-white focus:border-gold/50 min-h-[100px] resize-y"
          />
          <p className="text-xs text-white/50">
            Describe your team's purpose, goals, or any other relevant
            information.
          </p>
        </div>

        <Button
          onClick={handleUpdate}
          disabled={loading || !hasChanges()}
          className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold disabled:opacity-50"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
