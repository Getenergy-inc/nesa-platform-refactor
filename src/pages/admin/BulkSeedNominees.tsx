/**
 * Admin page to bulk-seed all CSV nominees into the database.
 * Reads from nesaData CSV, maps subcategory slugs, and calls seed-nominees edge function.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getAllNominees, type EnrichedNominee } from "@/lib/nesaData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Pattern-based CSV subcategory slug → DB subcategory slug resolver.
 * Uses keyword matching since CSV slugs are long descriptive strings.
 */
function resolveSubcategorySlug(nominee: EnrichedNominee): string {
  const s = nominee.subcategorySlug.toLowerCase();
  const region = nominee.regionSlug;

  // Detect region suffix for Africa-regional nominees
  function regionSuffix(): string {
    if (!region) return "";
    if (region.includes("north")) return "north-africa";
    if (region.includes("east")) return "east-africa";
    if (region.includes("west")) return "west-africa";
    if (region.includes("south")) return "southern-africa";
    if (region.includes("central")) return "central-africa";
    return region;
  }

  // ===== ICON AWARDS =====
  if (s.includes("philanthropy-icon") || s.includes("africa-education-philanthropy")) return "icon-philanthropy";
  if (s.includes("technical-educator-icon")) return "icon-technical";
  if (s.includes("literary") || s.includes("curriculum-advocate")) return "icon-literary";
  if (s.includes("pioneer-icon")) return "icon-pioneer";
  if (s.includes("stem-innovator-icon")) return "icon-stem";
  if (s.includes("policy-champion")) return "icon-policy";

  // ===== DIASPORA =====
  if (s.includes("diaspora")) {
    if (s.includes("infrastructure")) return "diaspora-infrastructure";
    if (s.includes("scholarship")) return "diaspora-scholarship";
    if (s.includes("mentorship") || s.includes("training") || s.includes("innovation") || s.includes("program")) return "diaspora-mentorship";
    return "diaspora-americas"; // fallback
  }

  // ===== STATES (Nigeria) =====
  if (s.includes("education-initiative") || s.includes("education-friendly")) {
    if (s.includes("north-central")) return "state-ng-north-central";
    if (s.includes("north-east")) return "state-ng-north-east";
    if (s.includes("north-west")) return "state-ng-north-west";
    if (s.includes("south-east")) return "state-ng-south-east";
    if (s.includes("south-south")) return "state-ng-south-south";
    if (s.includes("south-west")) return "state-ng-south-west";
  }

  // ===== LIBRARY (Nigeria) =====
  if (s.includes("library") || s.includes("university-library") || s.includes("polytechnic-library") || s.includes("college-of-education-library") || s.includes("college-of-nursing")) {
    if (s.includes("university") && s.includes("public")) return "library-ng-fed-uni";
    if (s.includes("university") && s.includes("private")) return "library-ng-private-uni";
    if (s.includes("polytechnic") && s.includes("private")) return "library-ng-state-poly";
    if (s.includes("polytechnic")) return "library-ng-fed-poly";
    if (s.includes("college-of-education") && s.includes("public")) return "library-ng-coe";
    if (s.includes("college-of-education") && s.includes("private")) return "library-ng-private-colleges";
    if (s.includes("nursing")) return "library-ng-nursing";
    return "library-ng-fed-uni"; // fallback
  }

  // ===== R&D (Nigeria) =====
  if (s.includes("research-institute") || s.includes("research")) {
    if (s.includes("agricultural")) return "rd-ng-agric";
    if (s.includes("pharmaceutical") || s.includes("drug")) return "rd-ng-health";
    if (s.includes("environmental") || s.includes("ecological")) return "rd-ng-environmental";
    if (s.includes("engineering")) return "rd-ng-engineering";
    if (s.includes("social")) return "rd-ng-social";
    if (s.includes("medical") || s.includes("health")) return "rd-ng-health";
  }

  // ===== MEDIA (Nigeria) =====
  if (s.includes("print-media") || s.includes("print-media-educational")) return "media-ng-print";
  if (s.includes("radio-educational") || s.includes("radio")) return "media-ng-radio";
  if (s.includes("television-educational") || s.includes("television")) return "media-ng-tv";
  if (s.includes("digital-media-educational") || s.includes("digital-media")) return "media-ng-digital";

  // ===== INTERNATIONAL =====
  if (s.includes("international") || s.includes("bilateral") || s.includes("embassy")) {
    if (s.includes("embassy")) return "intl-embassies";
    if (s.includes("bilateral")) return "intl-bilateral";
    if (s.includes("ngo") || s.includes("support-service")) return "intl-ngo";
    if (s.includes("grant") || s.includes("foundation")) return "intl-foundations";
    if (s.includes("airline")) return "intl-bilateral";
    if (s.includes("leadership") || s.includes("training")) return "intl-bilateral";
    if (s.includes("multinational")) return "intl-mnc";
    if (s.includes("un-agenc")) return "intl-un";
    return "intl-bilateral";
  }

  // ===== CHRISTIAN =====
  if (s.includes("christian")) {
    if (s.includes("advocacy") || s.includes("reform")) return "christian-ngos";
    if (s.includes("infrastructure")) return "christian-foundations";
    if (s.includes("scholarship")) return "christian-schools";
    if (s.includes("holistic")) return "christian-foundations";
    return "christian-schools";
  }

  // ===== ISLAMIC =====
  if (s.includes("islamic")) {
    if (s.includes("advocacy") || s.includes("reform")) return "islamic-ngos";
    if (s.includes("infrastructure")) return "islamic-foundations";
    if (s.includes("scholarship")) return "islamic-schools";
    if (s.includes("holistic")) return "islamic-foundations";
    return "islamic-schools";
  }

  // ===== POLITICAL =====
  if (s.includes("politician") || s.includes("political")) {
    if (s.includes("scholarship") || s.includes("vocational")) return "political-ng-senators";
    if (s.includes("infrastructure") || s.includes("donation")) return "political-ng-governors";
    if (s.includes("advocacy") || s.includes("policy")) return "political-ng-nass";
    return "political-ng-governors";
  }

  // ===== CREATIVE ARTS (Nigeria) =====
  if (s.includes("nollywood") || s.includes("artiste-for-educational-content")) return "arts-ng-nollywood";
  if (s.includes("music-industry")) return "arts-ng-music";
  if (s.includes("literature") || s.includes("art-works")) return "arts-ng-literature";
  if (s.includes("visual-arts")) return "arts-ng-visual";
  if (s.includes("performing-arts")) return "arts-ng-performing";
  if (s.includes("film-and-media")) return "arts-ng-film";
  if (s.includes("creative-advocacy") || s.includes("campaigns-award")) return "arts-ng-campaigns";

  // ===== STEM (Regional) =====
  if (s.includes("stem") || s.includes("innovative-stem")) {
    const r = regionSuffix();
    if (s.includes("curriculum") || s.includes("digital")) return r ? `stem-digital-${r}` : "stem-digital-west-africa";
    if (s.includes("community")) return r ? `stem-community-${r}` : "stem-community-west-africa";
    if (s.includes("women") || s.includes("girl")) return r ? `stem-women-${r}` : "stem-women-west-africa";
    if (s.includes("youth")) return r ? `stem-youth-${r}` : "stem-youth-west-africa";
    if (s.includes("institutional") || s.includes("inclusive")) return r ? `stem-inclusive-${r}` : "stem-inclusive-west-africa";
    return r ? `stem-digital-${r}` : "stem-digital-west-africa";
  }

  // ===== CSR AFRICA (Regional) =====
  // Detect if it's a regional CSR slug
  const regionMatch = s.match(/in-(north|east|west|south|central)-africa$/);
  if (regionMatch || region) {
    let rSuffix = regionSuffix();
    if (regionMatch) {
      const rName = regionMatch[1];
      rSuffix = rName === "south" ? "southern-africa" : `${rName}-africa`;
    }
    
    if (rSuffix) {
      if (s.includes("banking") || s.includes("finance")) return `csr-africa-banking-${rSuffix}`;
      if (s.includes("telecom")) return `csr-africa-telecom-${rSuffix}`;
      if (s.includes("technology") || s.includes("ict")) return `csr-africa-tech-${rSuffix}`;
      if (s.includes("oil") || s.includes("gas")) return `csr-africa-oil-${rSuffix}`;
      if (s.includes("food") || s.includes("beverage")) return `csr-africa-food-${rSuffix}`;
      if (s.includes("aviation")) return `csr-africa-aviation-${rSuffix}`;
      if (s.includes("manufacturing") || s.includes("industrial")) return `csr-africa-banking-${rSuffix}`; // closest fallback
      if (s.includes("agri")) return `csr-africa-food-${rSuffix}`;
      if (s.includes("sports")) return `csr-africa-banking-${rSuffix}`; // no sports category, fallback
    }
  }

  // ===== CSR NIGERIA (no region) =====
  if (s.includes("csr") || s.includes("education-award")) {
    if (s.includes("banking") || s.includes("finance")) return "csr-ng-banking";
    if (s.includes("telecom") && s.includes("emerging")) return "csr-ng-emerging-telecom";
    if (s.includes("telecom")) return "csr-ng-telecom";
    if (s.includes("oil") || s.includes("gas")) return "csr-ng-oil";
    if (s.includes("food") || s.includes("beverage")) return "csr-ng-food";
    if (s.includes("manufacturing") || s.includes("industrial")) return "csr-ng-manufacturing";
    if (s.includes("aviation")) return "csr-ng-aviation";
    if (s.includes("technology") && s.includes("software")) return "csr-ng-software";
    if (s.includes("technology") || s.includes("ict")) return "csr-ng-tech-it";
    if (s.includes("real-estate") && s.includes("development")) return "csr-ng-realestate-dev";
    if (s.includes("real-estate") || s.includes("construction")) return "csr-ng-realestate";
    if (s.includes("retail") || s.includes("e-commerce") || s.includes("commercial")) return "csr-ng-retail";
    if (s.includes("pharma")) return "csr-ng-pharma";
    if (s.includes("insurance")) return "csr-ng-insurance";
    if (s.includes("conglomerate") || s.includes("diversified")) return "csr-ng-conglomerates";
    if (s.includes("media") || s.includes("influencer")) return "csr-ng-media";
    if (s.includes("agri")) return "csr-ng-agric";
    if (s.includes("health") || s.includes("hospital")) return "csr-ng-health";
    if (s.includes("professional")) return "csr-ng-professional";
    if (s.includes("fintech")) return "csr-ng-fintech";
    if (s.includes("microfinance")) return "csr-ng-microfinance";
    if (s.includes("hotel") || s.includes("hospitality")) return "csr-ng-hospitality";
    if (s.includes("sports")) return "csr-ng-media"; // sports stars → media fallback
  }

  // ===== NGO NIGERIA =====
  if (s.includes("ngo") || s.includes("scholarship") || s.includes("education-aid")) {
    if (s.includes("scholarship") || s.includes("education-aid")) return "ngo-ng-scholarship";
    if (s.includes("training") || s.includes("teacher")) return "ngo-ng-training";
    if (s.includes("girl") || s.includes("child")) return "ngo-ng-girlchild";
    if (s.includes("special") || s.includes("needs")) return "ngo-ng-special-needs";
    if (s.includes("community")) return "ngo-ng-community";
    if (s.includes("infrastructure")) return "ngo-ng-infrastructure";
    if (s.includes("material")) return "ngo-ng-materials";
    if (s.includes("women")) return "ngo-ng-women";
    if (s.includes("youth") || s.includes("empower")) return "ngo-ng-youth";
  }

  // ===== EduTech (Regional) =====
  if (s.includes("edutech")) {
    const r = regionSuffix();
    if (s.includes("established")) return r ? `edutech-established-${r}` : "edutech-established-west-africa";
    if (s.includes("startup")) return r ? `edutech-startup-${r}` : "edutech-startup-west-africa";
    if (s.includes("impact") || s.includes("social")) return r ? `edutech-impact-${r}` : "edutech-impact-west-africa";
    return r ? `edutech-established-${r}` : "edutech-established-west-africa";
  }

  // ===== NGO Africa (Regional) =====
  if (region && (s.includes("scholarship") || s.includes("training") || s.includes("girl") || s.includes("community") || s.includes("infrastructure") || s.includes("material") || s.includes("women") || s.includes("youth"))) {
    const r = regionSuffix();
    if (s.includes("scholarship") || s.includes("aid")) return `ngo-africa-scholarship-${r}`;
    if (s.includes("training") || s.includes("teacher")) return `ngo-africa-training-${r}`;
    if (s.includes("girl") || s.includes("child")) return `ngo-africa-girlchild-${r}`;
    if (s.includes("special") || s.includes("needs")) return `ngo-africa-special-needs-${r}`;
    if (s.includes("community")) return `ngo-africa-community-${r}`;
    if (s.includes("infrastructure")) return `ngo-africa-infrastructure-${r}`;
    if (s.includes("material")) return `ngo-africa-materials-${r}`;
    if (s.includes("women")) return `ngo-africa-women-${r}`;
    if (s.includes("youth") || s.includes("empower")) return `ngo-africa-youth-${r}`;
  }

  // Fallback: return original slug (will be marked unmapped by seed-nominees)
  return nominee.subcategorySlug;
}

interface SeedResult {
  total: number;
  valid: number;
  inserted: number;
  merged: number;
  unmapped: number;
  errors: string[];
  missing_subcategories: string[];
}

export default function BulkSeedNominees() {
  const [loading, setLoading] = useState(false);
  const [dryRunResult, setDryRunResult] = useState<SeedResult | null>(null);
  const [liveResult, setLiveResult] = useState<SeedResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [unmappedSlugs, setUnmappedSlugs] = useState<string[]>([]);

  const csvNominees = getAllNominees();

  function prepareNominees() {
    const seen = new Set<string>();
    const prepared: any[] = [];

    for (const nominee of csvNominees) {
      if (seen.has(nominee.slug)) continue;
      seen.add(nominee.slug);

      const subcategorySlug = resolveSubcategorySlug(nominee);

      prepared.push({
        name: nominee.name.trim(),
        slug: nominee.slug,
        bio: nominee.achievement || undefined,
        photo_url: nominee.imageUrl || undefined,
        country: nominee.country || undefined,
        region: nominee.regionName || undefined,
        subcategory_slug: subcategorySlug,
        legacy_source: "csv_bulk_seed",
        status: "approved",
      });
    }

    return prepared;
  }

  async function runSeed(dryRun: boolean) {
    setLoading(true);
    setProgress(0);

    try {
      const prepared = prepareNominees();
      const batchSize = 200;
      const allResults: SeedResult = {
        total: prepared.length,
        valid: 0,
        inserted: 0,
        merged: 0,
        unmapped: 0,
        errors: [],
        missing_subcategories: [],
      };

      for (let i = 0; i < prepared.length; i += batchSize) {
        const batch = prepared.slice(i, i + batchSize);
        setProgress(Math.round((i / prepared.length) * 100));

        const { data, error } = await supabase.functions.invoke("seed-nominees", {
          body: { nominees: batch, dry_run: dryRun },
        });

        if (error) {
          allResults.errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
          continue;
        }

        const r = data?.results;
        if (r) {
          allResults.valid += r.valid || 0;
          allResults.inserted += r.inserted || 0;
          allResults.merged += r.merged || 0;
          allResults.unmapped += r.unmapped || 0;
          if (r.errors) allResults.errors.push(...r.errors);
          if (r.missing_subcategories) {
            allResults.missing_subcategories.push(...r.missing_subcategories);
          }
        }
      }

      setProgress(100);
      allResults.missing_subcategories = [...new Set(allResults.missing_subcategories)];
      setUnmappedSlugs(allResults.missing_subcategories);

      if (dryRun) {
        setDryRunResult(allResults);
        toast.info(`Dry run: ${allResults.valid} valid, ${allResults.unmapped} unmapped`);
      } else {
        setLiveResult(allResults);
        toast.success(`Seeded ${allResults.inserted} nominees, merged ${allResults.merged}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Seed failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Bulk Seed CSV Nominees to Database</h1>
      <p className="text-muted-foreground">
        Reads all {csvNominees.length} CSV nominees, maps subcategory slugs via pattern matching,
        and seeds them into the database.
      </p>

      <Card>
        <CardHeader><CardTitle>CSV Summary</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p>Total CSV nominees: <Badge variant="secondary">{csvNominees.length}</Badge></p>
          <p>Unique slugs: <Badge variant="secondary">{new Set(csvNominees.map(n => n.slug)).size}</Badge></p>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="py-4">
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground text-center">{progress}%</p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button onClick={() => runSeed(true)} disabled={loading} variant="outline">
          {loading ? "Running..." : "Dry Run (Preview)"}
        </Button>
        <Button onClick={() => runSeed(false)} disabled={loading} variant="default">
          {loading ? "Running..." : "Seed All Nominees (Live)"}
        </Button>
      </div>

      {dryRunResult && (
        <Card>
          <CardHeader><CardTitle>Dry Run Results</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p>Total: {dryRunResult.total}</p>
            <p>Valid: <Badge>{dryRunResult.valid}</Badge></p>
            <p>Unmapped: <Badge variant="destructive">{dryRunResult.unmapped}</Badge></p>
            {dryRunResult.errors.length > 0 && (
              <div>
                <p className="font-medium text-destructive">Errors:</p>
                <ul className="list-disc pl-4 text-sm">{dryRunResult.errors.slice(0, 20).map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            )}
            {unmappedSlugs.length > 0 && (
              <div>
                <p className="font-medium">Missing slugs:</p>
                <ul className="list-disc pl-4 text-sm">{unmappedSlugs.map((s, i) => <li key={i}><code>{s}</code></li>)}</ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {liveResult && (
        <Card>
          <CardHeader><CardTitle>Live Seed Results</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p>Inserted: <Badge>{liveResult.inserted}</Badge></p>
            <p>Merged: <Badge>{liveResult.merged}</Badge></p>
            <p>Unmapped: <Badge variant="destructive">{liveResult.unmapped}</Badge></p>
            {liveResult.errors.length > 0 && (
              <div>
                <p className="font-medium text-destructive">Errors:</p>
                <ul className="list-disc pl-4 text-sm">{liveResult.errors.slice(0, 20).map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
