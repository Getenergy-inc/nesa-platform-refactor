import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertCircle,
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
  getScopeBadge,
  getTierPath,
  TIER_INFO,
  CategoryScope,
  AwardTier,
} from "@/config/nesaCategories";
import { useNominationDraft } from "@/hooks/useNominationDraft";
import { formatDistanceToNow } from "date-fns";
import { ExistingNomineesSection } from "@/components/nesa/ExistingNomineesSection";

// 🔹 API SERVICES
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

// Map tier tab values to display tier
type NominateTier = "blue-garnet" | "platinum" | "gold-special" | "lifetime";

const TIER_TABS: {
  value: NominateTier;
  label: string;
  icon: string;
  disabled?: boolean;
}[] = [
  { value: "blue-garnet", label: "Blue Garnet", icon: "🏆" },
  { value: "platinum", label: "Platinum", icon: "💎" },
  { value: "gold-special", label: "Gold Special (2025)", icon: "🥇" },
  { value: "lifetime", label: "Lifetime", icon: "🏛", disabled: true },
];

const SCOPE_OPTIONS: { value: CategoryScope; label: string }[] = [
  { value: "AFRICA_REGIONAL", label: "Africa Regional" },
  { value: "NIGERIA", label: "Nigeria" },
  { value: "INTERNATIONAL", label: "International" },
  { value: "ICON", label: "Icon" },
];

/**
 * Get the tier for a category based on its ID/slug matching with NESA_CATEGORIES config
 */
function getCategoryTier(
  categoryId: string,
  categories: Category[],
): NominateTier | null {
  // Try to find matching category in NESA_CATEGORIES by ID or generate slug from title
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  // Create a slug from the title to try matching with NESA_CATEGORIES
  const slug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Find matching NESA category by slug or approximate match
  const nesaCategory = NESA_CATEGORIES.find(
    (cat) =>
      cat.slug === slug ||
      cat.name.toLowerCase() === category.title.toLowerCase(),
  );

  if (!nesaCategory) {
    // Default tier based on scope if no match found
    if (category.scope === "ICON") return "lifetime";
    if (category.scope === "INTERNATIONAL") return "platinum";
    return "blue-garnet";
  }

  // Determine tier from NESA category
  if (nesaCategory.tierApplicability.goldSpecial) return "gold-special";
  if (nesaCategory.tierApplicability.icon) return "lifetime";
  if (nesaCategory.tierApplicability.blueGarnet) return "blue-garnet";
  return "platinum";
}

/**
 * Group categories by tier
 */
function groupCategoriesByTier(
  categories: Category[],
): Record<NominateTier, Category[]> {
  const grouped: Record<NominateTier, Category[]> = {
    "blue-garnet": [],
    platinum: [],
    "gold-special": [],
    lifetime: [],
  };

  categories.forEach((cat) => {
    const tier = getCategoryTier(cat.id, categories);
    if (tier && grouped[tier]) {
      grouped[tier].push(cat);
    } else {
      // Default to blue-garnet if tier can't be determined
      grouped["blue-garnet"].push(cat);
    }
  });

  return grouped;
}

export default function Nominate() {
  const { user, loading: authLoading, accessToken } = useAuth();
  const { currentEdition } = useSeason();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasDraft, draftDate, saveDraft, loadDraft, clearDraft } =
    useNominationDraft();

  // Tier/scope/category state
  const [selectedTier, setSelectedTier] = useState<NominateTier>("blue-garnet");
  const [selectedScope, setSelectedScope] = useState<CategoryScope | "">("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("");
  const [preselectionError, setPreselectionError] = useState<string>("");

  // Form state
  const [dbSubcategories, setDbSubcategories] = useState<SubCategory[]>([]);
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
  const [accountType, setAccountType] = useState<NominationType>(
    NominationType.INDIVIDUAL,
  );
  const [phone, setPhone] = useState<string | "">("");
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [website, setWebsite] = useState("");
  const [impactSummary, setImpactSummary] = useState("");
  const [achievementDescription, setAchievementDescription] = useState("");
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesByTier, setCategoriesByTier] = useState<
    Record<NominateTier, Category[]>
  >({
    "blue-garnet": [],
    platinum: [],
    "gold-special": [],
    lifetime: [],
  });

  // Load categories from backend
  useEffect(() => {
    if (!accessToken) return;

    categoryApi
      .fetchAllCategories(accessToken)
      .then((fetchedCategories) => {
        setCategories(fetchedCategories);
        // Group categories by tier
        const grouped = groupCategoriesByTier(fetchedCategories);
        setCategoriesByTier(grouped);
      })
      .catch(() => toast.error("Failed to load categories"));
  }, [accessToken]);

  // URL preselection on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const tierParam = searchParams.get("tier");

    if (categoryParam && categories.length > 0) {
      // Try to find category by ID or title match
      const category = categories.find(
        (c) =>
          c.id === categoryParam ||
          c.title.toLowerCase().includes(categoryParam.toLowerCase()),
      );

      if (category) {
        const tier = getCategoryTier(category.id, categories);
        setSelectedTier(tier || "blue-garnet");
        setSelectedScope(category.scope);
        setSelectedCategoryId(category.id);
        setPreselectionError("");
      } else {
        setPreselectionError(
          `Category "${categoryParam}" was not found. Please select manually.`,
        );
      }
    } else if (tierParam) {
      const validTiers: NominateTier[] = [
        "blue-garnet",
        "platinum",
        "gold-special",
      ];
      if (validTiers.includes(tierParam as NominateTier)) {
        setSelectedTier(tierParam as NominateTier);
      }
    }
  }, [searchParams, categories]);

  // Available scopes for current tier based on actual categories in that tier
  const availableScopes = useMemo(() => {
    const tierCategories = categoriesByTier[selectedTier] || [];
    const scopes = new Set(tierCategories.map((c) => c.scope));
    return SCOPE_OPTIONS.filter((s) => scopes.has(s.value)).map((s) => s.value);
  }, [selectedTier, categoriesByTier]);

  // Categories filtered by tier + scope
  const filteredCategories = useMemo(() => {
    const tierCategories = categoriesByTier[selectedTier] || [];
    if (!selectedScope) return tierCategories;
    return tierCategories.filter((cat) => cat.scope === selectedScope);
  }, [selectedTier, selectedScope, categoriesByTier]);

  // Find selected category
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === selectedCategoryId),
    [selectedCategoryId, categories],
  );

  // Get tier path for selected category (for display)
  const tierPath = useMemo(() => {
    if (!selectedCategory) return [];
    const tier = getCategoryTier(selectedCategory.id, categories);
    return tier ? [tier] : [];
  }, [selectedCategory, categories]);

  // Reset scope when tier changes (if current scope not valid)
  useEffect(() => {
    if (selectedScope && !availableScopes.includes(selectedScope)) {
      setSelectedScope("");
      setSelectedCategoryId("");
      setSelectedSubcategoryId("");
    }
  }, [selectedTier, availableScopes, selectedScope]);

  // Reset category when scope changes
  const handleScopeChange = (scope: CategoryScope) => {
    setSelectedScope(scope);
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  };

  // Reset subcategory when category changes
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubcategoryId("");
  };

  // Handle tier change
  const handleTierChange = (tier: string) => {
    setSelectedTier(tier as NominateTier);
    setSelectedScope("");
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  };

  // Load subcategories from database when category changes
  useEffect(() => {
    if (!selectedCategory?.id || !accessToken) {
      setDbSubcategories([]);
      return;
    }

    categoryApi
      .fetchSubcategories(accessToken, selectedCategory.id)
      .then(setDbSubcategories)
      .catch(() => toast.error("Failed to load subcategories"));
  }, [selectedCategory, accessToken]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to submit a nomination");
      navigate("/login", { state: { from: "/nominate" } });
    }
  }, [authLoading, user, navigate]);

  // Draft handlers
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

  const handleRestoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      setSelectedCategoryId(draft.selectedCategoryId);
      setSelectedSubcategoryId(draft.selectedSubcategoryId);
      setNomineeName(draft.nomineeName);
      setNomineeTitle(draft.nomineeTitle);
      setNomineeOrganization(draft.nomineeOrganization);
      setNomineeBio(draft.nomineeBio);
      setImpactSummary(draft.impactSummary);
      setAchievementDescription(draft.achievementDescription);
      setStep(draft.step);
      setAccountType(draft.accountType);
      setCountry(draft.country);
      setEmail(draft.email);
      setLinkedinProfile(draft.linkedinProfile);
      setWebsite(draft.website);
      setPhone(draft.phone);
      setStateRegion(draft.stateRegion);

      // Infer tier/scope from category
      const cat = categories.find((c) => c.id === draft.selectedCategoryId);
      if (cat) {
        const tier = getCategoryTier(cat.id, categories);
        setSelectedTier(tier || "blue-garnet");
        setSelectedScope(cat.scope);
      }
      setShowDraftBanner(false);
      toast.success("Draft restored successfully");
    }
  }, [loadDraft, categories]);

  const handleDiscardDraft = useCallback(() => {
    clearDraft();
    setShowDraftBanner(false);
    toast.success("Draft discarded");
  }, [clearDraft]);

  // File upload handlers
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isPhoto = false,
  ) => {
    const files = e.target.files;
    if (!files || !accessToken) return;
    const file = files[0];

    setUploading(true);
    try {
      const file_type: fileType = isPhoto ? "IMAGE" : "DOCUMENT";

      // Get presigned url
      const uploadUrl = await uploadApi.getPresignedUrl(
        accessToken,
        file.name,
        file.type,
        file.size.toString(),
        file_type,
      );

      // Actual file upload
      await uploadApi.uploadFile(file, uploadUrl.signedUrl);

      // Fetch public facing url
      const url = await uploadApi.getPublicUrl(accessToken, uploadUrl.path);

      const uploaded: UploadedFile = {
        name: file.name,
        url,
        type: file.type,
        path: uploadUrl.path,
      };

      if (isPhoto) {
        setNomineePhoto(uploaded);
      } else {
        setUploadedFiles((p) => [...p, uploaded]);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (file: UploadedFile) => {
    if (!accessToken) return;
    await uploadApi.deleteFile(accessToken, [file.path]);
    setUploadedFiles((f) => f.filter((x) => x.path !== file.path));
  };

  const removePhoto = async () => {
    if (!nomineePhoto || !accessToken) return;
    await uploadApi.deleteFile(accessToken, [nomineePhoto.path]);
    setNomineePhoto(null);
  };

  const handleSubmit = async () => {
    if (!user || !accessToken) return;

    setSubmitting(true);
    try {
      const nomination: Nomination = {
        fullName: nomineeName,
        phone: phone || null,
        country,
        stateRegion,
        impactSummary,
        achievementDescription,
        linkedInProfile: linkedinProfile || null,
        website: website || null,
        profileImage: nomineePhoto ? nomineePhoto.url : null,
        categoryId: selectedCategoryId,
        subCategoryId: selectedSubcategoryId,
        accountType,
        evidenceUrl: uploadedFiles.map((f) => f.url),
        email,
        yearOfNomination: APPLICATION_YEAR,
      };

      await nominationApi.createNomination(accessToken, nomination);

      clearDraft();
      setShowConfirmDialog(false);
      toast.success("Nomination submitted successfully!");
      navigate("/dashboard/nominations");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToStep2 = selectedCategoryId && selectedSubcategoryId;
  const canProceedToStep3 = nomineeName.trim().length > 0;

  const scopeBadge = selectedCategory
    ? getScopeBadge(selectedCategory.scope)
    : null;

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
                  {currentEdition?.name || "NESA Awards"}
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

          {/* Preselection Error */}
          {preselectionError && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{preselectionError}</AlertDescription>
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">
                    Select Category
                  </CardTitle>
                  <CardDescription>
                    Choose your award tier, scope, and category.{" "}
                    <Link
                      to="/categories"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Browse all categories <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 1. Choose Tier */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Award Tier</Label>
                    <Tabs value={selectedTier} onValueChange={handleTierChange}>
                      <TabsList className="w-full grid grid-cols-4">
                        {TIER_TABS.map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            disabled={tab.disabled}
                            className="text-xs sm:text-sm"
                          >
                            <span className="mr-1">{tab.icon}</span>
                            <span className="hidden sm:inline">
                              {tab.label}
                            </span>
                            <span className="sm:hidden">
                              {tab.label.split(" ")[0]}
                            </span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                    {selectedTier === "lifetime" && (
                      <p className="text-xs text-muted-foreground">
                        Lifetime nominations are by invitation only.
                      </p>
                    )}

                    {/* Show count of categories in this tier */}
                    <p className="text-xs text-muted-foreground">
                      {categoriesByTier[selectedTier]?.length || 0} categories
                      available
                    </p>
                  </div>

                  {/* 2. Choose Scope */}
                  {availableScopes.length > 0 &&
                    selectedTier !== "lifetime" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Scope</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableScopes.map((scope) => {
                            const badge = getScopeBadge(scope);
                            const isSelected = selectedScope === scope;
                            return (
                              <Button
                                key={scope}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleScopeChange(scope)}
                                className={isSelected ? "" : ""}
                              >
                                {scope === "AFRICA_REGIONAL" && (
                                  <Globe className="h-3.5 w-3.5 mr-1" />
                                )}
                                {scope === "NIGERIA" && (
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                )}
                                {scope === "INTERNATIONAL" && (
                                  <Globe className="h-3.5 w-3.5 mr-1" />
                                )}
                                {scope === "ICON" && (
                                  <Star className="h-3.5 w-3.5 mr-1" />
                                )}
                                {badge.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* 3. Choose Category */}
                  {(selectedScope || selectedTier !== "lifetime") &&
                    filteredCategories.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">
                          Category
                        </Label>
                        <Select
                          value={selectedCategoryId}
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredCategories.map((cat) => {
                              const badge = getScopeBadge(cat.scope);
                              return (
                                <SelectItem key={cat.id} value={cat.id}>
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <span>{cat.title}</span>
                                    <Badge
                                      variant="outline"
                                      className="ml-auto text-xs shrink-0"
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
                    )}

                  {/* Show message if no categories in selected tier/scope */}
                  {selectedTier !== "lifetime" &&
                    filteredCategories.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No categories found for this selection.</p>
                        <p className="text-sm">
                          Please try another tier or scope.
                        </p>
                      </div>
                    )}

                  {/* Category Info Card */}
                  {selectedCategory && (
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">
                            {selectedCategory.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedCategory.description}
                          </p>
                        </div>
                        {scopeBadge && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 shrink-0 ml-2"
                          >
                            {scopeBadge.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tierPath.map((tier) => (
                          <Badge
                            key={tier}
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor:
                                TIER_INFO[tier as AwardTier]?.color || "#888",
                              color:
                                TIER_INFO[tier as AwardTier]?.color || "#888",
                            }}
                          >
                            {TIER_INFO[tier as AwardTier]?.shortName || tier}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Choose Subcategory */}
                  {selectedCategoryId && dbSubcategories.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Subcategory
                        <span className="ml-2 text-xs text-muted-foreground font-normal">
                          ({dbSubcategories.length} available)
                        </span>
                      </Label>
                      <Select
                        value={selectedSubcategoryId}
                        onValueChange={setSelectedSubcategoryId}
                      >
                        <SelectTrigger>
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

                  {/* Existing Nominees */}
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
                      disabled={!canProceedToStep2}
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
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor:
                              TIER_INFO[selectedTier as AwardTier]?.color ||
                              "#888",
                            color:
                              TIER_INFO[selectedTier as AwardTier]?.color ||
                              "#888",
                          }}
                        >
                          {TIER_INFO[selectedTier as AwardTier]?.shortName ||
                            selectedTier}
                        </Badge>
                        <span className="font-medium text-sm">
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
                        disabled={!canProceedToStep3}
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
                      placeholder="Summarize the nominee's impact..."
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
                        <span className="text-muted-foreground">Tier:</span>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor:
                              TIER_INFO[selectedTier as AwardTier]?.color ||
                              "#888",
                            color:
                              TIER_INFO[selectedTier as AwardTier]?.color ||
                              "#888",
                          }}
                        >
                          {TIER_INFO[selectedTier as AwardTier]?.shortName ||
                            selectedTier}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium text-right">
                          {selectedCategory?.title}
                        </span>
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
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Category
                    </h4>
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {selectedCategory?.title}
                        </span>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor:
                              TIER_INFO[selectedTier as AwardTier]?.color ||
                              "#888",
                            color:
                              TIER_INFO[selectedTier as AwardTier]?.color ||
                              "#888",
                          }}
                        >
                          {TIER_INFO[selectedTier as AwardTier]?.shortName ||
                            selectedTier}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {
                          dbSubcategories.find(
                            (s) => s.id === selectedSubcategoryId,
                          )?.title
                        }
                      </p>
                    </div>
                  </div>

                  <Separator />

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

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Impact Summary
                    </h4>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {impactSummary}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Achievement Description
                    </h4>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {achievementDescription}
                      </p>
                    </div>
                  </div>

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
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4" />
                      Submit Nomination
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
