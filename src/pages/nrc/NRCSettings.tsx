import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { useIsNRCMember } from "@/hooks/useNRCData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, Bell, Clock, Globe } from "lucide-react";

const REGIONS = [
  "West Africa",
  "East Africa",
  "North Africa",
  "Southern Africa",
  "Central Africa",
];

function NRCSettingsContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: memberData, isLoading } = useIsNRCMember();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [maxQueueSize, setMaxQueueSize] = useState(
    memberData?.max_queue_size || 10,
  );
  const [assignedRegion, setAssignedRegion] = useState(
    memberData?.assigned_region || "",
  );
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = async () => {
    if (!user || !memberData) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("nrc_members")
        .update({
          max_queue_size: maxQueueSize,
          assigned_region: assignedRegion || null,
        })
        .eq("id", memberData.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["is-nrc-member"] });
      toast.success("Settings saved");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
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
                  <SelectItem value="">All Regions</SelectItem>
                  {REGIONS.map((region) => (
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

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>
              Manage how you receive updates about your queue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails when new nominations are assigned
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
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
    <ProtectedRoute requiredRoles={["nrc", "admin", "FREE_MEMBER"]}>
      <NRCSettingsContent />
    </ProtectedRoute>
  );
}
