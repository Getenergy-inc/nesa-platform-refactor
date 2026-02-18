// Rebuild My School Africa — Config-driven timeline & regions
// All dates/milestones must be consumed from here; NO hardcoded years in UI.

import { MapPin, Vote, Heart, FileText, type LucideIcon } from "lucide-react";

// ─── TIMELINE MILESTONES ─────────────────────────────────────────────────────

export interface RebuildMilestone {
  label: string;
  description: string;
  date: string; // ISO date (config-driven)
  displayDate: string; // Human-readable (derived from date)
  icon: LucideIcon;
}

export const REBUILD_MILESTONES: RebuildMilestone[] = [
  {
    label: "School Nominations Open",
    description: "Communities nominate deserving special needs schools in their region",
    date: "2026-06-01",
    displayDate: "June 2026",
    icon: MapPin,
  },
  {
    label: "Regional Public Voting",
    description: "Shortlisted schools go to public voting across all five regions",
    date: "2026-12-01",
    displayDate: "December 2026",
    icon: Vote,
  },
  {
    label: "Intervention Begins",
    description: "EduAid-Africa delivers facility upgrades, resources, and teacher training",
    date: "2027-02-01",
    displayDate: "February 2027",
    icon: Heart,
  },
  {
    label: "Legacy Impact Report Published",
    description: "Transparent reporting on outcomes, fund allocation, and community benefit",
    date: "2027-05-01",
    displayDate: "May 2027",
    icon: FileText,
  },
];

// ─── GOVERNANCE STATUS FLOW ──────────────────────────────────────────────────

export const REBUILD_STATUS_FLOW = [
  { key: "draft", label: "Draft", description: "Nomination form started" },
  { key: "submitted", label: "Submitted", description: "Nomination received by the platform" },
  { key: "under_review", label: "Under Review", description: "SCEF Regional Board reviewing submission" },
  { key: "region_shortlisted", label: "Region Shortlisted", description: "School shortlisted for regional voting" },
  { key: "verified_for_voting", label: "Verified for Voting", description: "Identity and documentation verified" },
  { key: "intervention_approved", label: "Intervention Approved", description: "Board-approved for EduAid-Africa intervention" },
  { key: "intervention_completed", label: "Intervention Completed", description: "Facility upgrade and support delivered" },
  { key: "impact_report_published", label: "Impact Report Published", description: "Outcomes and audit report made public" },
] as const;

// ─── REGIONS ─────────────────────────────────────────────────────────────────

export interface RebuildRegion {
  name: string;
  slug: string;
  countries: string[];
}

export const REBUILD_REGIONS: RebuildRegion[] = [
  {
    name: "West Africa",
    slug: "west-africa",
    countries: ["Nigeria", "Ghana", "Senegal", "Sierra Leone", "Liberia", "Mali", "Burkina Faso", "Togo", "Benin", "Niger", "Guinea", "Côte d'Ivoire", "Gambia", "Guinea-Bissau", "Cape Verde", "Mauritania"],
  },
  {
    name: "East Africa",
    slug: "east-africa",
    countries: ["Kenya", "Uganda", "Tanzania", "Ethiopia", "Rwanda", "Burundi", "Somalia", "Djibouti", "Eritrea", "South Sudan"],
  },
  {
    name: "Southern Africa",
    slug: "southern-africa",
    countries: ["South Africa", "Zimbabwe", "Mozambique", "Zambia", "Malawi", "Botswana", "Namibia", "Lesotho", "Eswatini", "Angola"],
  },
  {
    name: "North Africa",
    slug: "north-africa",
    countries: ["Egypt", "Morocco", "Tunisia", "Algeria", "Libya", "Sudan"],
  },
  {
    name: "Central Africa",
    slug: "central-africa",
    countries: ["Cameroon", "DRC", "Congo-Brazzaville", "Gabon", "Chad", "Central African Republic", "Equatorial Guinea", "São Tomé & Príncipe"],
  },
];

// ─── FUND FLOW ───────────────────────────────────────────────────────────────

export const REBUILD_FUND_FLOW = [
  "Supporters",
  "NESA Platform",
  "EduAid Africa Regional Fund",
  "SCEF Board Approval",
  "Intervention Project",
] as const;

// ─── BADGES ──────────────────────────────────────────────────────────────────

export const REBUILD_BADGES = [
  "EduAid Africa • Service",
  "NESA-Africa 2025 • Post-Award Legacy Project",
  "Governed by SCEF Regional BOD",
] as const;

// Helper: check if nominations stage is open (date-driven fallback)
export function isRebuildNominationsOpen(): boolean {
  const now = new Date();
  const opensAt = new Date(REBUILD_MILESTONES[0].date);
  const closesAt = new Date(REBUILD_MILESTONES[1].date);
  return now >= opensAt && now < closesAt;
}
