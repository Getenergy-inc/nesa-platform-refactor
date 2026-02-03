/**
 * Admin Nominee Images Management Page
 * Search, review, and approve images for all nominees
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Search,
  Download,
  Upload,
  Image as ImageIcon,
  User,
  Building2,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Copy,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useNomineeImages } from "@/hooks/useNomineeImages";
import { classifyNominee } from "@/lib/nomineeClassifier";
import type { NomineeKind, ImageCandidate, NomineeForImageSearch } from "@/types/nomineeImages";

// Nominee row component
function NomineeImageRow({
  nominee,
  suggestion,
  override,
  isExpanded,
  onToggleExpand,
  onSearch,
  onApprove,
  onSetManual,
  onToggleKind,
  onRemoveApproval,
  isSearching,
}: {
  nominee: NomineeForImageSearch;
  suggestion?: { candidates: ImageCandidate[]; error?: string };
  override?: { imageUrl: string; kind: NomineeKind; approved: boolean; license?: string };
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSearch: () => void;
  onApprove: (candidate: ImageCandidate, kind: NomineeKind) => void;
  onSetManual: (imageUrl: string, kind: NomineeKind, notes?: string) => void;
  onToggleKind: () => void;
  onRemoveApproval: () => void;
  isSearching: boolean;
}) {
  const [manualUrl, setManualUrl] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  
  const detectedKind = classifyNominee(nominee.nomineeName);
  const effectiveKind = override?.kind || detectedKind;
  const isApproved = override?.approved;
  const hasImage = isApproved || !!nominee.currentImageUrl;
  const candidates = suggestion?.candidates || [];
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Row header */}
      <div
        className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
          isApproved ? "bg-emerald-500/10" : ""
        }`}
        onClick={onToggleExpand}
      >
        {/* Current/Approved image */}
        <div className="w-12 h-12 rounded-lg border border-border overflow-hidden flex-shrink-0 bg-muted">
          {(override?.imageUrl || nominee.currentImageUrl) ? (
            <img
              src={override?.imageUrl || nominee.currentImageUrl}
              alt={nominee.nomineeName}
              className={`w-full h-full ${effectiveKind === "organization" ? "object-contain p-1" : "object-cover"}`}
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
        
        {/* Nominee info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{nominee.nomineeName}</span>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {effectiveKind === "person" ? (
                <User className="w-3 h-3 mr-1" />
              ) : (
                <Building2 className="w-3 h-3 mr-1" />
              )}
              {effectiveKind}
            </Badge>
            {detectedKind !== effectiveKind && (
              <Badge variant="secondary" className="text-xs">overridden</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {nominee.awardTitle} → {nominee.subcategoryTitle}
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isApproved && (
            <Badge className="bg-emerald-600">
              <Check className="w-3 h-3 mr-1" />
              Approved
            </Badge>
          )}
          {candidates.length > 0 && !isApproved && (
            <Badge variant="secondary">
              {candidates.length} suggestions
            </Badge>
          )}
          {suggestion?.error && (
            <Badge variant="destructive">Error</Badge>
          )}
        </div>
        
        {/* Expand indicator */}
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-border p-4 bg-muted/20 space-y-4">
          {/* Actions row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onSearch();
              }}
              disabled={isSearching}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isSearching ? "animate-spin" : ""}`} />
              {candidates.length > 0 ? "Re-search" : "Search"}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onToggleKind();
              }}
            >
              Switch to {effectiveKind === "person" ? "Organization" : "Person"}
            </Button>
            
            {isApproved && (
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveApproval();
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Remove Approval
              </Button>
            )}
          </div>
          
          {/* Image candidates */}
          {candidates.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Suggested Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {candidates.map((candidate, idx) => (
                  <div
                    key={idx}
                    className="relative border border-border rounded-lg overflow-hidden bg-background group"
                  >
                    <div className="aspect-square">
                      <img
                        src={candidate.thumbnailUrl || candidate.imageUrl}
                        alt={`Suggestion ${idx + 1}`}
                        className={`w-full h-full ${effectiveKind === "organization" ? "object-contain p-2" : "object-cover"}`}
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.svg";
                        }}
                      />
                    </div>
                    
                    {/* Confidence badge */}
                    <div className="absolute top-1 left-1">
                      <Badge
                        variant={candidate.confidence >= 0.7 ? "default" : "secondary"}
                        className="text-[10px] px-1 py-0"
                      >
                        {Math.round(candidate.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    {/* Actions overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onApprove(candidate, effectiveKind);
                          toast.success("Image approved");
                        }}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <a
                        href={candidate.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" variant="secondary">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                    
                    {/* Source badge */}
                    <div className="absolute bottom-1 right-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 bg-background/80">
                        {candidate.source}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Error message */}
          {suggestion?.error && (
            <div className="text-sm text-destructive">
              Search error: {suggestion.error}
            </div>
          )}
          
          {/* Manual URL input */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Manual Image URL</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Paste image URL..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="sm"
                disabled={!manualUrl}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetManual(manualUrl, effectiveKind, manualNotes);
                  setManualUrl("");
                  setManualNotes("");
                  toast.success("Manual image set");
                }}
              >
                Set Image
              </Button>
            </div>
            <Input
              placeholder="Notes (optional)..."
              value={manualNotes}
              onChange={(e) => setManualNotes(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* License info */}
          {override?.license && (
            <div className="text-xs text-muted-foreground">
              License: {override.license}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Stats card component
function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "success" | "warning" | "destructive";
}) {
  const variantClasses = {
    default: "bg-card",
    success: "bg-emerald-500/10 border-emerald-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
    destructive: "bg-destructive/10 border-destructive/20",
  };
  
  return (
    <Card className={variantClasses[variant]}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-muted-foreground" />
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminNomineeImages() {
  const {
    filteredNominees,
    suggestions,
    overrides,
    filters,
    setFilters,
    stats,
    availableAwards,
    availableSubcategories,
    searchSingle,
    searchBatch,
    searchMissingImages,
    approveImage,
    setManualImage,
    toggleKindOverride,
    removeApproval,
    exportOverrides,
    importOverrides,
    isLoading,
    isSearching,
    searchProgress,
  } = useNomineeImages();
  
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  
  // Pagination
  const totalPages = Math.ceil(filteredNominees.length / pageSize);
  const paginatedNominees = filteredNominees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Export handler
  const handleExport = () => {
    const json = exportOverrides();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nomineeImageOverrides.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported overrides to JSON");
  };
  
  // Import handler
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importOverrides(event.target?.result as string);
        toast.success("Imported overrides successfully");
      } catch (err) {
        toast.error("Failed to import: Invalid JSON");
      }
    };
    reader.readAsText(file);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nominee Image Manager</h1>
          <p className="text-muted-foreground">
            Search, review, and approve images for all nominees
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <label>
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatsCard title="Total Nominees" value={stats.total} icon={User} />
        <StatsCard title="With Images" value={stats.withImages} icon={ImageIcon} variant="success" />
        <StatsCard title="Missing Images" value={stats.missingImages} icon={ImageIcon} variant="warning" />
        <StatsCard title="Approved" value={stats.approved} icon={Check} variant="success" />
        <StatsCard title="Persons" value={stats.persons} icon={User} />
        <StatsCard title="Organizations" value={stats.organizations} icon={Building2} />
      </div>
      
      {/* Bulk actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              onClick={() => searchMissingImages()}
              disabled={isSearching}
            >
              <Search className={`w-4 h-4 mr-2 ${isSearching ? "animate-spin" : ""}`} />
              Search All Missing Images
            </Button>
            
            <Button
              variant="outline"
              onClick={() => searchBatch(paginatedNominees.map(n => n.nomineeSlug))}
              disabled={isSearching}
            >
              Search Current Page
            </Button>
            
            {searchProgress && (
              <div className="flex items-center gap-3 flex-1">
                <Progress
                  value={(searchProgress.completed / searchProgress.total) * 100}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">
                  {searchProgress.completed} / {searchProgress.total}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch
                id="missing-only"
                checked={filters.missingOnly}
                onCheckedChange={(checked) => {
                  setFilters({ missingOnly: checked });
                  setCurrentPage(1);
                }}
              />
              <Label htmlFor="missing-only">Missing images only</Label>
            </div>
            
            <Select
              value={filters.kind}
              onValueChange={(value) => {
                setFilters({ kind: value as any });
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Kind" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="person">Persons</SelectItem>
                <SelectItem value="organization">Organizations</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.status}
              onValueChange={(value) => {
                setFilters({ status: value as any });
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.awardSlug || "all"}
              onValueChange={(value) => {
                setFilters({
                  awardSlug: value === "all" ? undefined : value,
                  subcategorySlug: undefined,
                });
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Award" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Awards</SelectItem>
                {availableAwards.map((award) => (
                  <SelectItem key={award.slug} value={award.slug}>
                    {award.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {filters.awardSlug && (
              <Select
                value={filters.subcategorySlug || "all"}
                onValueChange={(value) => {
                  setFilters({ subcategorySlug: value === "all" ? undefined : value });
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {availableSubcategories.map((sub) => (
                    <SelectItem key={sub.slug} value={sub.slug}>
                      {sub.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by name..."
                value={filters.searchQuery || ""}
                onChange={(e) => {
                  setFilters({ searchQuery: e.target.value });
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedNominees.length} of {filteredNominees.length} nominees
      </div>
      
      {/* Nominee list */}
      <div className="space-y-2">
        {paginatedNominees.map((nominee) => (
          <NomineeImageRow
            key={nominee.nomineeSlug}
            nominee={nominee}
            suggestion={suggestions[nominee.nomineeSlug]}
            override={overrides[nominee.nomineeSlug]}
            isExpanded={expandedSlug === nominee.nomineeSlug}
            onToggleExpand={() => {
              setExpandedSlug(expandedSlug === nominee.nomineeSlug ? null : nominee.nomineeSlug);
            }}
            onSearch={() => searchSingle(nominee.nomineeSlug)}
            onApprove={(candidate, kind) => approveImage(nominee.nomineeSlug, candidate, kind)}
            onSetManual={(url, kind, notes) => setManualImage(nominee.nomineeSlug, url, kind, notes)}
            onToggleKind={() => toggleKindOverride(nominee.nomineeSlug)}
            onRemoveApproval={() => removeApproval(nominee.nomineeSlug)}
            isSearching={isSearching}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
      
      {/* Empty state */}
      {filteredNominees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No nominees found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
