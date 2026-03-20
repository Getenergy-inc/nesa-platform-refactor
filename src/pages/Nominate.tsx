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
  ChevronLeft,
  Briefcase,
  Medal,
  Crown,
  Sparkles,
  Target,
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
type BackendTier =
  | "AFRICA_ICON_BLUE_GARNET"
  | "BLUE_GARNET_AND_GOLD_CERTIFICATE"
  | "PLATINUM_CERTIFICATE"
  | "GOLD_CERTIFICATE"
  | "GOLD_SPECIAL";

// Mapping object
const tierMapping: Record<BackendTier, NominateTier> = {
  AFRICA_ICON_BLUE_GARNET: "lifetime",
  BLUE_GARNET_AND_GOLD_CERTIFICATE: "blue-garnet",
  PLATINUM_CERTIFICATE: "platinum",
  GOLD_CERTIFICATE: "blue-garnet",
  GOLD_SPECIAL: "gold-special",
};

const reverseTierMapping: Record<NominateTier, BackendTier> = {
  lifetime: "AFRICA_ICON_BLUE_GARNET",
  "blue-garnet": "BLUE_GARNET_AND_GOLD_CERTIFICATE",
  platinum: "PLATINUM_CERTIFICATE",
  "gold-special": "GOLD_SPECIAL",
};

// Enhanced tier display configuration
const TIER_DISPLAY_CONFIG = {
  "blue-garnet": {
    icon: Medal,
    color: "#1E4A6F",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-500",
    textColor: "text-blue-400",
    fullName: "Blue Garnet Award",
    description: "Excellence in leadership and innovation",
  },
  platinum: {
    icon: Trophy,
    color: "#64748B",
    bgColor: "bg-slate-700/20",
    borderColor: "border-slate-400",
    textColor: "text-slate-300",
    fullName: "Platinum Certificate",
    description: "Outstanding achievement and impact",
  },
  "gold-special": {
    icon: Sparkles,
    color: "#FBBF24",
    bgColor: "bg-amber-900/20",
    borderColor: "border-amber-500",
    textColor: "text-amber-400",
    fullName: "Gold Special (2025)",
    description: "Special recognition for exceptional merit",
  },
  lifetime: {
    icon: Crown,
    color: "#9F7AEA",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-400",
    textColor: "text-purple-400",
    fullName: "Lifetime Achievement",
    description: "Iconic contributions and legacy",
  },
};

const TIER_TABS: {
  value: NominateTier;
  label: string;
  fullLabel: string;
  icon: any;
  disabled?: boolean;
}[] = [
  {
    value: "blue-garnet",
    label: "Blue Garnet",
    fullLabel: "Blue Garnet Award",
    icon: Medal,
  },
  {
    value: "platinum",
    label: "Platinum",
    fullLabel: "Platinum Certificate",
    icon: Trophy,
  },
  {
    value: "gold-special",
    label: "Gold Special",
    fullLabel: "Gold Special (2025)",
    icon: Sparkles,
  },
  {
    value: "lifetime",
    label: "Lifetime",
    fullLabel: "Lifetime Achievement",
    icon: Crown,
    disabled: true,
  },
];

const SCOPE_OPTIONS: { value: CategoryScope; label: string; icon: any }[] = [
  { value: "AFRICA_REGIONAL", label: "Africa Regional", icon: Globe },
  { value: "NIGERIA", label: "Nigeria", icon: MapPin },
  { value: "INTERNATIONAL", label: "International", icon: Globe },
  { value: "ICON", label: "Icon", icon: Star },
];

/**
 * Get the tier for a category based on its ID/slug matching with NESA_CATEGORIES config
 */
function getCategoryTier(
  categoryId: string,
  categories: Category[],
): NominateTier | null {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  const slug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const nesaCategory = NESA_CATEGORIES.find(
    (cat) =>
      cat.slug === slug ||
      cat.name.toLowerCase() === category.title.toLowerCase(),
  );

  if (!nesaCategory) {
    if (category.scope === "ICON") return "lifetime";
    if (category.scope === "INTERNATIONAL") return "platinum";
    return "blue-garnet";
  }

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
    const tier = tierMapping[cat.awardType];
    if (tier && grouped[tier]) {
      grouped[tier].push(cat);
    } else {
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
  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const tier = searchParams.get("tier");
  const actualTier = tierMapping[tier];
  const { hasDraft, draftDate, saveDraft, loadDraft, clearDraft } =
    useNominationDraft();

  // Tier/scope/category state
  const [selectedTier, setSelectedTier] = useState<NominateTier>(
    actualTier || "blue-garnet",
  );
  const [selectedScope, setSelectedScope] = useState<CategoryScope | "">("");
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>(categoryId);
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>(subCategoryId);
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
    categoryApi
      .fetchAllCategories()
      .then((fetchedCategories) => {
        setCategories(fetchedCategories);
        const grouped = groupCategoriesByTier(fetchedCategories);
        setCategoriesByTier(grouped);
      })
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // URL preselection on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const tierParam = searchParams.get("tier");

    if (categoryParam && categories.length > 0) {
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

  // Available scopes for current tier
  const availableScopes = useMemo(() => {
    const tierCategories = categoriesByTier[selectedTier] || [];
    const scopes = new Set(tierCategories.map((c) => c.scope));
    return SCOPE_OPTIONS.filter((s) => scopes.has(s.value));
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

  // Get tier path for selected category
  const tierPath = useMemo(() => {
    if (!selectedCategory) return [];
    const tier = getCategoryTier(selectedCategory.id, categories);
    return tier ? [tier] : [];
  }, [selectedCategory, categories]);

  // Reset scope when tier changes
  useEffect(() => {
    if (
      selectedScope &&
      !availableScopes.some((s) => s.value === selectedScope)
    ) {
      setSelectedScope("");
      setSelectedCategoryId("");
      setSelectedSubcategoryId("");
    }
  }, [selectedTier, availableScopes, selectedScope]);

  const handleScopeChange = (scope: CategoryScope) => {
    setSelectedScope(scope);
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubcategoryId("");
  };

  const handleTierChange = (tier: string) => {
    setSelectedTier(tier as NominateTier);
    setSelectedScope("");
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  };

  // Load subcategories from database
  useEffect(() => {
    if (!selectedCategory?.id) {
      setDbSubcategories([]);
      return;
    }

    categoryApi
      .fetchSubcategories(selectedCategory.id)
      .then(setDbSubcategories)
      .catch(() => toast.error("Failed to load subcategories"));
  }, [selectedCategory]);

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

      const uploadUrl = await uploadApi.getPresignedUrl(
        accessToken,
        file.name,
        file.type,
        file.size.toString(),
        file_type,
      );

      await uploadApi.uploadFile(file, uploadUrl.signedUrl);

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
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
          <p className="mt-2 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  const SelectedTierIcon = selectedTier
    ? TIER_DISPLAY_CONFIG[selectedTier].icon
    : Award;

  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Header */}
      <header className="border-b border-gold/10 bg-[hsl(30_8%_8%)] sticky top-0 z-10">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="hidden sm:block py-2 border-b border-gold/10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to="/"
                      className="flex items-center gap-1 text-white/50 hover:text-gold text-sm"
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
                  <BreadcrumbPage className="font-medium text-sm">
                    Nominate
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>

            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gold/10 shrink-0">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-base sm:text-lg font-bold text-white truncate">
                  Submit Nomination
                </h1>
                <p className="text-xs text-white/50 truncate">
                  {currentEdition?.name || "NESA Awards 2025"}
                </p>
              </div>
            </div>

            {/* Mobile step indicator */}
            <div className="sm:hidden flex items-center gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    step >= s ? "bg-gold" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <StageGate
          action="nominations"
          fallback={<StageLocked action="nominations" />}
        >
          {/* Draft Recovery Banner */}
          {hasDraft && showDraftBanner && (
            <Alert className="mb-4 sm:mb-6 border-primary/50 bg-primary/5 p-3 sm:p-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                <span className="text-xs sm:text-sm">
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
                    className="h-8 text-xs sm:h-9"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRestoreDraft}
                    className="h-8 text-xs sm:h-9"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Restore
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Preselection Error */}
          {preselectionError && (
            <Alert className="mb-4 sm:mb-6 border-destructive/50 bg-destructive/5 p-3 sm:p-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <AlertDescription className="text-xs sm:text-sm">
                {preselectionError}
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Steps */}
          <div className="hidden sm:flex sm:mb-8">
            <div className="flex items-center justify-between w-full">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                      step >= s
                        ? "bg-gold text-charcoal"
                        : "bg-charcoal-light text-white/40 border border-gold/20"
                    }`}
                  >
                    {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`mx-2 h-1 w-16 md:w-24 lg:w-32 rounded-full transition-colors ${
                        step > s ? "bg-gold" : "bg-charcoal-light"
                      }`}
                    />
                  )}
                </div>
              ))}
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
              <Card className="border-gold/10 bg-charcoal-light/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="font-display text-lg sm:text-xl flex items-center gap-2">
                    <Target className="h-5 w-5 text-gold" />
                    Select Category
                  </CardTitle>
                  <CardDescription className="text-sm text-white/60">
                    Choose your award tier, scope, and category.{" "}
                    <Link
                      to="/categories"
                      className="text-gold hover:underline inline-flex items-center gap-1"
                    >
                      Browse all categories
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-6">
                  {/* 1. Choose Tier */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Medal className="h-4 w-4 text-gold" />
                      Award Tier
                    </Label>
                    <Tabs value={selectedTier} onValueChange={handleTierChange}>
                      <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 h-auto p-1 gap-1">
                        {TIER_TABS.map((tab) => {
                          const Icon = tab.icon;
                          const isSelected = selectedTier === tab.value;
                          const config = TIER_DISPLAY_CONFIG[tab.value];

                          return (
                            <TabsTrigger
                              key={tab.value}
                              value={tab.value}
                              disabled={tab.disabled}
                              className={`flex-1 py-3 px-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold relative overflow-hidden ${
                                tab.disabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <Icon
                                  className={`h-5 w-5 ${
                                    isSelected ? "text-gold" : config.textColor
                                  }`}
                                />
                                <span className="text-xs font-medium">
                                  {tab.label}
                                </span>
                                <span className="text-[10px] text-white/40 hidden sm:block">
                                  {tab.fullLabel}
                                </span>
                              </div>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </Tabs>

                    {/* Tier Description */}
                    {selectedTier && TIER_DISPLAY_CONFIG[selectedTier] && (
                      <div
                        className={`mt-2 p-3 rounded-lg ${TIER_DISPLAY_CONFIG[selectedTier].bgColor} border ${TIER_DISPLAY_CONFIG[selectedTier].borderColor}`}
                      >
                        <div className="flex items-start gap-2">
                          <SelectedTierIcon
                            className={`h-4 w-4 ${TIER_DISPLAY_CONFIG[selectedTier].textColor} mt-0.5`}
                          />
                          <div>
                            <p
                              className={`text-xs sm:text-sm font-medium ${TIER_DISPLAY_CONFIG[selectedTier].textColor}`}
                            >
                              {TIER_DISPLAY_CONFIG[selectedTier].fullName}
                            </p>
                            <p className="text-xs text-white/60 mt-0.5">
                              {TIER_DISPLAY_CONFIG[selectedTier].description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-white/40">
                      {categoriesByTier[selectedTier]?.length || 0} categories
                      available in this tier
                    </p>
                  </div>

                  {/* 2. Choose Scope */}
                  {availableScopes.length > 0 &&
                    selectedTier !== "lifetime" && (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gold" />
                          Geographic Scope
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {availableScopes.map((scope) => {
                            const Icon = scope.icon;
                            const isSelected = selectedScope === scope.value;
                            const badge = getScopeBadge(scope.value);

                            return (
                              <Button
                                key={scope.value}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => handleScopeChange(scope.value)}
                                className={`h-auto py-3 px-2 flex-col items-center gap-1 ${
                                  isSelected
                                    ? "bg-gold text-charcoal hover:bg-gold/90"
                                    : ""
                                }`}
                              >
                                <Icon
                                  className={`h-4 w-4 ${
                                    isSelected ? "text-charcoal" : badge.color
                                  }`}
                                />
                                <span className="text-xs font-medium">
                                  {scope.label}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[8px] xs:text-[10px] px-1 py-0 h-4"
                                  style={{
                                    borderColor: badge.color,
                                    color: badge.color,
                                  }}
                                >
                                  {badge.label}
                                </Badge>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* 3. Choose Category */}
                  {(selectedScope || selectedTier !== "lifetime") &&
                    filteredCategories.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gold" />
                          Category
                        </Label>
                        <Select
                          value={selectedCategoryId}
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger className="w-full h-auto min-h-[40px]">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredCategories.map((cat) => {
                              const badge = getScopeBadge(cat.scope);
                              return (
                                <SelectItem key={cat.id} value={cat.id}>
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-1 py-1">
                                    <span className="text-xs sm:text-sm font-medium">
                                      {cat.title}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] xs:text-xs shrink-0"
                                        style={{
                                          borderColor: badge.color,
                                          color: badge.color,
                                        }}
                                      >
                                        {badge.label}
                                      </Badge>
                                      {cat.awardType && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] xs:text-xs shrink-0"
                                          style={{
                                            borderColor:
                                              TIER_DISPLAY_CONFIG[
                                                tierMapping[cat.awardType]
                                              ]?.color || "#888",
                                            color:
                                              TIER_DISPLAY_CONFIG[
                                                tierMapping[cat.awardType]
                                              ]?.color || "#888",
                                          }}
                                        >
                                          {tierMapping[cat.awardType]?.replace(
                                            "-",
                                            " ",
                                          )}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  {cat.description && (
                                    <p className="text-[10px] xs:text-xs text-white/40 mt-1 line-clamp-2">
                                      {cat.description}
                                    </p>
                                  )}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  {/* No categories message */}
                  {selectedTier !== "lifetime" &&
                    filteredCategories.length === 0 && (
                      <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gold/20">
                        <AlertCircle className="h-8 w-8 text-white/20 mx-auto mb-2" />
                        <p className="text-sm text-white/60">
                          No categories found
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          Please try another tier or scope
                        </p>
                      </div>
                    )}

                  {/* Category Info Card */}
                  {selectedCategory && (
                    <div className="rounded-lg border border-gold/10 bg-charcoal-light/30 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm sm:text-base">
                              {selectedCategory.title}
                            </h4>
                            {scopeBadge && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] xs:text-xs"
                              >
                                {scopeBadge.label}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-white/60">
                            {selectedCategory.description}
                          </p>
                        </div>
                      </div>

                      {/* Tier Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {tierPath.map((tier) => {
                          const TierIcon = TIER_DISPLAY_CONFIG[tier].icon;
                          return (
                            <Badge
                              key={tier}
                              variant="outline"
                              className={`flex items-center gap-1 text-[10px] xs:text-xs ${TIER_DISPLAY_CONFIG[tier].bgColor} ${TIER_DISPLAY_CONFIG[tier].borderColor}`}
                              style={{
                                borderColor: TIER_DISPLAY_CONFIG[tier].color,
                                color: TIER_DISPLAY_CONFIG[tier].color,
                              }}
                            >
                              <TierIcon className="h-3 w-3" />
                              {TIER_INFO[tier as AwardTier]?.shortName || tier}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. Choose Subcategory */}
                  {selectedCategoryId && dbSubcategories.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        Subcategory
                        <span className="ml-2 text-xs text-white/40 font-normal">
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
                              <div className="flex flex-col py-1">
                                <span className="text-xs sm:text-sm font-medium">
                                  {sub.title}
                                </span>
                                {sub.description && (
                                  <span className="text-[10px] xs:text-xs text-white/40">
                                    {sub.description}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedCategoryId && dbSubcategories.length === 0 && (
                    <div className="text-center py-4 text-white/40 border border-dashed border-gold/20 rounded-lg">
                      <p className="text-sm">No subcategories available</p>
                      <p className="text-xs mt-1">Please contact support</p>
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

                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={!selectedCategoryId}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep2}
                      className="w-full sm:w-auto order-1 sm:order-2"
                    >
                      Continue to Nominee Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {lastSaved && (
                    <p className="text-xs text-white/40 text-right">
                      Last saved{" "}
                      {formatDistanceToNow(lastSaved, { addSuffix: true })}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Nominee Details */}
            {step === 2 && (
              <Card className="border-gold/10 bg-charcoal-light/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="font-display text-lg sm:text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-gold" />
                    Nominee Details
                  </CardTitle>
                  <CardDescription className="text-sm text-white/60">
                    Provide information about the person or organization you're
                    nominating
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-6">
                  {/* Selected Category Summary */}
                  {selectedCategory && (
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 rounded-lg bg-charcoal-light/80 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {selectedTier && (
                          <Badge
                            variant="outline"
                            className={`flex items-center gap-1 text-[10px] xs:text-xs ${TIER_DISPLAY_CONFIG[selectedTier].bgColor}`}
                            style={{
                              borderColor:
                                TIER_DISPLAY_CONFIG[selectedTier].color,
                              color: TIER_DISPLAY_CONFIG[selectedTier].color,
                            }}
                          >
                            {(() => {
                              const Icon =
                                TIER_DISPLAY_CONFIG[selectedTier].icon;
                              return <Icon className="h-3 w-3" />;
                            })()}
                            {TIER_INFO[selectedTier as AwardTier]?.shortName ||
                              selectedTier}
                          </Badge>
                        )}
                        <span className="font-medium text-xs sm:text-sm">
                          {selectedCategory.title}
                        </span>
                      </div>
                      <span className="text-xs text-white/60">
                        {
                          dbSubcategories.find(
                            (s) => s.id === selectedSubcategoryId,
                          )?.title
                        }
                      </span>
                    </div>
                  )}

                  {/* Account Type */}
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Building className="h-4 w-4 text-gold" />
                      Account Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={accountType}
                      onValueChange={(v) => setAccountType(v as NominationType)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NominationType.INDIVIDUAL}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Individual
                          </div>
                        </SelectItem>
                        <SelectItem value={NominationType.ORGANIZATION}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Organization
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gold" />
                      Contact Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nominee@example.com"
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">
                        Phone (Optional)
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 801 234 5678"
                        className="h-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">
                          Country <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Country"
                          required
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">
                          State / Region{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          value={stateRegion}
                          onChange={(e) => setStateRegion(e.target.value)}
                          placeholder="State or Region"
                          required
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gold" />
                      Online Presence
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">
                          LinkedIn Profile (Optional)
                        </Label>
                        <Input
                          value={linkedinProfile}
                          onChange={(e) => setLinkedinProfile(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Website (Optional)</Label>
                        <Input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://example.com"
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm">Nominee Photo (Optional)</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {nomineePhoto ? (
                        <div className="relative">
                          <img
                            src={nomineePhoto.url}
                            alt="Nominee"
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-gold/30"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-20 w-20 sm:h-24 sm:w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gold/30 hover:border-gold bg-charcoal-light/50">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, true)}
                            disabled={uploading}
                          />
                          <User className="h-8 w-8 sm:h-10 sm:w-10 text-white/40" />
                        </label>
                      )}
                      <div className="text-xs text-white/40">
                        <p>JPEG, PNG, GIF</p>
                        <p>Max file size: 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Nominee Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <User className="h-4 w-4 text-gold" />
                      Nominee Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="nomineeName" className="text-sm">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nomineeName"
                        value={nomineeName}
                        onChange={(e) => setNomineeName(e.target.value)}
                        placeholder="Enter nominee's full name"
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomineeTitle" className="text-sm">
                          Title / Position
                        </Label>
                        <Input
                          id="nomineeTitle"
                          value={nomineeTitle}
                          onChange={(e) => setNomineeTitle(e.target.value)}
                          placeholder="e.g., CEO, Founder, Professor"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="nomineeOrganization"
                          className="text-sm"
                        >
                          Organization
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                          <Input
                            id="nomineeOrganization"
                            value={nomineeOrganization}
                            onChange={(e) =>
                              setNomineeOrganization(e.target.value)
                            }
                            placeholder="Organization name"
                            className="pl-10 h-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nomineeBio" className="text-sm">
                        Biography (Optional)
                      </Label>
                      <Textarea
                        id="nomineeBio"
                        value={nomineeBio}
                        onChange={(e) => setNomineeBio(e.target.value)}
                        placeholder="Brief biography of the nominee..."
                        rows={4}
                        className="text-sm resize-none"
                      />
                      <p className="text-xs text-white/40 text-right">
                        {nomineeBio.length}/500 characters
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Categories
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSaveDraft}
                        className="flex-1 sm:flex-none"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!canProceedToStep3}
                        className="flex-1 sm:flex-none"
                      >
                        Continue to Evidence
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Evidence & Justification */}
            {step === 3 && (
              <Card className="border-gold/10 bg-charcoal-light/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="font-display text-lg sm:text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" />
                    Evidence & Justification
                  </CardTitle>
                  <CardDescription className="text-sm text-white/60">
                    Provide supporting evidence and explain why this nominee
                    deserves recognition
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-6">
                  {/* Impact Summary */}
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Star className="h-4 w-4 text-gold" />
                      Impact Summary <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      value={impactSummary}
                      onChange={(e) => setImpactSummary(e.target.value)}
                      placeholder="Summarize the nominee's impact in their field..."
                      rows={4}
                      required
                      className="text-sm resize-none"
                    />
                  </div>

                  {/* Achievement Description */}
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-gold" />
                      Achievement Description{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      value={achievementDescription}
                      onChange={(e) =>
                        setAchievementDescription(e.target.value)
                      }
                      placeholder="Describe key achievements, milestones, and contributions..."
                      rows={5}
                      required
                      className="text-sm resize-none"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <Label className="text-sm flex items-center gap-2">
                      <Upload className="h-4 w-4 text-gold" />
                      Supporting Evidence (Optional)
                    </Label>
                    <div className="rounded-lg border-2 border-dashed border-gold/30 p-6 text-center hover:border-gold/50 transition-colors">
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          multiple
                          accept="image/*,application/pdf,video/mp4,video/quicktime"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, false)}
                          disabled={uploading}
                        />
                        <Upload className="mx-auto mb-2 h-8 w-8 text-white/40" />
                        <p className="text-sm font-medium">
                          {uploading ? "Uploading..." : "Click to upload files"}
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          Images, PDFs, or videos (max 10MB each)
                        </p>
                        <p className="text-xs text-white/40">
                          Supported formats: JPG, PNG, PDF, MP4, MOV
                        </p>
                      </label>
                    </div>

                    {/* File List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                          Uploaded Files ({uploadedFiles.length})
                        </h4>
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.path}
                            className="flex items-center justify-between rounded-lg bg-charcoal-light/80 p-3"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {file.type.startsWith("image/") ? (
                                <ImageIcon className="h-5 w-5 text-white/40 shrink-0" />
                              ) : file.type === "application/pdf" ? (
                                <FileText className="h-5 w-5 text-white/40 shrink-0" />
                              ) : (
                                <FileText className="h-5 w-5 text-white/40 shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-white/40">
                                  {file.type.split("/")[1]?.toUpperCase() ||
                                    "Unknown"}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file)}
                              className="h-8 w-8 shrink-0 ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nomination Summary */}
                  <div className="rounded-lg bg-charcoal-light/50 p-4">
                    <h4 className="mb-3 font-semibold text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gold" />
                      Nomination Summary
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-2 bg-charcoal-light/30 rounded">
                        <span className="text-white/40 text-xs">
                          Award Tier:
                        </span>
                        <div className="flex items-center gap-2">
                          {selectedTier && (
                            <>
                              {(() => {
                                const Icon =
                                  TIER_DISPLAY_CONFIG[selectedTier].icon;
                                return (
                                  <Icon
                                    className={`h-4 w-4 ${TIER_DISPLAY_CONFIG[selectedTier].textColor}`}
                                  />
                                );
                              })()}
                              <span className="font-medium text-xs sm:text-sm">
                                {TIER_DISPLAY_CONFIG[selectedTier]?.fullName ||
                                  selectedTier}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-2 bg-charcoal-light/30 rounded">
                        <span className="text-white/40 text-xs">Category:</span>
                        <span className="font-medium text-xs sm:text-sm text-right">
                          {selectedCategory?.title}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-2 bg-charcoal-light/30 rounded">
                        <span className="text-white/40 text-xs">
                          Subcategory:
                        </span>
                        <span className="font-medium text-xs sm:text-sm text-right">
                          {
                            dbSubcategories.find(
                              (s) => s.id === selectedSubcategoryId,
                            )?.title
                          }
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-2 bg-charcoal-light/30 rounded">
                        <span className="text-white/40 text-xs">Nominee:</span>
                        <span className="font-medium text-xs sm:text-sm text-right">
                          {nomineeName}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-2 bg-charcoal-light/30 rounded">
                        <span className="text-white/40 text-xs">
                          Evidence Files:
                        </span>
                        <span className="font-medium text-xs sm:text-sm text-right">
                          {uploadedFiles.length} file
                          {uploadedFiles.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Details
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSaveDraft}
                        className="flex-1 sm:flex-none"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowConfirmDialog(true)}
                        className="flex-1 sm:flex-none"
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
            <DialogContent className="max-w-3xl w-[95vw] sm:w-full max-h-[90vh] p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2 text-lg sm:text-xl">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  Review Your Nomination
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Please review all details carefully before submitting. This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6">
                  {/* Category Section */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                      Award Category
                    </h4>
                    <div className="rounded-lg border border-gold/10 bg-charcoal-light/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {selectedTier && (
                            <>
                              {(() => {
                                const Icon =
                                  TIER_DISPLAY_CONFIG[selectedTier].icon;
                                return (
                                  <Icon
                                    className={`h-4 w-4 ${TIER_DISPLAY_CONFIG[selectedTier].textColor}`}
                                  />
                                );
                              })()}
                              <Badge
                                variant="outline"
                                className={`text-xs ${TIER_DISPLAY_CONFIG[selectedTier].bgColor}`}
                                style={{
                                  borderColor:
                                    TIER_DISPLAY_CONFIG[selectedTier].color,
                                  color:
                                    TIER_DISPLAY_CONFIG[selectedTier].color,
                                }}
                              >
                                {TIER_DISPLAY_CONFIG[selectedTier]?.fullName}
                              </Badge>
                            </>
                          )}
                        </div>
                        {scopeBadge && (
                          <Badge variant="secondary" className="text-xs">
                            {scopeBadge.label}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {selectedCategory?.title}
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          {
                            dbSubcategories.find(
                              (s) => s.id === selectedSubcategoryId,
                            )?.title
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gold/10" />

                  {/* Nominee Section */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                      Nominee Information
                    </h4>
                    <div className="rounded-lg border border-gold/10 bg-charcoal-light/30 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {nomineePhoto ? (
                          <img
                            src={nomineePhoto.url}
                            alt={nomineeName}
                            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-gold/30 mx-auto sm:mx-0"
                          />
                        ) : (
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-charcoal-light flex items-center justify-center border-2 border-gold/30 mx-auto sm:mx-0">
                            <User className="h-8 w-8 sm:h-10 sm:w-10 text-white/40" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                          <div>
                            <p className="font-semibold text-base">
                              {nomineeName}
                            </p>
                            <p className="text-xs text-white/60">
                              {accountType}
                            </p>
                          </div>
                          {nomineeTitle && (
                            <p className="text-sm">{nomineeTitle}</p>
                          )}
                          {nomineeOrganization && (
                            <p className="text-xs flex items-center justify-center sm:justify-start gap-1">
                              <Building className="h-3 w-3" />
                              {nomineeOrganization}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            <Badge variant="outline" className="text-[10px]">
                              {country}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {stateRegion}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {nomineeBio && (
                        <div className="mt-4 pt-4 border-t border-gold/10">
                          <p className="text-xs text-white/80">{nomineeBio}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-gold/10" />

                  {/* Contact Section */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                      Contact Information
                    </h4>
                    <div className="rounded-lg border border-gold/10 bg-charcoal-light/30 p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-white/40">Email</p>
                          <p className="text-sm">{email}</p>
                        </div>
                        {phone && (
                          <div>
                            <p className="text-xs text-white/40">Phone</p>
                            <p className="text-sm">{phone}</p>
                          </div>
                        )}
                        {linkedinProfile && (
                          <div>
                            <p className="text-xs text-white/40">LinkedIn</p>
                            <p className="text-sm truncate">
                              {linkedinProfile}
                            </p>
                          </div>
                        )}
                        {website && (
                          <div>
                            <p className="text-xs text-white/40">Website</p>
                            <p className="text-sm truncate">{website}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gold/10" />

                  {/* Impact Section */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">
                        Impact Summary
                      </h4>
                      <div className="rounded-lg border border-gold/10 bg-charcoal-light/30 p-4">
                        <p className="text-sm whitespace-pre-wrap">
                          {impactSummary}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">
                        Achievement Description
                      </h4>
                      <div className="rounded-lg border border-gold/10 bg-charcoal-light/30 p-4">
                        <p className="text-sm whitespace-pre-wrap">
                          {achievementDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Files */}
                  {uploadedFiles.length > 0 && (
                    <>
                      <Separator className="bg-gold/10" />
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                          Supporting Evidence ({uploadedFiles.length})
                        </h4>
                        <div className="rounded-lg border border-gold/10 bg-charcoal-light/30 p-4 space-y-2">
                          {uploadedFiles.map((file) => (
                            <div
                              key={file.path}
                              className="flex items-center gap-2 text-sm p-2 bg-charcoal-light/50 rounded"
                            >
                              {file.type.startsWith("image/") ? (
                                <ImageIcon className="h-4 w-4 text-white/40 shrink-0" />
                              ) : (
                                <FileText className="h-4 w-4 text-white/40 shrink-0" />
                              )}
                              <span className="truncate text-xs sm:text-sm">
                                {file.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="ml-auto text-[10px]"
                              >
                                {file.type.split("/")[1]?.toUpperCase() ||
                                  "FILE"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={submitting}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Edit Nomination
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
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
