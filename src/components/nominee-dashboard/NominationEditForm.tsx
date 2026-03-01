import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { nominationApi, updateNomination } from "@/api/nomination";
import { useAuth } from "@/contexts/AuthContext";
import {
  Camera,
  FileText,
  ImageIcon,
  Loader2,
  Upload,
  User,
  X,
} from "lucide-react";
import { fileType, uploadApi } from "@/api/storage";
import { UploadedFile } from "@/pages/Nominate";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

// Define the NominationType enum based on your Prisma schema
export type NominationType = "INDIVIDUAL" | "ORGANIZATION";

interface Props {
  nomination: updateNomination;
  onUpdated: (updated: updateNomination) => void;
}

export function NominationEditForm({ nomination, onUpdated }: Props) {
  const { accessToken } = useAuth();

  // Personal Information
  const [phone, setPhone] = useState(nomination.phone || "");
  const [country, setCountry] = useState(nomination.country || "");
  const [stateRegion, setStateRegion] = useState(nomination.stateRegion || "");
  const [id, setId] = useState(nomination.id);

  // Separate loading states
  const [profileUploading, setProfileUploading] = useState(false);
  const [evidenceUploading, setEvidenceUploading] = useState(false);

  // Account Type
  const [accountType, setAccountType] = useState<NominationType>(
    nomination.accountType || "INDIVIDUAL",
  );

  // Additional Nomination Details
  const [impactSummary, setImpactSummary] = useState(
    nomination.impactSummary || "",
  );
  const [achievementDescription, setAchievementDescription] = useState(
    nomination.achievementDescription || "",
  );

  // Links and Evidence
  const [linkedInProfile, setLinkedInProfile] = useState(
    nomination.linkedInProfile || "",
  );
  const [website, setWebsite] = useState(nomination.website || "");

  const [profileImage, setProfileImage] = useState<UploadedFile | null>(
    nomination.profileImage
      ? {
          name: "",
          url: nomination.profileImage,
          type: "",
          path: "",
        }
      : null,
  );

  const [evidenceFiles, setEvidenceFiles] = useState<UploadedFile[]>(
    nomination.evidenceUrl?.map((url) => ({
      name: "",
      url,
      type: "",
      path: "",
    })) || [],
  );

  const [loading, setLoading] = useState(false);

  const removePhoto = async () => {
    if (!profileImage) return;

    try {
      if (profileImage.path) {
        await uploadApi.deleteFile(accessToken, [profileImage.path]);
      }
      setProfileImage(null);
      toast.success("Photo removed");
    } catch (error) {
      toast.error("Failed to remove photo");
    }
  };

  const removeFile = async (file: UploadedFile) => {
    try {
      if (file.path) {
        await uploadApi.deleteFile(accessToken, [file.path]);
      }
      setEvidenceFiles((prev) => prev.filter((f) => f.path !== file.path));
      toast.success("File removed");
    } catch (error) {
      toast.error("Failed to remove file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await nominationApi.updateNominationDetails(accessToken, {
        phone,
        country,
        stateRegion,
        id,
        accountType,
        impactSummary,
        achievementDescription,
        linkedInProfile,
        website,
        profileImage: profileImage?.url || null,
        evidenceUrl: evidenceFiles.map((f) => f.url).filter(Boolean),
      });

      toast.success("Nomination updated successfully");
      onUpdated(updated);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setProfileUploading(true);

    try {
      // Determine file type
      let file_type: fileType;
      if (file.type.startsWith("image/")) {
        file_type = "IMAGE";
      } else {
        file_type = "DOCUMENT";
      }

      // Get presigned URL
      const uploadUrl = await uploadApi.getPresignedUrl(
        accessToken,
        file.name,
        file.type,
        file.size.toString(),
        file_type,
      );

      // Actual file upload
      await uploadApi.uploadFile(file, uploadUrl.signedUrl);

      // Fetch public facing URL
      const url = await uploadApi.getPublicUrl(accessToken, uploadUrl.path);

      const uploaded: UploadedFile = {
        name: file.name,
        url,
        type: file.type,
        path: uploadUrl.path,
      };

      setProfileImage(uploaded);
      toast.success("Profile photo uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload profile photo");
    } finally {
      setProfileUploading(false);
      e.target.value = "";
    }
  };

  const handleEvidenceUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setEvidenceUploading(true);
    const uploadedFiles: UploadedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Determine file type
        let file_type: fileType;
        if (file.type.startsWith("image/")) {
          file_type = "IMAGE";
        } else {
          file_type = "DOCUMENT";
        }

        // Get presigned URL
        const uploadUrl = await uploadApi.getPresignedUrl(
          accessToken,
          file.name,
          file.type,
          file.size.toString(),
          file_type,
        );

        // Upload file
        await uploadApi.uploadFile(file, uploadUrl.signedUrl);

        // Get public URL
        const url = await uploadApi.getPublicUrl(accessToken, uploadUrl.path);

        uploadedFiles.push({
          name: file.name,
          url,
          type: file.type,
          path: uploadUrl.path,
        });
      }

      setEvidenceFiles((prev) => [...prev, ...uploadedFiles]);
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("One or more files failed to upload");
    } finally {
      setEvidenceUploading(false);
      e.target.value = "";
    }
  };

  // Options for account type dropdown
  const accountTypeOptions: { value: NominationType; label: string }[] = [
    { value: "INDIVIDUAL", label: "Individual" },
    { value: "ORGANIZATION", label: "Organization" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Account Type Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Account Information</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account Type</label>
          <Select
            value={accountType}
            onValueChange={(value: NominationType) => setAccountType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Select whether this nomination is for an individual or organization
          </p>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">State/Region</label>
            <Input
              value={stateRegion}
              onChange={(e) => setStateRegion(e.target.value)}
              placeholder="California"
            />
          </div>
        </div>
      </div>

      {/* Nomination Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Nomination Details</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Impact Summary</label>
          <Textarea
            value={impactSummary}
            onChange={(e) => setImpactSummary(e.target.value)}
            rows={3}
            placeholder="Summarize the impact of your work..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Achievement Description</label>
          <Textarea
            value={achievementDescription}
            onChange={(e) => setAchievementDescription(e.target.value)}
            rows={3}
            placeholder="Describe your key achievements..."
          />
        </div>
      </div>

      {/* Links and Media Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Links and Media</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">LinkedIn Profile</label>
          <Input
            value={linkedInProfile}
            onChange={(e) => setLinkedInProfile(e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Personal Website</label>
          <Input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>

        {/* Profile Photo Upload */}
        <div className="space-y-2">
          <Label>Nominee Photo</Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <label
                className={cn(
                  "cursor-pointer block transition-opacity",
                  profileUploading
                    ? "opacity-50 pointer-events-none"
                    : "hover:opacity-80",
                )}
              >
                {profileImage ? (
                  <div className="relative group">
                    <img
                      src={profileImage.url}
                      alt="Nominee"
                      className="h-24 w-24 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all"
                    />
                    {/* Overlay that appears on hover */}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-muted/50 transition-all">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                  disabled={profileUploading}
                  data-type="profile"
                />
              </label>

              {/* Profile upload progress indicator */}
              {profileUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-black/50" />
                  <Loader2 className="h-8 w-8 animate-spin text-white relative z-10" />
                </div>
              )}

              {/* Remove button - only show if there's an image and not uploading */}
              {profileImage && !profileUploading && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -right-1 -top-1 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors"
                  title="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Profile Photo</p>
              <p className="text-xs text-muted-foreground">
                {profileImage ? (
                  <>Click the photo to change • JPEG, PNG up to 8MB</>
                ) : (
                  <>Click the placeholder to upload • JPEG, PNG up to 8MB</>
                )}
              </p>
              {profileImage && !profileUploading && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => {
                    document.getElementById("profile-image-upload")?.click();
                  }}
                >
                  Change photo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Evidence Files Upload */}
        <div className="space-y-3">
          <Label>Supporting Evidence</Label>
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-6 text-center">
            <label
              className={cn(
                "cursor-pointer block",
                evidenceUploading && "opacity-50 pointer-events-none",
              )}
            >
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                className="hidden"
                onChange={handleEvidenceUpload}
                disabled={evidenceUploading}
              />
              {evidenceUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm font-medium">Uploading files...</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload files</p>
                  <p className="text-xs text-muted-foreground">
                    Images, PDFs, or videos (max 10MB each)
                  </p>
                </>
              )}
            </label>
          </div>

          {evidenceFiles.length > 0 && (
            <div className="space-y-2">
              {evidenceFiles.map((file, index) => (
                <div
                  key={file.path || index}
                  className="flex items-center justify-between rounded-lg bg-muted p-3"
                >
                  <div className="flex items-center gap-3">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {file.name || file.url.split("/").pop() || "File"}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file)}
                    disabled={evidenceUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={loading || profileUploading || evidenceUploading}
          className="min-w-[120px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
