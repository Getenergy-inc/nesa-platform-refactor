import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSeason, useStageGate } from "@/contexts/SeasonContext";
import { StageGate, StageLocked } from "@/components/StageGate";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Award, Upload, X, ArrowLeft, CheckCircle, FileText, Image as ImageIcon, User, Building, FileCheck } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
}

interface UploadedFile {
  name: string;
  url: string;
  path: string;
  type: string;
}

export default function Nominate() {
  const { user, loading: authLoading } = useAuth();
  const { currentEdition } = useSeason();
  const navigate = useNavigate();

  // Form state
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeTitle, setNomineeTitle] = useState("");
  const [nomineeOrganization, setNomineeOrganization] = useState("");
  const [nomineeBio, setNomineeBio] = useState("");
  const [justification, setJustification] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [nomineePhoto, setNomineePhoto] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setCategories(data);
      }
    }
    loadCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    async function loadSubcategories() {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }

      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", selectedCategory)
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setSubcategories(data);
        setSelectedSubcategory("");
      }
    }
    loadSubcategories();
  }, [selectedCategory]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to submit a nomination");
      navigate("/login", { state: { from: "/nominate" } });
    }
  }, [user, authLoading, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPhoto: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setUploading(true);
    const newFiles: UploadedFile[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("nomination-evidence")
          .upload(fileName, file);

        if (error) {
          console.error("Upload error:", error);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("nomination-evidence")
          .getPublicUrl(data.path);

        const uploadedFile: UploadedFile = {
          name: file.name,
          url: urlData.publicUrl,
          path: data.path,
          type: file.type,
        };

        if (isPhoto) {
          setNomineePhoto(uploadedFile);
        } else {
          newFiles.push(uploadedFile);
        }
      }

      if (!isPhoto && newFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        toast.success(`${newFiles.length} file(s) uploaded successfully`);
      } else if (isPhoto) {
        toast.success("Photo uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (file: UploadedFile) => {
    try {
      await supabase.storage.from("nomination-evidence").remove([file.path]);
      setUploadedFiles((prev) => prev.filter((f) => f.path !== file.path));
      toast.success("File removed");
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const removePhoto = async () => {
    if (!nomineePhoto) return;
    try {
      await supabase.storage.from("nomination-evidence").remove([nomineePhoto.path]);
      setNomineePhoto(null);
      toast.success("Photo removed");
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubcategory) {
      toast.error("Please select a category and subcategory");
      return;
    }

    if (!nomineeName.trim()) {
      toast.error("Please enter the nominee's name");
      return;
    }

    if (!justification.trim()) {
      toast.error("Please provide a justification for this nomination");
      return;
    }

    setSubmitting(true);

    try {
      // Get current season
      const { data: season, error: seasonError } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (seasonError || !season) {
        toast.error("No active season found");
        return;
      }

      const { error } = await supabase.from("nominations").insert({
        season_id: season.id,
        subcategory_id: selectedSubcategory,
        nominee_name: nomineeName.trim(),
        nominee_title: nomineeTitle.trim() || null,
        nominee_organization: nomineeOrganization.trim() || null,
        nominee_bio: nomineeBio.trim() || null,
        nominee_photo_url: nomineePhoto?.url || null,
        evidence_urls: uploadedFiles.map((f) => f.url),
        justification: justification.trim(),
        nominator_id: user!.id,
      });

      if (error) {
        if (error.message.includes("stage")) {
          toast.error("Nominations are currently closed");
        } else {
          toast.error("Failed to submit nomination. Please try again.");
        }
        console.error("Submission error:", error);
        return;
      }

      toast.success("Nomination submitted successfully!");
      navigate("/dashboard/nominations");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToStep2 = selectedCategory && selectedSubcategory;
  const canProceedToStep3 = nomineeName.trim().length > 0;

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">Submit Nomination</h1>
              <p className="text-xs text-muted-foreground">{currentEdition.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl px-6 py-8">
        <StageGate action="nominations" fallback={<StageLocked action="nominations" />}>
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`mx-2 h-1 w-16 rounded-full transition-colors sm:w-24 md:w-32 ${
                        step > s ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Category</span>
              <span>Nominee Details</span>
              <span>Evidence</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Select Category</CardTitle>
                  <CardDescription>
                    Choose the award category that best fits your nominee
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Award Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory && categories.find((c) => c.id === selectedCategory)?.description && (
                      <p className="text-sm text-muted-foreground">
                        {categories.find((c) => c.id === selectedCategory)?.description}
                      </p>
                    )}
                  </div>

                  {selectedCategory && subcategories.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                        <SelectTrigger id="subcategory">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep2}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Nominee Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Nominee Details</CardTitle>
                  <CardDescription>
                    Provide information about the person or organization you're nominating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Nominee Photo (Optional)</Label>
                    <div className="flex items-center gap-4">
                      {nomineePhoto ? (
                        <div className="relative">
                          <img
                            src={nomineePhoto.url}
                            alt="Nominee"
                            className="h-24 w-24 rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, true)}
                            disabled={uploading}
                          />
                          <User className="h-8 w-8 text-muted-foreground" />
                        </label>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Upload a photo of the nominee (JPEG, PNG, max 10MB)
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="nomineeName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nomineeName"
                        value={nomineeName}
                        onChange={(e) => setNomineeName(e.target.value)}
                        placeholder="Enter nominee's full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nomineeTitle">Title / Position</Label>
                      <Input
                        id="nomineeTitle"
                        value={nomineeTitle}
                        onChange={(e) => setNomineeTitle(e.target.value)}
                        placeholder="e.g., CEO, Founder, Professor"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nomineeOrganization">Organization</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="nomineeOrganization"
                          value={nomineeOrganization}
                          onChange={(e) => setNomineeOrganization(e.target.value)}
                          placeholder="Organization name"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomineeBio">Biography (Optional)</Label>
                    <Textarea
                      id="nomineeBio"
                      value={nomineeBio}
                      onChange={(e) => setNomineeBio(e.target.value)}
                      placeholder="Brief biography of the nominee..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      {nomineeBio.length}/500 characters
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Evidence & Justification */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Evidence & Justification</CardTitle>
                  <CardDescription>
                    Provide supporting evidence and explain why this nominee deserves recognition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="justification">
                      Justification <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="justification"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Explain why this nominee deserves to be recognized. Include their achievements, impact, and contributions to education in Africa..."
                      rows={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 50 characters. {justification.length}/2000 characters
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Supporting Evidence (Optional)</Label>
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-6 text-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*,application/pdf,video/mp4"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, false)}
                          disabled={uploading}
                        />
                        <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {uploading ? "Uploading..." : "Click to upload files"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Images, PDFs, or videos (max 10MB each)
                        </p>
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.path}
                            className="flex items-center justify-between rounded-lg bg-muted p-3"
                          >
                            <div className="flex items-center gap-3">
                              {file.type.startsWith("image/") ? (
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <FileText className="h-5 w-5 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="mb-3 font-semibold">Nomination Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">
                          {categories.find((c) => c.id === selectedCategory)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subcategory:</span>
                        <span className="font-medium">
                          {subcategories.find((s) => s.id === selectedSubcategory)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nominee:</span>
                        <span className="font-medium">{nomineeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Evidence Files:</span>
                        <span className="font-medium">{uploadedFiles.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || justification.length < 50}
                      className="bg-primary"
                    >
                      {submitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <FileCheck className="mr-2 h-4 w-4" />
                          Submit Nomination
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </StageGate>
      </main>
    </div>
  );
}
