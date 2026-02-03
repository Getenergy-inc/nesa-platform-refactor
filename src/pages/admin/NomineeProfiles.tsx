/**
 * Admin Nominee Profiles Editor
 * Create, edit, and manage enriched nominee profiles
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  Download,
  Upload,
  Save,
  Plus,
  Trash2,
  User,
  Building2,
  CheckCircle,
  Clock,
  FileText,
  X,
  ExternalLink,
  Globe,
  Linkedin,
  Instagram,
} from "lucide-react";

import { useEnrichedProfiles } from "@/hooks/useEnrichedProfiles";
import { getAllNominees, type EnrichedNominee } from "@/lib/nesaData";
import { classifyNominee } from "@/lib/nomineeClassifier";
import type { 
  EnrichedNomineeProfile, 
  NomineeSource, 
  NomineeProfileKind 
} from "@/types/nomineeProfile";
import { createEmptyProfile } from "@/types/nomineeProfile";

// Profile editor form
function ProfileEditor({
  profile,
  nominee,
  onSave,
  onCancel,
}: {
  profile: EnrichedNomineeProfile;
  nominee: EnrichedNominee;
  onSave: (profile: EnrichedNomineeProfile) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<EnrichedNomineeProfile>(profile);
  const [newContribution, setNewContribution] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newSource, setNewSource] = useState<Partial<NomineeSource>>({});

  const handleSave = () => {
    onSave({
      ...formData,
      lastGeneratedAt: new Date().toISOString(),
    });
    toast.success("Profile saved");
  };

  const addContribution = () => {
    if (newContribution.trim()) {
      setFormData(prev => ({
        ...prev,
        education_for_all_contributions: [
          ...prev.education_for_all_contributions,
          newContribution.trim(),
        ],
      }));
      setNewContribution("");
    }
  };

  const removeContribution = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      education_for_all_contributions: prev.education_for_all_contributions.filter((_, i) => i !== idx),
    }));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  const addSource = () => {
    if (newSource.url && newSource.title) {
      setFormData(prev => ({
        ...prev,
        sources: [
          ...prev.sources,
          {
            url: newSource.url!,
            title: newSource.title!,
            publisher: newSource.publisher || "Unknown",
            accessedAt: new Date().toISOString().split("T")[0],
            usedFor: ["summary_2025"],
          },
        ],
      }));
      setNewSource({});
    }
  };

  const removeSource = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with nominee info */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{nominee.name}</h2>
          <p className="text-sm text-muted-foreground">
            {nominee.awardTitle} → {nominee.subcategoryTitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {formData.kind === "person" ? (
              <><User className="w-3 h-3 mr-1" />Person</>
            ) : (
              <><Building2 className="w-3 h-3 mr-1" />Organization</>
            )}
          </Badge>
          <Select
            value={formData.status}
            onValueChange={(value: EnrichedNomineeProfile["status"]) => 
              setFormData(prev => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Kind toggle */}
      <div className="flex items-center gap-4">
        <Label>Type:</Label>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={formData.kind === "person" ? "default" : "outline"}
            onClick={() => setFormData(prev => ({ ...prev, kind: "person" }))}
          >
            <User className="w-4 h-4 mr-1" />
            Person
          </Button>
          <Button
            size="sm"
            variant={formData.kind === "organization" ? "default" : "outline"}
            onClick={() => setFormData(prev => ({ ...prev, kind: "organization" }))}
          >
            <Building2 className="w-4 h-4 mr-1" />
            Organization
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <Label>Summary (150-250 words)</Label>
        <Textarea
          value={formData.summary_2025}
          onChange={(e) => setFormData(prev => ({ ...prev, summary_2025: e.target.value }))}
          placeholder="Write a 150-250 word summary focusing on contributions to Education for All in Africa..."
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          {formData.summary_2025.split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

      {/* Contributions */}
      <div className="space-y-2">
        <Label>Education for All Contributions (3-6 bullet points)</Label>
        <div className="space-y-2">
          {formData.education_for_all_contributions.map((contrib, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-muted-foreground mt-2">•</span>
              <span className="flex-1 text-sm p-2 bg-muted rounded">{contrib}</span>
              <Button size="icon" variant="ghost" onClick={() => removeContribution(idx)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newContribution}
            onChange={(e) => setNewContribution(e.target.value)}
            placeholder="Add a measurable contribution..."
            onKeyDown={(e) => e.key === "Enter" && addContribution()}
          />
          <Button onClick={addContribution} disabled={!newContribution.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-2">
        <Label>Highlights (short phrases)</Label>
        <div className="flex flex-wrap gap-2">
          {formData.highlights.map((highlight, idx) => (
            <Badge key={idx} variant="secondary" className="gap-1">
              {highlight}
              <button onClick={() => removeHighlight(idx)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="Add a highlight..."
            onKeyDown={(e) => e.key === "Enter" && addHighlight()}
          />
          <Button onClick={addHighlight} disabled={!newHighlight.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-3">
        <Label>Social Links</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Globe className="w-3 h-3" /> Website
            </Label>
            <Input
              value={formData.social_links.website || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_links: { ...prev.social_links, website: e.target.value || undefined },
              }))}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Linkedin className="w-3 h-3" /> LinkedIn
            </Label>
            <Input
              value={formData.social_links.linkedin || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_links: { ...prev.social_links, linkedin: e.target.value || undefined },
              }))}
              placeholder="https://linkedin.com/..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">X (Twitter)</Label>
            <Input
              value={formData.social_links.x || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_links: { ...prev.social_links, x: e.target.value || undefined },
              }))}
              placeholder="https://x.com/..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Instagram className="w-3 h-3" /> Instagram
            </Label>
            <Input
              value={formData.social_links.instagram || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_links: { ...prev.social_links, instagram: e.target.value || undefined },
              }))}
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-2">
        <Label>Sources (citations)</Label>
        <div className="space-y-2">
          {formData.sources.map((source, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 truncate">{source.title} — {source.publisher}</span>
              <Button size="icon" variant="ghost" onClick={() => removeSource(idx)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            value={newSource.url || ""}
            onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
            placeholder="URL"
          />
          <Input
            value={newSource.title || ""}
            onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Title"
          />
          <div className="flex gap-1">
            <Input
              value={newSource.publisher || ""}
              onChange={(e) => setNewSource(prev => ({ ...prev, publisher: e.target.value }))}
              placeholder="Publisher"
            />
            <Button onClick={addSource} disabled={!newSource.url || !newSource.title}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>Admin Notes (internal)</Label>
        <Textarea
          value={formData.notes || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Optional internal notes..."
          rows={2}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Profile
        </Button>
      </div>
    </div>
  );
}

// Nominee list item
function NomineeListItem({
  nominee,
  profile,
  isSelected,
  onClick,
}: {
  nominee: EnrichedNominee;
  profile?: EnrichedNomineeProfile;
  isSelected: boolean;
  onClick: () => void;
}) {
  const kind = profile?.kind || classifyNominee(nominee.name);
  const status = profile?.status;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        {kind === "organization" ? (
          <Building2 className="w-5 h-5 text-muted-foreground" />
        ) : (
          <User className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{nominee.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {nominee.subcategoryTitle}
        </p>
      </div>
      {status && (
        <Badge
          variant={
            status === "approved" ? "default" :
            status === "pending_review" ? "secondary" :
            "outline"
          }
          className="text-xs"
        >
          {status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
          {status === "pending_review" && <Clock className="w-3 h-3 mr-1" />}
          {status === "draft" && <FileText className="w-3 h-3 mr-1" />}
          {status}
        </Badge>
      )}
    </div>
  );
}

export default function AdminNomineeProfiles() {
  const { 
    profiles, 
    saveProfile, 
    createProfile, 
    exportProfiles, 
    importProfiles,
    stats,
    isLoading 
  } = useEnrichedProfiles();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterHasProfile, setFilterHasProfile] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  
  // Load nominees
  const nominees = useMemo(() => getAllNominees(), []);
  
  // Filter nominees
  const filteredNominees = useMemo(() => {
    let result = nominees;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.name.toLowerCase().includes(query) ||
        n.subcategoryTitle.toLowerCase().includes(query)
      );
    }
    
    if (filterHasProfile) {
      result = result.filter(n => !!profiles[n.slug]);
    }
    
    if (filterStatus !== "all") {
      result = result.filter(n => profiles[n.slug]?.status === filterStatus);
    }
    
    return result.slice(0, 100); // Limit for performance
  }, [nominees, searchQuery, filterStatus, filterHasProfile, profiles]);
  
  const selectedNominee = nominees.find(n => n.slug === selectedSlug);
  const selectedProfile = selectedSlug ? profiles[selectedSlug] : undefined;
  
  // Export handler
  const handleExport = () => {
    const json = exportProfiles();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nomineeProfiles.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported profiles to JSON");
  };
  
  // Import handler
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const count = importProfiles(event.target?.result as string);
        toast.success(`Imported ${count} profiles`);
      } catch {
        toast.error("Failed to import: Invalid JSON");
      }
    };
    reader.readAsText(file);
  };
  
  // Create new profile for selected nominee
  const handleCreateProfile = () => {
    if (!selectedNominee) return;
    const kind = classifyNominee(selectedNominee.name);
    createProfile(selectedNominee.slug, kind);
    toast.success("Profile created");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nominee Profile Editor</h1>
          <p className="text-muted-foreground">
            Create and manage enriched profiles for nominees
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
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{nominees.length}</p>
            <p className="text-sm text-muted-foreground">Total Nominees</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{stats.approved}</p>
            <p className="text-sm text-muted-foreground">Approved Profiles</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{stats.draft}</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-320px)]">
        {/* Left panel - Nominee list */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Nominees</CardTitle>
            <div className="space-y-2">
              <Input
                placeholder="Search nominees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending_review">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Switch
                    id="has-profile"
                    checked={filterHasProfile}
                    onCheckedChange={setFilterHasProfile}
                  />
                  <Label htmlFor="has-profile" className="text-xs">Has profile</Label>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-520px)]">
              <div className="p-3 space-y-1">
                {filteredNominees.map((nominee) => (
                  <NomineeListItem
                    key={nominee.slug}
                    nominee={nominee}
                    profile={profiles[nominee.slug]}
                    isSelected={selectedSlug === nominee.slug}
                    onClick={() => setSelectedSlug(nominee.slug)}
                  />
                ))}
                {filteredNominees.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No nominees found
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right panel - Editor */}
        <Card className="col-span-2">
          <CardContent className="p-6 h-full overflow-auto">
            {selectedNominee ? (
              selectedProfile ? (
                <ProfileEditor
                  profile={selectedProfile}
                  nominee={selectedNominee}
                  onSave={saveProfile}
                  onCancel={() => setSelectedSlug(null)}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <User className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">{selectedNominee.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    No enriched profile yet. Create one to add summary, contributions, and social links.
                  </p>
                  <Button onClick={handleCreateProfile}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Profile
                  </Button>
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Nominee</h3>
                  <p className="text-muted-foreground">
                    Choose a nominee from the list to view or edit their profile
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
