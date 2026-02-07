/**
 * NESA-Africa 2025 — Red Flags & Enhanced Review Triggers
 */

export type RedFlagSeverity = "warning" | "critical" | "block";
export type RedFlagCategory = "data" | "safeguarding" | "coi" | "voting" | "brand";

export interface RedFlag {
  id: string;
  category: RedFlagCategory;
  label: string;
  description: string;
  severity: RedFlagSeverity;
  triggerAction: "enhanced_review" | "immediate_escalation" | "auto_reject";
  aiDetectable: boolean;
}

export const RED_FLAGS: RedFlag[] = [
  // Data Integrity
  {
    id: "rf_inconsistent_data",
    category: "data",
    label: "Inconsistent/Unverifiable Data",
    description: "Data submitted is inconsistent, contradictory, or cannot be verified against external sources",
    severity: "critical",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },
  {
    id: "rf_fabricated_evidence",
    category: "data",
    label: "Fabricated Evidence",
    description: "Evidence appears to be falsified, doctored, or misattributed",
    severity: "critical",
    triggerAction: "immediate_escalation",
    aiDetectable: true,
  },
  {
    id: "rf_inflated_metrics",
    category: "data",
    label: "Inflated Metrics",
    description: "KPIs or impact numbers appear significantly inflated or unrealistic",
    severity: "warning",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },

  // Safeguarding
  {
    id: "rf_safeguarding_complaints",
    category: "safeguarding",
    label: "Unaddressed Safeguarding Complaints",
    description: "Safeguarding complaints exist without documented corrective action",
    severity: "critical",
    triggerAction: "immediate_escalation",
    aiDetectable: true,
  },
  {
    id: "rf_missing_policy",
    category: "safeguarding",
    label: "Missing Safeguarding Policy",
    description: "No child protection or vulnerable person safeguarding policy in place",
    severity: "critical",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },
  {
    id: "rf_staff_vetting_gaps",
    category: "safeguarding",
    label: "Staff Vetting Gaps",
    description: "Staff working with children/vulnerable persons not properly vetted",
    severity: "critical",
    triggerAction: "enhanced_review",
    aiDetectable: false,
  },

  // Conflict of Interest
  {
    id: "rf_undisclosed_coi",
    category: "coi",
    label: "Undisclosed Conflicts of Interest",
    description: "Material conflicts of interest discovered that were not disclosed",
    severity: "critical",
    triggerAction: "immediate_escalation",
    aiDetectable: true,
  },
  {
    id: "rf_judge_relationship",
    category: "coi",
    label: "Judge Relationship",
    description: "Undisclosed relationship between nominee and one or more judges",
    severity: "critical",
    triggerAction: "immediate_escalation",
    aiDetectable: true,
  },
  {
    id: "rf_self_nomination_pattern",
    category: "coi",
    label: "Self-Nomination Pattern",
    description: "Pattern suggesting nominee is orchestrating their own nominations",
    severity: "warning",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },

  // Voting Anomalies (for public components)
  {
    id: "rf_vote_burst",
    category: "voting",
    label: "Extreme Vote Anomalies",
    description: "Unusual voting patterns suggesting manipulation (burst voting, bot activity)",
    severity: "critical",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },
  {
    id: "rf_device_reuse",
    category: "voting",
    label: "Device Reuse Pattern",
    description: "Multiple votes from same device/IP suggesting ballot stuffing",
    severity: "warning",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },
  {
    id: "rf_geographic_anomaly",
    category: "voting",
    label: "Geographic Voting Anomaly",
    description: "Votes originating from unexpected geographic locations",
    severity: "warning",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },

  // Brand & IP
  {
    id: "rf_brand_misuse",
    category: "brand",
    label: "Misuse of Brand/Names",
    description: "Misuse of NESA-Africa, SCEF, or partner organization branding",
    severity: "critical",
    triggerAction: "immediate_escalation",
    aiDetectable: true,
  },
  {
    id: "rf_ip_claims",
    category: "brand",
    label: "IP Claims",
    description: "Unsubstantiated intellectual property or attribution claims",
    severity: "warning",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },
  {
    id: "rf_false_endorsement",
    category: "brand",
    label: "False Endorsement Claims",
    description: "Claims of endorsement from organizations without verification",
    severity: "critical",
    triggerAction: "enhanced_review",
    aiDetectable: true,
  },
];

export const RED_FLAG_CATEGORY_LABELS: Record<RedFlagCategory, string> = {
  data: "Data Integrity",
  safeguarding: "Safeguarding",
  coi: "Conflict of Interest",
  voting: "Voting Anomalies",
  brand: "Brand & IP",
};

export const RED_FLAG_SEVERITY_CONFIG: Record<RedFlagSeverity, { label: string; color: string; icon: string }> = {
  warning: { label: "Warning", color: "amber", icon: "AlertTriangle" },
  critical: { label: "Critical", color: "orange", icon: "AlertCircle" },
  block: { label: "Blocking", color: "red", icon: "XOctagon" },
};

export const TRIGGER_ACTION_LABELS: Record<RedFlag["triggerAction"], string> = {
  enhanced_review: "Triggers Enhanced Review",
  immediate_escalation: "Immediate Escalation to NRC Lead",
  auto_reject: "Automatic Rejection",
};

/**
 * Check if any critical red flags are present
 */
export function hasCriticalRedFlags(flagIds: string[]): boolean {
  return flagIds.some(id => {
    const flag = RED_FLAGS.find(f => f.id === id);
    return flag?.severity === "critical" || flag?.severity === "block";
  });
}

/**
 * Get recommended action for a set of red flags
 */
export function getRecommendedAction(flagIds: string[]): RedFlag["triggerAction"] {
  const flags = flagIds.map(id => RED_FLAGS.find(f => f.id === id)).filter(Boolean);
  
  if (flags.some(f => f?.triggerAction === "auto_reject")) return "auto_reject";
  if (flags.some(f => f?.triggerAction === "immediate_escalation")) return "immediate_escalation";
  return "enhanced_review";
}
