import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Sparkles,
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ChevronRight,
  ChevronDown,
  Tag,
  Globe,
  MapPin,
  Award,
  Medal,
  Star,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { adminApi } from "@/api/newadmin";
import { uploadApi, type fileType } from "@/api/storage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { categoryApi } from "@/api/category";

// Types based on Prisma model
interface Category {
  id: string;
  title: string;
  description: string;
  image: string | null;
  awardType: Awards;
  scope: CategoryScope;
  // subCategories will be fetched separately
}

interface Subcategory {
  id: string;
  title: string;
  description: string;
  image: string | null;
  renominationCount: number | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

enum Awards {
  AFRICA_ICON_BLUE_GARNET = "AFRICA_ICON_BLUE_GARNET",
  BLUE_GARNET_AND_GOLD_CERTIFICATE = "BLUE_GARNET_AND_GOLD_CERTIFICATE",
  PLATINUM_CERTIFICATE = "PLATINUM_CERTIFICATE",
  GOLD_CERTIFICATE = "GOLD_CERTIFICATE",
  GOLD_SPECIAL = "GOLD_SPECIAL",
}

enum CategoryScope {
  AFRICA_REGIONAL = "AFRICA_REGIONAL",
  NIGERIA = "NIGERIA",
  INTERNATIONAL = "INTERNATIONAL",
  ICON = "ICON",
}

// Award type display mapping
const awardTypeLabels: Record<
  Awards,
  { label: string; color: string; icon: any }
> = {
  [Awards.AFRICA_ICON_BLUE_GARNET]: {
    label: "Africa Icon Blue Garnet",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Medal,
  },
  [Awards.BLUE_GARNET_AND_GOLD_CERTIFICATE]: {
    label: "Blue Garnet & Gold Certificate",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: Award,
  },
  [Awards.PLATINUM_CERTIFICATE]: {
    label: "Platinum Certificate",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Award,
  },
  [Awards.GOLD_CERTIFICATE]: {
    label: "Gold Certificate",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Award,
  },
  [Awards.GOLD_SPECIAL]: {
    label: "Gold Special",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Star,
  },
};

const scopeLabels: Record<
  CategoryScope,
  { label: string; color: string; icon: any }
> = {
  [CategoryScope.AFRICA_REGIONAL]: {
    label: "Africa Regional",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: Globe,
  },
  [CategoryScope.NIGERIA]: {
    label: "Nigeria",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: MapPin,
  },
  [CategoryScope.INTERNATIONAL]: {
    label: "International",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Globe,
  },
  [CategoryScope.ICON]: {
    label: "Icon",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Star,
  },
};

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  path: string;
}

export interface CreateCategoryPayload {
  title: string;
  description: string;
  image?: string | null;
  awardType: Awards;
  scope: CategoryScope;
}

export interface UpdateCategoryPayload extends CreateCategoryPayload {
  id: string;
}

export interface CreateSubcategoryPayload {
  title: string;
  description: string;
  categoryId: string;
  image?: string | null;
  renominationCount?: number | null;
}

export interface UpdateSubcategoryPayload extends CreateSubcategoryPayload {
  id: string;
}

export default function ManageCategoriesPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [categorySubcategories, setCategorySubcategories] = useState<
    Record<string, Subcategory[]>
  >({});
  const [loadingSubcategories, setLoadingSubcategories] = useState<
    Record<string, boolean>
  >({});

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showCreateSubcategoryModal, setShowCreateSubcategoryModal] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.fetchAllCategories(accessToken),
  });

  // Fetch subcategories when a category is expanded
  const fetchSubcategories = async (categoryId: string) => {
    if (categorySubcategories[categoryId]) return; // Already fetched

    setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const subcategories = await categoryApi.fetchSubcategories(
        accessToken,
        categoryId,
      );
      setCategorySubcategories((prev) => ({
        ...prev,
        [categoryId]: subcategories,
      }));
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      toast.error("Failed to load subcategories");
    } finally {
      setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  // Category Mutations
  const createCategoryMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      adminApi.createCategory(accessToken, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowCreateCategoryModal(false);
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (payload: UpdateCategoryPayload) =>
      adminApi.updateCategory(accessToken, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(accessToken, id),
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // Clear subcategories for this category
      setCategorySubcategories((prev) => {
        const newState = { ...prev };
        delete newState[categoryId];
        return newState;
      });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  // Subcategory Mutations
  const createSubcategoryMutation = useMutation({
    mutationFn: (payload: CreateSubcategoryPayload) =>
      adminApi.createSubCategory(accessToken, payload),
    onSuccess: (_, variables) => {
      // Refetch subcategories for this category
      if (variables.categoryId) {
        queryClient.invalidateQueries({
          queryKey: ["subcategories", variables.categoryId],
        });
        // Clear cached subcategories to force refetch
        setCategorySubcategories((prev) => {
          const newState = { ...prev };
          delete newState[variables.categoryId];
          return newState;
        });
      }
      setShowCreateSubcategoryModal(false);
      toast.success("Subcategory created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create subcategory");
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: (payload: UpdateSubcategoryPayload) =>
      adminApi.updateSubCategory(accessToken, payload),
    onSuccess: (_, variables) => {
      // Find categoryId from the subcategory being edited
      const categoryId = editingSubcategory?.categoryId;
      if (categoryId) {
        // Update local state
        setCategorySubcategories((prev) => {
          const subcategories = prev[categoryId] || [];
          const updatedSubcategories = subcategories.map((sub) =>
            sub.id === variables.id ? { ...sub, ...variables } : sub,
          );
          return { ...prev, [categoryId]: updatedSubcategories };
        });
      }
      setEditingSubcategory(null);
      toast.success("Subcategory updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update subcategory");
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteSubCategory(accessToken, id),
    onSuccess: (_, subcategoryId) => {
      // Find and update the category that had this subcategory
      Object.entries(categorySubcategories).forEach(([categoryId, subs]) => {
        if (subs.some((sub) => sub.id === subcategoryId)) {
          setCategorySubcategories((prev) => ({
            ...prev,
            [categoryId]: prev[categoryId].filter(
              (sub) => sub.id !== subcategoryId,
            ),
          }));
        }
      });
      toast.success("Subcategory deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete subcategory");
    },
  });

  const toggleCategory = async (categoryId: string) => {
    const newExpandedState = !expandedCategories.has(categoryId);

    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newExpandedState) {
        newSet.add(categoryId);
      } else {
        newSet.delete(categoryId);
      }
      return newSet;
    });

    // Fetch subcategories when expanding
    if (newExpandedState) {
      await fetchSubcategories(categoryId);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-30"></div>
            <div className="relative bg-white p-2 sm:p-3 rounded-2xl shadow-lg border border-amber-200">
              <FolderTree className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Categories & Subcategories
            </h1>
            <p className="text-amber-700 text-xs sm:text-sm mt-1">
              Manage award categories and their subcategories
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowCreateSubcategoryModal(true)}
            className="flex-1 sm:flex-none group relative flex items-center justify-center gap-2 bg-white text-amber-600 border-2 border-amber-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:hidden">Sub</span>
            <span className="hidden sm:inline">Add Subcategory</span>
          </button>
          <button
            onClick={() => setShowCreateCategoryModal(true)}
            className="flex-1 sm:flex-none group relative flex items-center justify-center gap-2 bg-amber-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:hidden">Cat</span>
            <span className="hidden sm:inline">Add Category</span>
          </button>
        </div>
      </div>

      {/* CATEGORIES LIST */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-10 animate-pulse"></div>
            <div className="relative bg-white shadow-lg px-6 sm:px-8 py-4 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                <p className="text-gray-600">Loading categories...</p>
              </div>
            </div>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-amber-100 shadow-lg p-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20"></div>
            <div className="relative bg-amber-100 p-4 rounded-3xl">
              <LayoutGrid className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Categories Yet
          </h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            Get started by creating your first award category. Categories help
            organize your awards into logical groups.
          </p>
          <button
            onClick={() => setShowCreateCategoryModal(true)}
            className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Create First Category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category: Category, index: number) => {
            const isExpanded = expandedCategories.has(category.id);
            const isLoadingSubs = loadingSubcategories[category.id];
            const subcategories = categorySubcategories[category.id] || [];
            const AwardIcon =
              awardTypeLabels[category.awardType]?.icon || Award;
            const ScopeIcon = scopeLabels[category.scope]?.icon || Globe;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-amber-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Category Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="mt-1 text-gray-400 hover:text-amber-600 transition-colors"
                      disabled={isLoadingSubs}
                    >
                      {isLoadingSubs ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isExpanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.title}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-amber-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                              <LayoutGrid className="h-6 w-6 text-amber-600" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                {category.title}
                              </h3>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${scopeLabels[category.scope].color}`}
                              >
                                <div className="flex items-center gap-1">
                                  <ScopeIcon className="h-3 w-3" />
                                  <span>
                                    {scopeLabels[category.scope].label}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {category.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-12 lg:ml-0 flex-wrap">
                          <div
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${awardTypeLabels[category.awardType].color}`}
                          >
                            <div className="flex items-center gap-1">
                              <AwardIcon className="h-3 w-3" />
                              <span>
                                {awardTypeLabels[category.awardType].label}
                              </span>
                            </div>
                          </div>

                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                            {subcategories.length} Subcategories
                          </span>

                          <button
                            onClick={() => {
                              setSelectedCategoryId(category.id);
                              setShowCreateSubcategoryModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Add Subcategory"
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this category? This will also delete all subcategories under it.",
                                )
                              ) {
                                deleteCategoryMutation.mutate(category.id);
                              }
                            }}
                            disabled={
                              deleteCategoryMutation.isPending &&
                              deleteCategoryMutation.variables === category.id
                            }
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            {deleteCategoryMutation.isPending &&
                            deleteCategoryMutation.variables === category.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Subcategories List */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pl-4 border-l-2 border-amber-200 space-y-3">
                              {isLoadingSubs ? (
                                <div className="flex items-center justify-center py-6 bg-gray-50 rounded-xl">
                                  <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                                  <span className="ml-2 text-sm text-gray-500">
                                    Loading subcategories...
                                  </span>
                                </div>
                              ) : subcategories.length > 0 ? (
                                subcategories.map((sub: Subcategory) => {
                                  const isSubDeleting =
                                    deleteSubcategoryMutation.isPending &&
                                    deleteSubcategoryMutation.variables ===
                                      sub.id;

                                  return (
                                    <motion.div
                                      key={sub.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        {sub.image ? (
                                          <img
                                            src={sub.image}
                                            alt={sub.title}
                                            className="w-8 h-8 rounded-lg object-cover border border-amber-200"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                            <Tag className="h-4 w-4 text-amber-600" />
                                          </div>
                                        )}
                                        <div>
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-medium text-gray-800">
                                              {sub.title}
                                            </h4>
                                            {sub.renominationCount && (
                                              <div className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                Max: {sub.renominationCount}
                                              </div>
                                            )}
                                          </div>
                                          {sub.description && (
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                              {sub.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() =>
                                            setEditingSubcategory(sub)
                                          }
                                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-white rounded-lg transition-colors"
                                          title="Edit Subcategory"
                                        >
                                          <Pencil className="h-3.5 w-3.5" />
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (
                                              window.confirm(
                                                "Are you sure you want to delete this subcategory?",
                                              )
                                            ) {
                                              deleteSubcategoryMutation.mutate(
                                                sub.id,
                                              );
                                            }
                                          }}
                                          disabled={isSubDeleting}
                                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                                          title="Delete Subcategory"
                                        >
                                          {isSubDeleting ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          ) : (
                                            <Trash2 className="h-3.5 w-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })
                              ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                  <p className="text-gray-400 text-sm">
                                    No subcategories yet. Click the + button
                                    above to add one.
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE/EDIT CATEGORY MODAL */}
      <AnimatePresence>
        {(showCreateCategoryModal || editingCategory) && (
          <CategoryModal
            title={editingCategory ? "Edit Category" : "Create New Category"}
            category={editingCategory}
            onClose={() => {
              setShowCreateCategoryModal(false);
              setEditingCategory(null);
            }}
            onSubmit={(data) => {
              if (editingCategory) {
                updateCategoryMutation.mutate({
                  ...data,
                  id: editingCategory.id,
                });
              } else {
                createCategoryMutation.mutate(data);
              }
            }}
            isSubmitting={
              createCategoryMutation.isPending ||
              updateCategoryMutation.isPending
            }
            accessToken={accessToken}
          />
        )}
      </AnimatePresence>

      {/* CREATE/EDIT SUBCATEGORY MODAL */}
      <AnimatePresence>
        {(showCreateSubcategoryModal || editingSubcategory) && (
          <SubcategoryModal
            title={
              editingSubcategory ? "Edit Subcategory" : "Create New Subcategory"
            }
            subcategory={editingSubcategory}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onClose={() => {
              setShowCreateSubcategoryModal(false);
              setEditingSubcategory(null);
              setSelectedCategoryId(null);
            }}
            onSubmit={(data) => {
              if (editingSubcategory) {
                updateSubcategoryMutation.mutate({
                  ...data,
                  id: editingSubcategory.id,
                });
              } else {
                createSubcategoryMutation.mutate(data);
              }
            }}
            isSubmitting={
              createSubcategoryMutation.isPending ||
              updateSubcategoryMutation.isPending
            }
            accessToken={accessToken}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Category Modal Component
function CategoryModal({
  title,
  category,
  onClose,
  onSubmit,
  isSubmitting,
  accessToken,
}: any) {
  const [form, setForm] = useState(
    category || {
      title: "",
      description: "",
      image: null,
      awardType: Awards.PLATINUM_CERTIFICATE,
      scope: CategoryScope.NIGERIA,
    },
  );
  const [uploading, setUploading] = useState(false);

  function updateField(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !accessToken) return;

    const file = files[0];

    try {
      setUploading(true);

      const file_type: fileType = file.type.startsWith("image/")
        ? "IMAGE"
        : "DOCUMENT";

      const uploadUrl = await uploadApi.getPresignedUrl(
        accessToken,
        file.name,
        file.type,
        file.size.toString(),
        file_type,
      );

      await uploadApi.uploadFile(file, uploadUrl.signedUrl);

      const url = await uploadApi.getPublicUrl(accessToken, uploadUrl.path);

      updateField("image", url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    updateField("image", null);
    toast.success("Image removed");
  };

  function handleSubmit() {
    if (!form.title.trim()) {
      toast.error("Category title is required");
      return;
    }
    onSubmit(form);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="relative bg-amber-100 p-1.5 sm:p-2 rounded-xl">
                <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="text-gray-600 text-xs uppercase tracking-wider mb-2 block">
              Category Image
            </label>
            <div className="flex items-center gap-4">
              {form.image ? (
                <div className="relative">
                  <img
                    src={form.image}
                    alt="Category"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-amber-200"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <div className="flex-1">
                <label
                  className={`
                    cursor-pointer flex items-center justify-center gap-2 
                    bg-amber-50 hover:bg-amber-100 text-amber-700 
                    border-2 border-dashed border-amber-200 
                    rounded-xl px-4 py-2 transition-all duration-300
                    ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload Image</span>
                    </>
                  )}
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Category Title"
            value={form.title}
            onChange={(v) => updateField("title", v)}
            placeholder="e.g., Best Actor, Film of the Year"
            required
          />

          <Input
            label="Description"
            value={form.description}
            onChange={(v) => updateField("description", v)}
            placeholder="Brief description of this category"
            textarea
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Award Type Selection */}
            <div className="flex flex-col gap-1 text-xs sm:text-sm">
              <label className="text-gray-600 text-xs uppercase tracking-wider">
                Award Type *
              </label>
              <select
                value={form.awardType}
                onChange={(e) => updateField("awardType", e.target.value)}
                className="
                  rounded-lg
                  sm:rounded-xl
                  border
                  border-gray-200
                  px-3
                  sm:px-4
                  py-2
                  sm:py-2.5
                  text-sm
                  text-gray-800
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-amber-500/20
                  focus:border-amber-500
                  transition-all
                  duration-300
                  hover:border-amber-300
                "
              >
                {Object.values(Awards).map((type) => (
                  <option key={type} value={type}>
                    {awardTypeLabels[type as Awards]?.label || type}
                  </option>
                ))}
              </select>
            </div>

            {/* Scope Selection */}
            <div className="flex flex-col gap-1 text-xs sm:text-sm">
              <label className="text-gray-600 text-xs uppercase tracking-wider">
                Scope *
              </label>
              <select
                value={form.scope}
                onChange={(e) => updateField("scope", e.target.value)}
                className="
                  rounded-lg
                  sm:rounded-xl
                  border
                  border-gray-200
                  px-3
                  sm:px-4
                  py-2
                  sm:py-2.5
                  text-sm
                  text-gray-800
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-amber-500/20
                  focus:border-amber-500
                  transition-all
                  duration-300
                  hover:border-amber-300
                "
              >
                {Object.values(CategoryScope).map((scope) => (
                  <option key={scope} value={scope}>
                    {scopeLabels[scope as CategoryScope]?.label || scope}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-amber-100 pt-4 sm:pt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting || uploading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || uploading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Category"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Subcategory Modal Component
function SubcategoryModal({
  title,
  subcategory,
  categories,
  selectedCategoryId,
  onClose,
  onSubmit,
  isSubmitting,
  accessToken,
}: any) {
  const [form, setForm] = useState(
    subcategory || {
      title: "",
      description: "",
      categoryId: selectedCategoryId || "",
      image: null,
      renominationCount: 200,
    },
  );
  const [uploading, setUploading] = useState(false);

  function updateField(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !accessToken) return;

    const file = files[0];

    try {
      setUploading(true);

      const file_type: fileType = file.type.startsWith("image/")
        ? "IMAGE"
        : "DOCUMENT";

      const uploadUrl = await uploadApi.getPresignedUrl(
        accessToken,
        file.name,
        file.type,
        file.size.toString(),
        file_type,
      );

      await uploadApi.uploadFile(file, uploadUrl.signedUrl);

      const url = await uploadApi.getPublicUrl(accessToken, uploadUrl.path);

      updateField("image", url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    updateField("image", null);
    toast.success("Image removed");
  };

  function handleSubmit() {
    if (!form.title.trim()) {
      toast.error("Subcategory title is required");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }
    onSubmit(form);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="relative bg-amber-100 p-1.5 sm:p-2 rounded-xl">
                <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Category Selection */}
          <div className="flex flex-col gap-1 text-xs sm:text-sm">
            <label className="text-gray-600 text-xs uppercase tracking-wider">
              Parent Category *
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="
                rounded-lg
                sm:rounded-xl
                border
                border-gray-200
                px-3
                sm:px-4
                py-2
                sm:py-2.5
                text-sm
                text-gray-800
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-amber-500/20
                focus:border-amber-500
                transition-all
                duration-300
                hover:border-amber-300
              "
            >
              <option value="">Select a category</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-gray-600 text-xs uppercase tracking-wider mb-2 block">
              Subcategory Image
            </label>
            <div className="flex items-center gap-4">
              {form.image ? (
                <div className="relative">
                  <img
                    src={form.image}
                    alt="Subcategory"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-amber-200"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <div className="flex-1">
                <label
                  className={`
                    cursor-pointer flex items-center justify-center gap-2 
                    bg-amber-50 hover:bg-amber-100 text-amber-700 
                    border-2 border-dashed border-amber-200 
                    rounded-xl px-4 py-2 transition-all duration-300
                    ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload Image</span>
                    </>
                  )}
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Subcategory Title"
            value={form.title}
            onChange={(v) => updateField("title", v)}
            placeholder="e.g., Best Actor in a Drama"
            required
          />

          <Input
            label="Description"
            value={form.description}
            onChange={(v) => updateField("description", v)}
            placeholder="Brief description of this subcategory"
            textarea
          />

          <Input
            label="Max Renomination Count"
            type="number"
            value={form.renominationCount}
            onChange={(v) =>
              updateField("renominationCount", v ? parseInt(v) : null)
            }
            placeholder="200"
            helpText="Maximum number of times someone can be renominated"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-amber-100 pt-4 sm:pt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting || uploading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || uploading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Subcategory"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Enhanced Input Component with textarea support
function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  helpText,
  textarea,
  className,
}: any) {
  return (
    <div
      className={`flex flex-col gap-1 text-xs sm:text-sm ${className || ""}`}
    >
      <label className="text-gray-600 text-xs uppercase tracking-wider">
        {label} {required && <span className="text-amber-600">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="
            rounded-lg
            sm:rounded-xl
            border
            border-gray-200
            px-3
            sm:px-4
            py-2
            sm:py-2.5
            text-sm
            text-gray-800
            bg-white
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-amber-500/20
            focus:border-amber-500
            transition-all
            duration-300
            hover:border-amber-300
            resize-none
          "
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            rounded-lg
            sm:rounded-xl
            border
            border-gray-200
            px-3
            sm:px-4
            py-2
            sm:py-2.5
            text-sm
            text-gray-800
            bg-white
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-amber-500/20
            focus:border-amber-500
            transition-all
            duration-300
            hover:border-amber-300
          "
        />
      )}
      {helpText && <p className="text-xs text-gray-400 mt-1">{helpText}</p>}
    </div>
  );
}
