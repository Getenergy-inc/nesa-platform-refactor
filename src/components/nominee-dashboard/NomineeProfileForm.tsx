import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Building2, MapPin, FileText, Camera, Loader2, Save } from "lucide-react";

interface NomineeProfileData {
  name: string;
  title?: string;
  organization?: string;
  country?: string;
  bio?: string;
  photoUrl?: string;
  logoUrl?: string;
  contributions?: string;
}

interface NomineeProfileFormProps {
  initialData: NomineeProfileData;
  onSave: (data: NomineeProfileData) => Promise<void>;
}

export function NomineeProfileForm({ initialData, onSave }: NomineeProfileFormProps) {
  const [data, setData] = useState<NomineeProfileData>(initialData);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof NomineeProfileData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setSaving(true);
    try {
      await onSave(data);
      toast.success("Profile updated successfully!");
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Update Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={data.photoUrl} alt={data.name} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="photoUrl">Profile Photo URL</Label>
              <div className="flex gap-2">
                <Input
                  id="photoUrl"
                  value={data.photoUrl || ""}
                  onChange={(e) => handleChange("photoUrl", e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-64"
                />
                <Button type="button" variant="outline" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Title / Position
              </Label>
              <Input
                id="title"
                value={data.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Professor, Director, CEO"
              />
            </div>

            {/* Organization */}
            <div className="space-y-2">
              <Label htmlFor="organization" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Organization / Institution
              </Label>
              <Input
                id="organization"
                value={data.organization || ""}
                onChange={(e) => handleChange("organization", e.target.value)}
                placeholder="e.g. University of Lagos"
              />
            </div>

            {/* Country */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="country" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Country
              </Label>
              <Input
                id="country"
                value={data.country || ""}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="e.g. Nigeria"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Biography
            </Label>
            <Textarea
              id="bio"
              value={data.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell your story... your background, achievements, and impact on education."
              rows={4}
            />
          </div>

          {/* Contributions */}
          <div className="space-y-2">
            <Label htmlFor="contributions" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Key Contributions to Education
            </Label>
            <Textarea
              id="contributions"
              value={data.contributions || ""}
              onChange={(e) => handleChange("contributions", e.target.value)}
              placeholder="Describe your major contributions and impact on education in Africa..."
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={saving || !hasChanges}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {!saving && <Save className="h-4 w-4 mr-2" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
