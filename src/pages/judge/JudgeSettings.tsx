import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  User, 
  Bell, 
  Shield, 
  Key,
  Save,
  Upload,
} from "lucide-react";

export default function JudgeSettings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    newAssignments: true,
    deadlineReminders: true,
    systemUpdates: false,
  });
  const [saving, setSaving] = useState(false);

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "JG";

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Settings saved successfully");
  };

  return (
    <>
      <Helmet>
        <title>Settings | Judges Arena</title>
      </Helmet>

      <JudgesArenaLayout title="Settings" description="Manage your arena preferences">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Profile Section */}
          <Card className="border-white/10 bg-white/5 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-gold" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-white/50">
                Your jury panel profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-gold/30">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gold/20 text-gold text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-white/40 mt-2">JPG or PNG, max 2MB</p>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Full Name</Label>
                  <Input 
                    defaultValue={user?.user_metadata?.full_name || ""} 
                    className="bg-white/5 border-white/10 text-white"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Email</Label>
                  <Input 
                    defaultValue={user?.email || ""} 
                    className="bg-white/5 border-white/10 text-white"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Organization</Label>
                  <Input 
                    placeholder="Your institution" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Country</Label>
                  <Input 
                    placeholder="Your country" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="border-white/10 bg-white/5 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-gold" />
                Notifications
              </CardTitle>
              <CardDescription className="text-white/50">
                Manage how you receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-white/50">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">New Assignments</p>
                  <p className="text-sm text-white/50">Get notified when you're assigned a new nominee</p>
                </div>
                <Switch 
                  checked={notifications.newAssignments}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newAssignments: checked }))}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">Deadline Reminders</p>
                  <p className="text-sm text-white/50">Reminders for upcoming scoring deadlines</p>
                </div>
                <Switch 
                  checked={notifications.deadlineReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, deadlineReminders: checked }))}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">System Updates</p>
                  <p className="text-sm text-white/50">News about platform features and changes</p>
                </div>
                <Switch 
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, systemUpdates: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border-white/10 bg-white/5 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-gold" />
                Security
              </CardTitle>
              <CardDescription className="text-white/50">
                Account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">Change Password</p>
                  <p className="text-sm text-white/50">Update your account password</p>
                </div>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <Key className="mr-2 h-4 w-4" />
                  Change
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-white/50">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-gold text-charcoal hover:bg-gold/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </JudgesArenaLayout>
    </>
  );
}
