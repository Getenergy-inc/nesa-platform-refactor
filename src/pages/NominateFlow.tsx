import { useEffect, useMemo, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/lib/analytics";
import { changeLanguage } from "@/lib/i18n";
import { isValidLocale } from "@/config/i18n.config";

import { LanguageSwitcher } from "@/components/i18n";
import { NominationProgressBar } from "@/components/nominate/NominationProgressBar";
import { NominationFlashMessage } from "@/components/nominate/NominationFlashMessage";
import { NominationPathwaySelector } from "@/components/nominate/NominationPathwaySelector";
import { NomineeEntryForm } from "@/components/nominate/NomineeEntryForm";
import { ReviewAllNomineesStep } from "@/components/nominate/ReviewAllNomineesStep";
import { FinalSubmitterIdentityForm } from "@/components/nominate/FinalSubmitterIdentityForm";
import { SignupAtSubmissionStep } from "@/components/nominate/SignupAtSubmissionStep";
import { NominationConfirmationScreen } from "@/components/nominate/NominationConfirmationScreen";
import type {
  FlowState,
  FlowStep,
  NomineeEntry,
  NominationPathway,
  SubmitterIdentity,
} from "@/components/nominate/types";

const SESSION_KEY = "nesa-nomination-flow-v1";

/**
 * Map a URL `?family=` slug (or audit long name) onto the local
 * NominationPathway. Accepts kebab-case slugs, audit long names, and a few
 * historical aliases so that legacy CTAs and the new 54-form taxonomy both
 * resolve correctly.
 */
function resolvePathwayFromFamily(
  family: string | undefined,
): NominationPathway | null {
  if (!family) return null;
  const f = family.toLowerCase();
  if (/icon|lifetime|legend/.test(f)) return "icon";
  if (/influenc|creator|musician|footballer|sports|social-media/.test(f))
    return "influencer";
  if (/platinum|institutional/.test(f)) return "platinum";
  if (/gold|blue|garnet|competitive/.test(f)) return "gold-bluegarnet";
  if (/rmsa|special-needs|school-intervention/.test(f))
    return "special-needs-school";
  return null;
}


type Action =
  | { type: "SET_STEP"; step: FlowStep }
  | { type: "SET_PATHWAY"; pathway: NominationPathway }
  | { type: "ADD_ENTRY"; entry: NomineeEntry }
  | { type: "UPDATE_ENTRY"; entry: NomineeEntry }
  | { type: "REMOVE_ENTRY"; id: string }
  | { type: "EDIT_ENTRY"; id: string | null }
  | { type: "SET_SUBMITTER"; submitter: SubmitterIdentity }
  | { type: "SET_PRESELECT"; preselect: FlowState["preselect"] }
  | { type: "RESET" };

const initial: FlowState = {
  step: "flash",
  pathway: null,
  entries: [],
  editingId: null,
  submitter: null,
  preselect: {},
};

function reducer(state: FlowState, action: Action): FlowState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_PATHWAY":
      return { ...state, pathway: action.pathway, step: "entry", editingId: null };
    case "ADD_ENTRY":
      return { ...state, entries: [...state.entries, action.entry], step: "review" };
    case "UPDATE_ENTRY":
      return {
        ...state,
        entries: state.entries.map((e) => (e.id === action.entry.id ? action.entry : e)),
        step: "review",
        editingId: null,
      };
    case "REMOVE_ENTRY":
      return { ...state, entries: state.entries.filter((e) => e.id !== action.id) };
    case "EDIT_ENTRY":
      return { ...state, editingId: action.id, step: action.id ? "entry" : state.step };
    case "SET_SUBMITTER":
      return { ...state, submitter: action.submitter, step: "auth" };
    case "SET_PRESELECT":
      return { ...state, preselect: action.preselect };
    case "RESET":
      return initial;
    default:
      return state;
  }
}

function loadInitial(): FlowState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as FlowState;
    // Don't restore terminal steps
    if (parsed.step === "confirmation") return initial;
    return { ...initial, ...parsed };
  } catch {
    return initial;
  }
}

export default function NominateFlow() {
  const { t, i18n } = useTranslation("nomination");
  const [params, setParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  // Sync URL ?lang= -> i18n on mount / external navigation
  useEffect(() => {
    const langParam = params.get("lang");
    if (langParam && isValidLocale(langParam) && langParam !== i18n.language) {
      changeLanguage(langParam);
    }
  }, [params, i18n.language]);

  // Sync i18n -> URL ?lang= when user switches language via UI
  useEffect(() => {
    const langParam = params.get("lang");
    if (i18n.language && i18n.language !== langParam) {
      const next = new URLSearchParams(params);
      next.set("lang", i18n.language);
      setParams(next, { replace: true });
    }
  }, [i18n.language, params, setParams]);

  // Capture URL preselects (Pass C — supports awardFamily, recognitionClass,
  // subcategory, zone, state in addition to family/category/region).
  useEffect(() => {
    const preselect = {
      family: params.get("family") ?? undefined,
      awardFamily: params.get("awardFamily") ?? undefined,
      recognitionClass: params.get("recognitionClass") ?? undefined,
      category: params.get("category") ?? undefined,
      subcategory: params.get("subcategory") ?? undefined,
      region: params.get("region") ?? undefined,
      zone: params.get("zone") ?? undefined,
      state: params.get("state") ?? undefined,
    };
    dispatch({ type: "SET_PRESELECT", preselect });

    // URL-driven preselect bypasses the old family cards entirely.
    // Map an incoming `family` query slug to a NominationPathway and jump
    // straight to the entry form (or pathway picker if only family given).
    const pathway = resolvePathwayFromFamily(preselect.family);
    if (state.step === "flash" && state.entries.length === 0) {
      if (pathway && preselect.category) {
        dispatch({ type: "SET_PATHWAY", pathway });
      } else if (pathway) {
        dispatch({ type: "SET_PATHWAY", pathway });
      } else if (preselect.family) {
        dispatch({ type: "SET_STEP", step: "subcategory" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);


  // Persist to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // Analytics on step transitions
  useEffect(() => {
    trackEvent("nominate_flow_step", {
      step: state.step,
      entries: state.entries.length,
      pathway: state.pathway,
      source: "flow",
    });
  }, [state.step, state.entries.length, state.pathway]);

  const editing = useMemo(
    () => state.entries.find((e) => e.id === state.editingId) ?? null,
    [state.entries, state.editingId],
  );

  // ---------------- handlers ----------------
  const handleStart = () => {
    trackEvent("nominate_start", { source: "flash" });
    dispatch({ type: "SET_STEP", step: "subcategory" });
  };

  const handlePathway = (p: NominationPathway) => {
    trackEvent("nominate_pathway_selected", { pathway: p });
    dispatch({ type: "SET_PATHWAY", pathway: p });
  };

  const handleSaveEntry = (entry: Omit<NomineeEntry, "id"> & { id?: string }) => {
    if (entry.id && state.entries.some((e) => e.id === entry.id)) {
      dispatch({ type: "UPDATE_ENTRY", entry: entry as NomineeEntry });
      toast.success(t("flow.toast.updated"));
      trackEvent("nominate_entry_updated", { id: entry.id });
    } else {
      const id = entry.id ?? `nm_${Math.random().toString(36).slice(2, 10)}`;
      const full = { ...(entry as NomineeEntry), id };
      dispatch({ type: "ADD_ENTRY", entry: full });
      toast.success(t("flow.toast.added"));
      trackEvent("nominate_entry_added", {
        pathway: full.pathway,
        total: state.entries.length + 1,
      });
    }
  };

  const handleSubmit = (mode: "create" | "signin" | "verify") => {
    trackEvent("nominate_submit", {
      mode,
      total: state.entries.length,
      pathways: Array.from(new Set(state.entries.map((e) => e.pathway))),
    });
    // Backend not yet wired — mark complete locally
    toast.success(t("flow.toast.recorded"));
    dispatch({ type: "SET_STEP", step: "confirmation" });
  };

  const reset = () => {
    sessionStorage.removeItem(SESSION_KEY);
    dispatch({ type: "RESET" });
  };

  // ---------------- render ----------------
  return (
    <>
      <Helmet>
        <title>{t("flow.meta.title")}</title>
        <meta name="description" content={t("flow.meta.description")} />
      </Helmet>

      <div className="bg-charcoal min-h-screen">
        <div className="container max-w-4xl py-8 md:py-12 space-y-8">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex-1 min-w-0">
              <NominationProgressBar current={state.step} />
            </div>
            <LanguageSwitcher variant="compact" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={state.step + (state.editingId ?? "")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {state.step === "flash" && <NominationFlashMessage onStart={handleStart} />}

              {state.step === "subcategory" && (
                <NominationPathwaySelector
                  onSelect={handlePathway}
                  preselectFamily={state.preselect.family}
                />
              )}

              {state.step === "entry" && state.pathway && (
                <NomineeEntryForm
                  pathway={state.pathway}
                  initial={editing}
                  preselect={state.preselect}
                  totalEntries={state.entries.length}
                  onCancel={() =>
                    dispatch({
                      type: "SET_STEP",
                      step: state.entries.length > 0 ? "review" : "subcategory",
                    })
                  }
                  onSave={handleSaveEntry}
                />
              )}

              {state.step === "review" && (
                <ReviewAllNomineesStep
                  entries={state.entries}
                  onAddAnother={() => dispatch({ type: "SET_STEP", step: "subcategory" })}
                  onEdit={(id) => dispatch({ type: "EDIT_ENTRY", id })}
                  onRemove={(id) => {
                    dispatch({ type: "REMOVE_ENTRY", id });
                    trackEvent("nominate_entry_removed", { id });
                  }}
                  onContinue={() => dispatch({ type: "SET_STEP", step: "identity" })}
                />
              )}

              {state.step === "identity" && (
                <FinalSubmitterIdentityForm
                  initial={state.submitter}
                  onBack={() => dispatch({ type: "SET_STEP", step: "review" })}
                  onContinue={(s) => dispatch({ type: "SET_SUBMITTER", submitter: s })}
                />
              )}

              {state.step === "auth" && state.submitter && (
                <SignupAtSubmissionStep
                  submitter={state.submitter}
                  entries={state.entries}
                  onBack={() => dispatch({ type: "SET_STEP", step: "identity" })}
                  onSubmit={handleSubmit}
                />
              )}

              {state.step === "confirmation" && (
                <NominationConfirmationScreen
                  count={state.entries.length}
                  onNominateAnother={reset}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
