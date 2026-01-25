import { useState, useEffect, useCallback } from "react";

const DRAFT_KEY = "nesa-nomination-draft";

export interface NominationDraft {
  selectedCategoryId: string;
  selectedSubcategoryId: string;
  nomineeName: string;
  nomineeTitle: string;
  nomineeOrganization: string;
  nomineeBio: string;
  justification: string;
  step: number;
  savedAt: string;
}

export function useNominationDraft() {
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDate, setDraftDate] = useState<Date | null>(null);

  // Check for existing draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as NominationDraft;
        setHasDraft(true);
        setDraftDate(new Date(draft.savedAt));
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  const saveDraft = useCallback((data: Omit<NominationDraft, "savedAt">) => {
    const draft: NominationDraft = {
      ...data,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setHasDraft(true);
    setDraftDate(new Date(draft.savedAt));
  }, []);

  const loadDraft = useCallback((): NominationDraft | null => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return null;
    
    try {
      return JSON.parse(saved) as NominationDraft;
    } catch {
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setDraftDate(null);
  }, []);

  return {
    hasDraft,
    draftDate,
    saveDraft,
    loadDraft,
    clearDraft,
  };
}
