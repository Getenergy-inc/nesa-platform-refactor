import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image, Video } from "lucide-react";
import { uploadMediaSchema, type UploadMediaData } from "@/lib/endorsement-validate";
import endorsementData from "@/data/endorsements.json";
import { cn } from "@/lib/utils";

interface UploadMediaStepProps {
  data: Partial<UploadMediaData>;
  onNext: (data: UploadMediaData) => void;
  onBack: () => void;
}

export function UploadMediaStep({ data, onNext, onBack }: UploadMediaStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logoUrl || null);
  const [videoPreview, setVideoPreview] = useState<string | null>(data.videoUrl || null);
  const [dragOverLogo, setDragOverLogo] = useState(false);
  const [dragOverVideo, setDragOverVideo] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UploadMediaData>({
    resolver: zodResolver(uploadMediaSchema),
    defaultValues: {
      logoUrl: data.logoUrl || "",
      videoUrl: data.videoUrl || "",
      videoLink: data.videoLink || "",
      headline: data.headline || "",
    },
  });

  const handleLogoUpload = (file: File) => {
    const maxSize = endorsementData.fileUploadLimits.logoMaxSizeMb * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`Logo must be under ${endorsementData.fileUploadLimits.logoMaxSizeMb}MB`);
      return;
    }
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    setValue("logoUrl", url);
  };

  const handleVideoUpload = (file: File) => {
    const maxSize = endorsementData.fileUploadLimits.videoMaxSizeMb * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`Video must be under ${endorsementData.fileUploadLimits.videoMaxSizeMb}MB`);
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setValue("videoUrl", url);
  };

  const handleDrop = (e: React.DragEvent, type: "logo" | "video") => {
    e.preventDefault();
    if (type === "logo") setDragOverLogo(false);
    else setDragOverVideo(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (type === "logo") handleLogoUpload(file);
    else handleVideoUpload(file);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Upload Media
        </h2>
        <p className="text-muted-foreground">
          Add your organization's logo and an optional endorsement video.
        </p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-3">
        <Label>Upload Organization Logo</Label>
        <p className="text-xs text-muted-foreground">
          SVG, PNG, JPG (max {endorsementData.fileUploadLimits.logoMaxSizeMb}MB)
        </p>
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
            dragOverLogo ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            logoPreview && "border-solid border-primary bg-primary/5"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOverLogo(true); }}
          onDragLeave={() => setDragOverLogo(false)}
          onDrop={(e) => handleDrop(e, "logo")}
          onClick={() => logoInputRef.current?.click()}
        >
          {logoPreview ? (
            <div className="relative inline-block">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="max-h-24 max-w-full mx-auto rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogoPreview(null);
                  setValue("logoUrl", "");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">
                SVG, PNG, JPG (max {endorsementData.fileUploadLimits.logoMaxSizeMb}MB)
              </p>
            </>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoUpload(file);
            }}
          />
        </div>
      </div>

      {/* Video Upload */}
      <div className="space-y-3">
        <Label>Upload Endorsement Video (Optional)</Label>
        <p className="text-xs text-muted-foreground">
          MP4, MOV, AVI (max {endorsementData.fileUploadLimits.videoMaxSizeMb}MB)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
              dragOverVideo ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOverVideo(true); }}
            onDragLeave={() => setDragOverVideo(false)}
            onDrop={(e) => handleDrop(e, "video")}
            onClick={() => videoInputRef.current?.click()}
          >
            {videoPreview ? (
              <div className="relative inline-flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Video uploaded</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoPreview(null);
                    setValue("videoUrl", "");
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Upload video file</p>
              </>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept=".mp4,.mov,.avi"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleVideoUpload(file);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoLink" className="text-sm">Or Video Link</Label>
            <Input
              id="videoLink"
              placeholder="YouTube or Vimeo link"
              {...register("videoLink")}
              className={errors.videoLink ? "border-destructive" : ""}
            />
            {errors.videoLink && (
              <p className="text-xs text-destructive">{errors.videoLink.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <Label htmlFor="headline">Endorsement Headline (Optional)</Label>
        <Input
          id="headline"
          placeholder="A short message of support..."
          {...register("headline")}
          className={errors.headline ? "border-destructive" : ""}
        />
        {errors.headline && (
          <p className="text-xs text-destructive">{errors.headline.message}</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next
        </Button>
      </div>
    </form>
  );
}
