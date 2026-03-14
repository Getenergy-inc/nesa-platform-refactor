/**
 * NESA Africa — Enhanced Biography & Institutional Storytelling Generator
 * Generates structured narrative content for nominee profiles
 */

import type { MasterNominee } from "@/lib/nomineeMasterData";

export interface EnhancedBiography {
  overview: {
    fullName: string;
    country: string;
    category: string;
    pathway: string;
    nominationYear: number;
    nomineeId: string;
  };
  contributionNarrative: {
    title: string;
    paragraphs: string[];
  };
  impactHighlights: string[];
  institutionalSignificance: string[];
  recognitionCitation: string;
}

function isOrg(name: string): boolean {
  const kw = ["bank","foundation","university","association","network","company","state","institute","academy","school","college","fund","trust","society","ministry","agency","board","council","hospital","ngo","group","ltd","plc","organization","organisation","programme","program","commission","corporation","church","alliance","polytechnic","library"];
  return kw.some(k => name.toLowerCase().includes(k));
}

function seeded(seed: number, i: number): number {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[Math.floor(seeded(seed, offset) * arr.length)];
}

export function generateEnhancedBiography(nominee: MasterNominee): EnhancedBiography {
  const org = isOrg(nominee.name);
  const entity = org ? "organization" : "individual";
  const pronoun = org ? "the organization" : "they";
  const possessive = org ? "the organization's" : "their";
  const base = nominee.achievement || "Contributing to the advancement of education across Africa.";
  const sid = nominee.id;

  // Generate contribution narrative
  const impactVerbs = ["spearheaded","championed","pioneered","established","transformed","revolutionized","strengthened","advanced"];
  const scaleTerms = ["across multiple regions","reaching thousands of beneficiaries","impacting communities continent-wide","spanning several countries","touching lives in underserved areas"];
  const outcomeTerms = ["improved educational outcomes","enhanced learning quality","expanded access to education","strengthened institutional capacity","fostered innovation in pedagogy"];

  const verb = pick(impactVerbs, sid, 1);
  const scale = pick(scaleTerms, sid, 2);
  const outcome = pick(outcomeTerms, sid, 3);

  const paragraphs = [
    `${nominee.name} has ${verb} transformative efforts in the education sector ${scale}. ${base}`,
    `Through sustained commitment to educational excellence, ${pronoun} ha${org ? "s" : "ve"} ${outcome}. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} work addresses critical gaps in ${nominee.country || "Africa"}'s education landscape, from infrastructure development to curriculum innovation, creating a ripple effect that extends far beyond immediate beneficiaries.`,
    `Nominated under the "${nominee.subcategory}" subcategory within "${nominee.category}", ${nominee.name} exemplifies the caliber of ${entity}s that NESA Africa seeks to celebrate — those whose contributions create measurable, sustainable improvements in educational access, quality, and outcomes across the continent.`,
  ];

  // Impact highlights - deterministic based on nominee attributes
  const highlightPool = [
    `Demonstrated measurable impact in ${nominee.country || "Africa"} through education-focused programs`,
    `Contributed to improving educational infrastructure and learning environments`,
    `Strengthened educator capacity through training and professional development`,
    `Advanced digital literacy and technology integration in educational settings`,
    `Promoted inclusive education policies reaching marginalized communities`,
    `Built partnerships with educational institutions across the region`,
    `Supported scholarship programs enabling access for underserved students`,
    `Developed innovative curricula aligned with continental education standards`,
    `Fostered community engagement in education governance and planning`,
    `Created sustainable models for education financing and resource mobilization`,
  ];

  const highlights: string[] = [];
  const count = 4 + Math.floor(seeded(sid, 10) * 3); // 4–6 highlights
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(seeded(sid, 20 + i) * highlightPool.length);
    const h = highlightPool[idx];
    if (!highlights.includes(h)) highlights.push(h);
  }

  // Institutional significance
  const significance = [
    `${nominee.name}'s work directly contributes to expanding education access, ensuring that quality learning opportunities reach communities that have historically been underserved.`,
    `By ${org ? "operating" : "working"} within the ${nominee.pathway} pathway, ${pronoun} contribute${org ? "s" : ""} to building bridges between local educational needs and continental development goals as outlined in the AU Agenda 2063.`,
    `${possessive.charAt(0).toUpperCase() + possessive.slice(1)} efforts align with UN Sustainable Development Goal 4 (Quality Education), demonstrating how targeted interventions can create systemic change in Africa's education landscape.`,
  ];

  const citation = `${nominee.name} is recognized by NESA Africa for outstanding contributions to education across the continent. Through ${possessive} work in ${nominee.subcategory}, ${pronoun} ha${org ? "s" : "ve"} demonstrated exceptional commitment to transforming educational outcomes and building a stronger future for Africa's learners. This recognition honors ${possessive} role as a vital force in the advancement of quality, accessible, and inclusive education.`;

  return {
    overview: {
      fullName: nominee.name,
      country: nominee.country || "Africa",
      category: nominee.category,
      pathway: nominee.pathway,
      nominationYear: 2025,
      nomineeId: `NESA-2025-${String(nominee.id).padStart(4, "0")}`,
    },
    contributionNarrative: {
      title: `Contribution to African Education (2005–2025)`,
      paragraphs,
    },
    impactHighlights: highlights,
    institutionalSignificance: significance,
    recognitionCitation: citation,
  };
}
