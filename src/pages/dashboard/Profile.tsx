import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, MapPin, Building, Globe, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function ProfileContent() {
  const { user, roles } = useAuth();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [organization, setOrganization] = useState("");

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <InstitutionalDashboardLayout title="Profile" breadcrumbs={[{ label: "Profile" }]}>
      <Helmet>
        <title>My Profile | NESA-Africa</title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="border-gold/10 bg-[hsl(30_8%_8%)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
                <User className="h-8 w-8 text-gold" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  {fullName || user?.email?.split("@")[0] || "User"}
                </h2>
                <p className="text-white/50 text-sm">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  {roles.map((role) => (
                    <Badge key={role} className="bg-gold/20 text-gold border-gold/30 capitalize text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-gold/10 bg-[hsl(30_8%_8%)]">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-gold" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-white/5 border-white/10 text-white/50 pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Country</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 pl-10"
                    placeholder="Your country"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Organization</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 pl-10"
                    placeholder="Your organization"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Bio</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 min-h-[100px]"
                placeholder="Tell us about yourself and your work in education..."
              />
            </div>

            <Separator className="bg-gold/10" />

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gold hover:bg-gold/90 text-charcoal font-semibold"
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" /> Save Changes</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </InstitutionalDashboardLayout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
