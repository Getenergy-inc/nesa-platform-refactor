/**
 * NRC Review Checklist Component
 * Interactive verification checklist for human NRC reviewers
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  FolderOpen,
  FileCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { NRC_VERIFICATION_CHECKLIST, type NRCReviewDecision } from "@/config/nrcConfig";
import type { NRCReviewPayload } from "@/types/nrcAutomation";

interface NRCReviewChecklistProps {
  nominationId: string;
  onSubmit: (payload: NRCReviewPayload) => void;
  isSubmitting?: boolean;
  categories?: Array<{ id: string; name: string }>;
  subcategories?: Array<{ id: string; name: string; category_id: string }>;
}

interface ChecklistState {
  identity_match: boolean | null;
  category_fit: boolean | null;
  evidence_sufficiency: number | null;
  evidence_authenticity: "none" | "medium" | "high" | null;
  timeframe_fit: boolean | null;
  duplication_status: "unique" | "possible_duplicate" | "confirmed_duplicate" | null;
  reviewer_notes: string;
  suggested_category_id: string | null;
  suggested_subcategory_id: string | null;
}

const categoryIcons = {
  identity: User,
  category_fit: FolderOpen,
  evidence: FileCheck,
  risk: ShieldAlert,
};

const categoryLabels = {
  identity: "Identity & Existence",
  category_fit: "Category Fit",
  evidence: "Evidence Quality",
  risk: "Risk Assessment",
};

export function NRCReviewChecklist({
  nominationId,
  onSubmit,
  isSubmitting,
  categories = [],
  subcategories = [],
}: NRCReviewChecklistProps) {
  const [state, setState] = useState<ChecklistState>({
    identity_match: null,
    category_fit: null,
    evidence_sufficiency: null,
    evidence_authenticity: null,
    timeframe_fit: null,
    duplication_status: null,
    reviewer_notes: "",
    suggested_category_id: null,
    suggested_subcategory_id: null,
  });

  const [selectedDecision, setSelectedDecision] = useState<NRCReviewDecision | null>(null);

  // Group checklist items by category
  const groupedChecklist = NRC_VERIFICATION_CHECKLIST.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof NRC_VERIFICATION_CHECKLIST>);

  const canSubmit = () => {
    return (
      selectedDecision !== null &&
      state.identity_match !== null &&
      state.category_fit !== null &&
      state.evidence_sufficiency !== null &&
      state.duplication_status !== null &&
      (selectedDecision !== "REJECT" || state.reviewer_notes.trim().length > 0)
    );
  };

  const handleSubmit = () => {
    if (!canSubmit() || !selectedDecision) return;

    const payload: NRCReviewPayload = {
      nomination_id: nominationId,
      review_type: "full",
      decision: selectedDecision,
      identity_match: state.identity_match ?? undefined,
      category_fit: state.category_fit ?? undefined,
      evidence_sufficiency: state.evidence_sufficiency ?? undefined,
      evidence_authenticity: state.evidence_authenticity ?? undefined,
      timeframe_fit: state.timeframe_fit ?? undefined,
      duplication_status: state.duplication_status ?? undefined,
      reviewer_notes: state.reviewer_notes || undefined,
      suggested_category_id: state.suggested_category_id ?? undefined,
      suggested_subcategory_id: state.suggested_subcategory_id ?? undefined,
    };

    onSubmit(payload);
  };

  const getCompletionStatus = () => {
    const required = [
      state.identity_match,
      state.category_fit,
      state.evidence_sufficiency,
      state.duplication_status,
    ];
    const completed = required.filter((v) => v !== null).length;
    return { completed, total: required.length };
  };

  const { completed, total } = getCompletionStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Verification Checklist</CardTitle>
          <Badge variant={completed === total ? "default" : "secondary"}>
            {completed}/{total} completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Accordion type="multiple" defaultValue={["identity", "category_fit", "evidence", "risk"]}>
          {(Object.keys(groupedChecklist) as Array<keyof typeof categoryLabels>).map((category) => {
            const Icon = categoryIcons[category];
            const items = groupedChecklist[category];

            return (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{categoryLabels[category]}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {items.length} checks
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {/* Identity Section */}
                  {category === "identity" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Identity Match</Label>
                        <RadioGroup
                          value={state.identity_match === null ? "" : state.identity_match.toString()}
                          onValueChange={(v) => setState(s => ({ ...s, identity_match: v === "true" }))}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="id-pass" />
                            <Label htmlFor="id-pass" className="flex items-center gap-1 cursor-pointer">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              Pass
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="id-fail" />
                            <Label htmlFor="id-fail" className="flex items-center gap-1 cursor-pointer">
                              <XCircle className="h-4 w-4 text-destructive" />
                              Fail
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Duplication Check</Label>
                        <Select
                          value={state.duplication_status || ""}
                          onValueChange={(v) => setState(s => ({ ...s, duplication_status: v as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unique">Unique - No duplicates</SelectItem>
                            <SelectItem value="possible_duplicate">Possible Duplicate</SelectItem>
                            <SelectItem value="confirmed_duplicate">Confirmed Duplicate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Category Fit Section */}
                  {category === "category_fit" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Category/Subcategory Fit</Label>
                        <RadioGroup
                          value={state.category_fit === null ? "" : state.category_fit.toString()}
                          onValueChange={(v) => setState(s => ({ ...s, category_fit: v === "true" }))}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="cat-pass" />
                            <Label htmlFor="cat-pass" className="flex items-center gap-1 cursor-pointer">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              Correct
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="cat-fail" />
                            <Label htmlFor="cat-fail" className="flex items-center gap-1 cursor-pointer">
                              <XCircle className="h-4 w-4 text-destructive" />
                              Needs Reclassification
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {state.category_fit === false && categories.length > 0 && (
                        <div className="space-y-2 pl-4 border-l-2 border-warning">
                          <Label>Suggested Category</Label>
                          <Select
                            value={state.suggested_category_id || ""}
                            onValueChange={(v) => setState(s => ({ 
                              ...s, 
                              suggested_category_id: v,
                              suggested_subcategory_id: null 
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Timeframe Fit</Label>
                        <RadioGroup
                          value={state.timeframe_fit === null ? "" : state.timeframe_fit.toString()}
                          onValueChange={(v) => setState(s => ({ ...s, timeframe_fit: v === "true" }))}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="time-pass" />
                            <Label htmlFor="time-pass" className="flex items-center gap-1 cursor-pointer">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              Within Window
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="time-fail" />
                            <Label htmlFor="time-fail" className="flex items-center gap-1 cursor-pointer">
                              <XCircle className="h-4 w-4 text-destructive" />
                              Outside Window
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {/* Evidence Section */}
                  {category === "evidence" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Evidence Sufficiency (0-5)</Label>
                        <Select
                          value={state.evidence_sufficiency?.toString() || ""}
                          onValueChange={(v) => setState(s => ({ ...s, evidence_sufficiency: parseInt(v) }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Rate evidence quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0 - No evidence</SelectItem>
                            <SelectItem value="1">1 - Very insufficient</SelectItem>
                            <SelectItem value="2">2 - Insufficient</SelectItem>
                            <SelectItem value="3">3 - Acceptable</SelectItem>
                            <SelectItem value="4">4 - Good</SelectItem>
                            <SelectItem value="5">5 - Excellent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Evidence Authenticity Flags</Label>
                        <Select
                          value={state.evidence_authenticity || ""}
                          onValueChange={(v) => setState(s => ({ ...s, evidence_authenticity: v as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select authenticity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None - All evidence appears authentic</SelectItem>
                            <SelectItem value="medium">Medium - Some concerns</SelectItem>
                            <SelectItem value="high">High - Significant concerns</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Risk Section */}
                  {category === "risk" && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground">
                        Risk flags are automatically assessed based on your checklist responses. 
                        Add any specific concerns in the notes section below.
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Separator />

        {/* Reviewer Notes */}
        <div className="space-y-2">
          <Label>Reviewer Notes</Label>
          <Textarea
            placeholder="Add detailed notes about your review findings..."
            value={state.reviewer_notes}
            onChange={(e) => setState(s => ({ ...s, reviewer_notes: e.target.value }))}
            className="min-h-[100px]"
          />
          {selectedDecision === "REJECT" && !state.reviewer_notes.trim() && (
            <p className="text-sm text-destructive">Notes are required for rejection</p>
          )}
        </div>

        <Separator />

        {/* Decision */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Final Decision</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(["APPROVE", "REJECT", "REQUEST_MORE_EVIDENCE", "RECLASSIFY", "ESCALATE"] as NRCReviewDecision[]).map((decision) => (
              <Button
                key={decision}
                variant={selectedDecision === decision ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDecision(decision)}
                className={cn(
                  "h-auto py-2 px-3 text-xs",
                  selectedDecision === decision && decision === "APPROVE" && "bg-success hover:bg-success/90",
                  selectedDecision === decision && decision === "REJECT" && "bg-destructive hover:bg-destructive/90"
                )}
              >
                {decision.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button 
          onClick={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
          className="w-full"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Review
        </Button>
      </CardContent>
    </Card>
  );
}
