import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSeason } from "@/contexts/SeasonContext";
import { StageGate, StageLocked } from "@/components/StageGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Award,
  Upload,
  X,
  ArrowLeft,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  User,
  Building,
  FileCheck,
  Globe,
  MapPin,
  Trophy,
  Star,
  ChevronRight,
  Home,
  Save,
  RotateCcw,
  Trash2,
  Eye,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  NESA_CATEGORIES,
  CategoryDefinition,
  getScopeBadge,
  getTierPath,
  isCompetitiveCategory,
  TIER_INFO,
  CategoryScope,
} from "@/config/nesaCategories";
import { useNominationDraft } from "@/hooks/useNominationDraft";
import { formatDistanceToNow } from "date-fns";
import { ExistingNomineesSection } from "@/components/nesa/ExistingNomineesSection";

// 🔹 API SERVICES
// import { seasonApi } from "@/api/season.api";
import { Category, categoryApi, SubCategory } from "@/api/category";
import { fileType, uploadApi } from "@/api/storage";
import { nominationApi } from "@/api/nomination";
import { APPLICATION_YEAR } from "@/api/config";

interface DbSubcategory {
  id: string;
  name: string;
  description: string | null;
}

export interface UploadedFile {
  name: string;
  url: string;
  path: string;
  type: string;
}
export enum NominationType {
  INDIVIDUAL = "INDIVIDUAL",
  ORGANIZATION = "ORGANIZATION",
}
export interface Nomination {
  fullName: string;
  email: string;
  phone: string | null;
  country: string;
  stateRegion: string;
  impactSummary: string;
  achievementDescription: string;
  linkedInProfile: string | null;
  website: string | null;
  profileImage: string | null;
  categoryId: string;
  subCategoryId: string;
  accountType: NominationType;
  nomineeId?: string | null;
  yearOfNomination: string;
  evidenceUrl: string[];
}

export default function Nominate() {
  const { user, loading: authLoading, accessToken } = useAuth();
  const { currentEdition } = useSeason();
  const navigate = useNavigate();
  const { hasDraft, draftDate, saveDraft, loadDraft, clearDraft } =
    useNominationDraft();

  // ---------------- FORM STATE ----------------
  const [dbSubcategories, setDbSubcategories] = useState<SubCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeTitle, setNomineeTitle] = useState("");
  const [nomineeOrganization, setNomineeOrganization] = useState("");
  const [nomineeBio, setNomineeBio] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [nomineePhoto, setNomineePhoto] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showDraftBanner, setShowDraftBanner] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [accountType, setAccountType] = useState<NominationType>();
  const [phone, setPhone] = useState<string | "">("");
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [website, setWebsite] = useState("");
  const [impactSummary, setImpactSummary] = useState("");
  const [achievementDescription, setAchievementDescription] = useState("");
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [scope, setScope] = useState<CategoryScope>("NIGERIA");

  // categories
  // const categories = await categoryApi.fetchAllCategories(accessToken);
  useEffect(() => {
    categoryApi
      .fetchAllCategories(accessToken)
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"));
  }, [accessToken]);

  // ---------------- CATEGORY LOGIC ----------------
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );

  // ---------------- LOAD SUBCATEGORIES ----------------
  useEffect(() => {
    if (!selectedCategory?.id) {
      setDbSubcategories([]);
      return;
    }

    setScope(scope);
    categoryApi
      .fetchSubcategories(accessToken, selectedCategory.id)
      .then(setDbSubcategories)
      .catch(() => toast.error("Failed to load subcategories"));
  }, [selectedCategory, accessToken, scope]);

  // ---------------- AUTH GUARD ----------------
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to submit a nomination");
      navigate("/login", { state: { from: "/nominate" } });
    }
  }, [authLoading, user, navigate]);

  // ---------------- DRAFT HANDLERS ----------------
  const handleSaveDraft = useCallback(() => {
    saveDraft({
      selectedCategoryId,
      selectedSubcategoryId,
      accountType,
      nomineeName,
      nomineeTitle,
      nomineeOrganization,
      nomineeBio,
      phone,
      country,
      stateRegion,
      linkedinProfile,
      website,
      impactSummary,
      achievementDescription,
      step,
      email,
    });

    setLastSaved(new Date());
    toast.success("Draft saved");
  }, [
    selectedCategoryId,
    selectedSubcategoryId,
    nomineeName,
    nomineeTitle,
    nomineeOrganization,
    nomineeBio,
    step,
    saveDraft,
    achievementDescription,
    accountType,
    country,
    email,
    linkedinProfile,
    website,
    impactSummary,
    phone,
    stateRegion,
  ]);

  const handleRestoreDraft = () => {
    const d = loadDraft();
    if (!d) return;
    Object.assign(d, {
      setSelectedCategoryId,
      setSelectedSubcategoryId,
      setNomineeName,
      setNomineeTitle,
      setNomineeOrganization,
      setNomineeBio,
      setStep,
    });
    setShowDraftBanner(false);
    toast.success("Draft restored");
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftBanner(false);
    toast.success("Draft discarded");
  };

  // ---------------- FILE UPLOAD ----------------
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isPhoto = false,
  ) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];

    setUploading(true);
    try {
      let file_type: fileType;
      if (isPhoto) {
        file_type = "IMAGE";
      } else {
        file_type = "DOCUMENT";
      }
      // get presigned url
      const uploadUrl = await uploadApi.getPresignedUrl(
        accessToken,
        file.name,
        file.type,
        file.size.toString(),
        file_type,
      );
      // actual file upload
      await uploadApi.uploadFile(files[0], uploadUrl.signedUrl);

      // fetch public facing url
      const url = await uploadApi.getPublicUrl(accessToken, uploadUrl.path);
      console.log("public facin url is this", url);

      const uploaded: UploadedFile = {
        name: file.name,
        url,
        type: file.type,
        path: uploadUrl.path,
      };
      if (isPhoto) {
        setNomineePhoto(uploaded);
      } else setUploadedFiles((p) => [...p, uploaded]);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (file: UploadedFile) => {
    await uploadApi.deleteFile(accessToken, [file.path]);
    setUploadedFiles((f) => f.filter((x) => x.path !== file.path));
  };

  const removePhoto = async () => {
    if (!nomineePhoto) return;
    await uploadApi.deleteFile(accessToken, [nomineePhoto.path]);
    setNomineePhoto(null);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      // const season = await seasonApi.getActiveSeason();
      const nomination: Nomination = {
        fullName: nomineeName,
        phone,
        country,
        stateRegion,
        impactSummary,
        achievementDescription,
        linkedInProfile: linkedinProfile,
        website,
        profileImage: nomineePhoto ? nomineePhoto.url : null,
        categoryId: selectedCategoryId,
        subCategoryId: selectedSubcategoryId,
        accountType,
        evidenceUrl: uploadedFiles ? uploadedFiles.map((f) => f.url) : [""],
        email,
        yearOfNomination: APPLICATION_YEAR,
      };

      await nominationApi.createNomination(accessToken, nomination);

      clearDraft();
      toast.success("Nomination submitted");
      navigate("/dashboard/nominations");
    } catch (err) {
      console.log(err);
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI RENDER ----------------
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container px-6">
          {/* Breadcrumb */}
          <div className="py-2 border-b border-border/50">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to="/"
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Home className="h-3.5 w-3.5" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3.5 w-3.5" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">
                    Nominate
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Main Header */}
          <div className="flex h-16 items-center gap-4">
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
                <h1 className="font-display text-lg font-bold">
                  Submit Nomination
                </h1>
                <p className="text-xs text-muted-foreground">
                  {currentEdition.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl px-6 py-8">
        <StageGate
          action="nominations"
          fallback={<StageLocked action="nominations" />}
        >
          {/* Draft Recovery Banner */}
          {hasDraft && showDraftBanner && (
            <Alert className="mb-6 border-primary/50 bg-primary/5">
              <RotateCcw className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  You have an unsaved draft from{" "}
                  <strong>
                    {draftDate
                      ? formatDistanceToNow(draftDate, { addSuffix: true })
                      : "earlier"}
                  </strong>
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDiscardDraft}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Discard
                  </Button>
                  <Button size="sm" onClick={handleRestoreDraft}>
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Restore Draft
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

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
                  <CardTitle className="font-display">
                    Select Category
                  </CardTitle>
                  <CardDescription>
                    Choose from {categories.length} official NESA award
                    categories across Africa and Nigeria.{" "}
                    <Link
                      to="/categories"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Browse all categories{" "}
                      <ArrowLeft className="h-3 w-3 rotate-180" />
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Award Category</Label>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={setSelectedCategoryId}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => {
                          const badge = getScopeBadge(cat.scope);
                          return (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <span>{cat.title}</span>
                                <Badge
                                  variant="outline"
                                  className="ml-auto text-xs"
                                  style={{
                                    borderColor: badge.color,
                                    color: badge.color,
                                  }}
                                >
                                  {badge.label}
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Info Card */}
                  {selectedCategory && (
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">
                            {selectedCategory.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedCategory.description}
                          </p>
                        </div>
                        {getScopeBadge(scope) && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                            style={{
                              backgroundColor: `${getScopeBadge(scope).color}20`,
                              color: getScopeBadge(scope).color,
                            }}
                          >
                            {/* {getScopeIcon(scope)} */}
                            {getScopeBadge(scope).label}
                          </Badge>
                        )}
                      </div>

                      {/* <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Selection Method:
                          </span>
                          <p className="font-medium">
                            {selectedCategory.selectionMethod}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Competition:
                          </span>
                          <p className="font-medium">
                            {isCompetitive ? (
                              <span className="text-amber-600">
                                Competitive
                              </span>
                            ) : (
                              <span className="text-emerald-600">
                                Non-Competitive
                              </span>
                            )}
                          </p>
                        </div>
                      </div> */}

                      {/* <div>
                        <span className="text-sm text-muted-foreground">
                          Eligible Tiers:
                        </span>
                        <div className="mt-1">
                          {renderTierBadges(selectedCategory)}
                        </div>
                      </div> */}

                      {/* {tierPath.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            Award Progression Path:
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {tierPath.map((tier, index) => (
                              <div
                                key={tier}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: TIER_INFO[tier].bgColor,
                                    color: TIER_INFO[tier].color,
                                    border: `1px solid ${TIER_INFO[tier].borderColor}`,
                                  }}
                                >
                                  {TIER_INFO[tier].name}
                                </div>
                                {index < tierPath.length - 1 && (
                                  <span className="text-muted-foreground">
                                    →
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )} */}
                    </div>
                  )}

                  {selectedCategoryId && dbSubcategories.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">
                        Subcategory
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({dbSubcategories.length} available)
                        </span>
                      </Label>
                      <Select
                        value={selectedSubcategoryId}
                        onValueChange={setSelectedSubcategoryId}
                      >
                        <SelectTrigger id="subcategory">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {dbSubcategories.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedCategoryId && dbSubcategories.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No subcategories found for this category.</p>
                      <p className="text-sm">
                        Please contact support or try another category.
                      </p>
                    </div>
                  )}

                  {/* Existing Nominees Section */}
                  {selectedSubcategoryId && (
                    <ExistingNomineesSection
                      subcategoryId={selectedSubcategoryId}
                      subcategoryName={
                        dbSubcategories.find(
                          (s) => s.id === selectedSubcategoryId,
                        )?.title
                      }
                      categoryName={selectedCategory?.title}
                    />
                  )}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={!selectedCategoryId}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      // disabled={!canProceedToStep2}
                    >
                      Continue
                    </Button>
                  </div>
                  {lastSaved && (
                    <p className="text-xs text-muted-foreground text-right">
                      Last saved{" "}
                      {formatDistanceToNow(lastSaved, { addSuffix: true })}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Nominee Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">
                    Nominee Details
                  </CardTitle>
                  <CardDescription>
                    Provide information about the person or organization you're
                    nominating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Category Summary */}
                  {selectedCategory && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
                      <div className="flex items-center gap-2">
                        {/* {getScopeIcon(scope)} */}
                        <span className="font-medium">
                          {selectedCategory.title}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {
                          dbSubcategories.find(
                            (s) => s.id === selectedSubcategoryId,
                          )?.title
                        }
                      </span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>
                      Account Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={accountType}
                      onValueChange={(v) => setAccountType(v as NominationType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NominationType.INDIVIDUAL}>
                          Individual
                        </SelectItem>
                        <SelectItem value={NominationType.ORGANIZATION}>
                          Organization
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nominee@example.com"
                      required
                    />
                  </div>

                  {/*phone*/}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 801 234 5678"
                    />
                  </div>

                  {/*country and state*/}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        Country <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        State / Region{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        placeholder="State or Region"
                        required
                      />
                    </div>
                  </div>

                  {/*linkedin and website*/}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>LinkedIn Profile (Optional)</Label>
                      <Input
                        value={linkedinProfile}
                        onChange={(e) => setLinkedinProfile(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Website (Optional)</Label>
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

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
                          onChange={(e) =>
                            setNomineeOrganization(e.target.value)
                          }
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

                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSaveDraft}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        // disabled={!canProceedToStep3}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Evidence & Justification */}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">
                    Evidence & Justification
                  </CardTitle>
                  <CardDescription>
                    Provide supporting evidence and explain why this nominee
                    deserves recognition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>
                      Impact Summary <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      value={impactSummary}
                      onChange={(e) => setImpactSummary(e.target.value)}
                      placeholder="Summarize the nominee’s impact..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Achievement Description{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      value={achievementDescription}
                      onChange={(e) =>
                        setAchievementDescription(e.target.value)
                      }
                      placeholder="Describe key achievements and milestones..."
                      rows={5}
                      required
                    />
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
                              <span className="text-sm font-medium">
                                {file.name}
                              </span>
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
                      <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Category:</span>
                        <div className="text-right">
                          <span className="font-medium">
                            {selectedCategory?.title}
                          </span>
                          {getScopeBadge(scope) && (
                            <Badge
                              variant="outline"
                              className="ml-2 text-xs"
                              style={{
                                borderColor: getScopeBadge(scope).color,
                                color: getScopeBadge(scope).color,
                              }}
                            >
                              {getScopeBadge(scope).label}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Subcategory:
                        </span>
                        <span className="font-medium">
                          {
                            dbSubcategories.find(
                              (s) => s.id === selectedSubcategoryId,
                            )?.title
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nominee:</span>
                        <span className="font-medium">{nomineeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Eligible Tiers:
                        </span>
                        {/* <span className="font-medium">
                          {tierPath
                            .map((t) => TIER_INFO[t].shortName)
                            .join(" → ")}
                        </span> */}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Evidence Files:
                        </span>
                        <span className="font-medium">
                          {uploadedFiles.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSaveDraft}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowConfirmDialog(true)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Review & Submit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Review Your Nomination
                </DialogTitle>
                <DialogDescription>
                  Please review all details before submitting. This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6">
                  {/* Category Info */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Category
                    </h4>
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {selectedCategory?.title}
                        </span>
                        {getScopeBadge(scope) && (
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: getScopeBadge(scope).color,
                              color: getScopeBadge(scope).color,
                            }}
                          >
                            {getScopeBadge(scope).label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {
                          dbSubcategories.find(
                            (s) => s.id === selectedSubcategoryId,
                          )?.title
                        }
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                          Tier Path:
                        </span>
                        {/* <span className="font-medium">
                          {tierPath
                            .map((t) => TIER_INFO[t].shortName)
                            .join(" → ")}
                        </span> */}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Nominee Info */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Nominee
                    </h4>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="flex items-start gap-4">
                        {nomineePhoto ? (
                          <img
                            src={nomineePhoto.url}
                            alt={nomineeName}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold text-lg">{nomineeName}</p>
                          {nomineeTitle && (
                            <p className="text-sm text-muted-foreground">
                              {nomineeTitle}
                            </p>
                          )}
                          {nomineeOrganization && (
                            <p className="text-sm flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {nomineeOrganization}
                            </p>
                          )}
                        </div>
                      </div>
                      {nomineeBio && (
                        <p className="mt-3 text-sm text-muted-foreground border-t pt-3">
                          {nomineeBio}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Justification */}
                  {/* <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Justification
                    </h4>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {justification}
                      </p>
                    </div>
                  </div> */}

                  {/* Evidence Files */}
                  {uploadedFiles.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Supporting Evidence ({uploadedFiles.length} files)
                        </h4>
                        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                          {uploadedFiles.map((file) => (
                            <div
                              key={file.path}
                              className="flex items-center gap-2 text-sm"
                            >
                              {file.type.startsWith("image/") ? (
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={submitting}
                >
                  Go Back & Edit
                </Button>
                <Button
                  onClick={async () => {
                    await handleSubmit();
                    // Dialog will close on successful navigation
                  }}
                  disabled={submitting}
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <FileCheck className="mr-2 h-4 w-4" />
                      Confirm & Submit
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </StageGate>
      </main>
    </div>
  );
}
