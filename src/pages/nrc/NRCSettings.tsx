import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { useIsNRCMember } from "@/hooks/useNRCData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AFRICAN_REGIONS } from "@/lib/regions";
import { toast } from "sonner";
import { Loader2, Save, Clock, Globe, AlertTriangle } from "lucide-react";

const ALL_REGIONS = "__all__";

function NRCSettingsContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: memberData, isLoading, error, refetch } = useIsNRCMember();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [maxQueueSize, setMaxQueueSize] = useState(10);
  const [assignedRegion, setAssignedRegion] = useState<string>(ALL_REGIONS);

  // The member record loads asynchronously, so seed the form once it arrives.
  useEffect(() => {
    if (!memberData) return;
    setMaxQueueSize(memberData.max_queue_size ?? 10);
    setAssignedRegion(memberData.assigned_region || ALL_REGIONS);
  }, [memberData]);

  const handleSave = async () => {
    if (!user || !memberData) return;

    setIsSaving(true);
    try {
      const { data, error: saveError } = await supabase
        .from("nrc_members")
        .update({
          max_queue_size: maxQueueSize,
          assigned_region: assignedRegion === ALL_REGIONS ? null : assignedRegion,
        })
        .eq("id", memberData.id)
        .select("id");

      if (saveError) throw saveError;
      if (!data || data.length === 0) {
        throw new Error(
          "No record was updated — your account may no longer have NRC edit permissions."
        );
      }

      queryClient.invalidateQueries({ queryKey: ["is-nrc-member"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-members"] });
      toast.success("Settings saved");
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <NRCLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </NRCLayout>
    );
  }

  if (error) {
    return (
      <NRCLayout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Could not load your NRC membership</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{(error as Error).message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </NRCLayout>
    );
  }

  // Honest empty state: role access alone does not create an nrc_members record.
  if (!memberData) {
    return (
      <NRCLayout>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No active NRC member record</AlertTitle>
          <AlertDescription>
            You do not yet have an active Nominee Research Corps membership record,
            so there are no queue or region preferences to configure. An
            administrator must activate your membership from the NRC Members page
            first.
          </AlertDescription>
        </Alert>
      </NRCLayout>
    );
  }


  return (
    <NRCLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Manage your NRC workspace preferences
          </p>
        </div>

        {/* Queue Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Queue Settings</CardTitle>
            </div>
            <CardDescription>
              Control how nominations are assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Maximum Queue Size</Label>
                <span className="font-medium">{maxQueueSize} nominations</span>
              </div>
              <Slider
                value={[maxQueueSize]}
                onValueChange={([value]) => setMaxQueueSize(value)}
                min={5}
                max={20}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                New nominations won't be assigned to you when your queue reaches
                this limit
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Regional Focus */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Regional Focus</CardTitle>
            </div>
            <CardDescription>
              Set your preferred region for nomination assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Region</Label>
              <Select value={assignedRegion} onValueChange={setAssignedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_REGIONS}>All Regions</SelectItem>
                  {AFRICAN_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Nominations from your preferred region will be prioritized in
                your queue
              </p>
            </div>
          </CardContent>
        </Card>


        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </NRCLayout>
  );
}

export default function NRCSettings() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <NRCSettingsContent />
    </ProtectedRoute>
  );
}
