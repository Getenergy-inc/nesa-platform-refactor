// NESA-Africa Contributors Hall of Fame
// Volunteers, Interns, Judges, BOA members from 2021 to date

export type ContributorRole =
  | "Volunteer"
  | "Intern"
  | "Judge"
  | "BOA"
  | "Ambassador"
  | "Partner";

export interface Contributor {
  id: string;
  name: string;
  role: ContributorRole;
  title?: string;
  country?: string;
  yearStart: number;
  yearEnd?: number; // undefined = present
  imageUrl?: string;
  bio?: string;
}

// Seed list — extend as records are confirmed.
export const CONTRIBUTORS: Contributor[] = [
  // 2021
  { id: "v-2021-01", name: "Volunteer Slot", role: "Volunteer", country: "Nigeria", yearStart: 2021 },
  // 2022
  { id: "j-2022-01", name: "Judge Slot", role: "Judge", country: "Kenya", yearStart: 2022 },
  // 2023
  { id: "boa-2023-01", name: "BOA Member Slot", role: "BOA", title: "Board of Advisors", country: "South Africa", yearStart: 2023 },
  // 2024
  { id: "i-2024-01", name: "Intern Slot", role: "Intern", country: "Ghana", yearStart: 2024 },
  // 2025
  { id: "amb-2025-01", name: "Ambassador Slot", role: "Ambassador", country: "Egypt", yearStart: 2025 },
];

export const ROLE_TABS: { key: ContributorRole | "All"; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Volunteer", label: "Volunteers" },
  { key: "Intern", label: "Interns" },
  { key: "Judge", label: "Judges" },
  { key: "BOA", label: "Board of Advisors" },
  { key: "Ambassador", label: "Ambassadors" },
];
