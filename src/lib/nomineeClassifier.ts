/**
 * Nominee Classification Utilities
 * Determines if a nominee is a person or organization based on name patterns
 */

import type { NomineeKind } from "@/types/nomineeImages";

// Keywords indicating an organization/company (vs a person)
const ORGANIZATION_KEYWORDS = [
  // Corporate structures
  "ltd", "limited", "inc", "incorporated", "llc", "llp", "plc", "corp", "corporation",
  "company", "co.", "& co", "group", "holdings", "enterprises", "industries",
  
  // Educational institutions
  "university", "college", "school", "academy", "institute", "polytechnic", 
  "seminary", "educational", "education",
  
  // Government & public sector
  "ministry", "department", "agency", "authority", "commission", "council",
  "government", "federal", "state", "municipal", "national",
  
  // Non-profit & NGO
  "foundation", "ngo", "non-profit", "nonprofit", "charity", "trust",
  "association", "society", "organization", "organisation", "federation",
  "alliance", "network", "coalition", "consortium",
  
  // Healthcare
  "hospital", "clinic", "medical", "health", "healthcare", "pharmaceutical",
  
  // Financial
  "bank", "banking", "insurance", "finance", "financial", "investment", "capital",
  "microfinance", "credit",
  
  // Media & broadcasting
  "media", "broadcast", "broadcasting", "television", "tv", "radio", "press",
  "publishing", "newspaper", "magazine", "journal",
  
  // Telecom & tech
  "telecom", "telecommunications", "airtel", "mtn", "safaricom", "glo",
  "technology", "technologies", "tech", "digital", "systems", "solutions",
  
  // Other organizations
  "centre", "center", "club", "chamber", "board", "bureau", "office",
  "services", "consultants", "consulting", "partners", "associates",
  "hotel", "hotels", "resort", "airlines", "airways",
];

// Patterns that strongly indicate a person (not organization)
const PERSON_PATTERNS = [
  // Common honorifics
  /^(dr\.?|prof\.?|hon\.?|chief|alhaji|alhaja|engr\.?|arc\.?|barrister|sir|dame|lady)\s/i,
  // Names with "Mr/Mrs/Ms"
  /^(mr\.?|mrs\.?|ms\.?|miss)\s/i,
  // Names ending with typical surname patterns
  /\b(junior|jr\.?|senior|sr\.?|ii|iii|iv)$/i,
];

// Names that look like organizations but are actually people
const PERSON_EXCEPTIONS = [
  "bank anthony", // Anthony Bank (person name)
];

// Names that look like people but are actually organizations
const ORGANIZATION_EXCEPTIONS: string[] = [
  // Add any specific exceptions here
];

/**
 * Classify a nominee as person or organization based on their name
 */
export function classifyNominee(name: string): NomineeKind {
  const lowerName = name.toLowerCase().trim();
  
  // Check person exceptions first
  if (PERSON_EXCEPTIONS.some(exception => lowerName.includes(exception))) {
    return "person";
  }
  
  // Check organization exceptions
  if (ORGANIZATION_EXCEPTIONS.some(exception => lowerName.includes(exception))) {
    return "organization";
  }
  
  // Check for person patterns (honorifics, titles)
  if (PERSON_PATTERNS.some(pattern => pattern.test(name))) {
    return "person";
  }
  
  // Check for organization keywords
  if (ORGANIZATION_KEYWORDS.some(keyword => {
    // Match whole word or at word boundary
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lowerName);
  })) {
    return "organization";
  }
  
  // Default to person
  return "person";
}

/**
 * Get a confidence score for the classification (0-1)
 */
export function getClassificationConfidence(name: string): number {
  const lowerName = name.toLowerCase().trim();
  
  // Check person patterns - high confidence
  if (PERSON_PATTERNS.some(pattern => pattern.test(name))) {
    return 0.9;
  }
  
  // Count matching organization keywords
  const matchCount = ORGANIZATION_KEYWORDS.filter(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lowerName);
  }).length;
  
  if (matchCount >= 2) return 0.95; // Multiple org keywords = high confidence
  if (matchCount === 1) return 0.8; // Single org keyword = medium-high confidence
  
  // No strong signals - lower confidence for person default
  return 0.6;
}

/**
 * Build a search query for image search
 */
export function buildImageSearchQuery(
  name: string, 
  kind: NomineeKind,
  context?: { country?: string; organization?: string }
): string {
  const cleanName = name.trim();
  
  if (kind === "organization") {
    return `${cleanName} logo`;
  }
  
  // For persons, try to find a good portrait
  const parts = [cleanName];
  
  // Add context for better results
  if (context?.organization) {
    parts.push(context.organization);
  } else if (context?.country) {
    parts.push(context.country);
  }
  
  return parts.join(" ");
}

/**
 * Extract domain from organization name for Clearbit lookup (if applicable)
 */
export function extractPossibleDomain(name: string): string | null {
  // This is a heuristic - only works for well-known organizations
  const lowerName = name.toLowerCase().trim();
  
  // Known domain mappings
  const knownDomains: Record<string, string> = {
    "mtn": "mtn.com",
    "airtel": "airtel.com",
    "safaricom": "safaricom.co.ke",
    "standard bank": "standardbank.com",
    "access bank": "accessbankplc.com",
    "zenith bank": "zenithbank.com",
    "first bank": "firstbanknigeria.com",
    "uba": "ubagroup.com",
    "dangote": "dangote.com",
    "unesco": "unesco.org",
    "unicef": "unicef.org",
    "world bank": "worldbank.org",
  };
  
  for (const [key, domain] of Object.entries(knownDomains)) {
    if (lowerName.includes(key)) {
      return domain;
    }
  }
  
  return null;
}

/**
 * Get organization keywords for reference
 */
export function getOrganizationKeywords(): string[] {
  return [...ORGANIZATION_KEYWORDS];
}
