import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Globe, Key, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

function SettingsContent() {
  const { signOut } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [nominationAlerts, setNominationAlerts] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [chapterUpdates, setChapterUpdates] = useState(true);

  return (
    <InstitutionalDashboardLayout title="Settings" breadcrumbs={[{ label: "Settings" }]}>
      <Helmet>
        <title>Settings | NESA-Africa</title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Notifications */}
        <Card className="border-gold/10 bg-[hsl(30_8%_8%)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-gold" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-white/50">
              Choose what notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: "Email Notifications", desc: "Receive important updates via email", state: emailNotifications, setter: setEmailNotifications },
              { label: "Nomination Alerts", desc: "Get notified about nomination status changes", state: nominationAlerts, setter: setNominationAlerts },
              { label: "Event Reminders", desc: "Reminders for upcoming NESA events", state: eventReminders, setter: setEventReminders },
              { label: "Chapter Updates", desc: "News from your local chapter", state: chapterUpdates, setter: setChapterUpdates },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium text-sm">{item.label}</p>
                    <p className="text-white/40 text-xs">{item.desc}</p>
                  </div>
                  <Switch checked={item.state} onCheckedChange={item.setter} />
                </div>
                {i < 3 && <Separator className="bg-gold/5" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-gold/10 bg-[hsl(30_8%_8%)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-sm">Change Password</p>
                <p className="text-white/40 text-xs">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
                <Key className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-gold/10 bg-[hsl(30_8%_8%)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-gold" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/50 text-sm">
              Language preference: <span className="text-white font-medium">English</span>
            </p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/20 bg-[hsl(30_8%_8%)]">
          <CardHeader>
            <CardTitle className="text-red-400 text-sm">Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </InstitutionalDashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
