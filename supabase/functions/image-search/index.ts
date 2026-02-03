/**
 * Image Search Edge Function
 * Searches Wikimedia Commons, Wikipedia, and Wikidata for nominee images
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImageCandidate {
  imageUrl: string;
  thumbnailUrl?: string;
  sourceUrl: string;
  license?: string;
  confidence: number;
  source: "wikimedia" | "wikidata" | "wikipedia" | "clearbit";
}

interface SearchRequest {
  nomineeName: string;
  kind: "person" | "organization";
  additionalContext?: string;
}

interface WikimediaSearchResult {
  title: string;
  pageid: number;
  url?: string;
}

interface WikimediaImageInfo {
  url: string;
  thumburl?: string;
  descriptionurl: string;
  extmetadata?: {
    LicenseShortName?: { value: string };
    License?: { value: string };
  };
}

// Search Wikimedia Commons for images
async function searchWikimediaCommons(
  query: string,
  kind: "person" | "organization"
): Promise<ImageCandidate[]> {
  const candidates: ImageCandidate[] = [];
  
  try {
    // Build search query
    const searchQuery = kind === "organization" 
      ? `${query} logo` 
      : `${query} portrait OR ${query} headshot`;
    
    // Search for files
    const searchUrl = new URL("https://commons.wikimedia.org/w/api.php");
    searchUrl.searchParams.set("action", "query");
    searchUrl.searchParams.set("format", "json");
    searchUrl.searchParams.set("list", "search");
    searchUrl.searchParams.set("srsearch", searchQuery);
    searchUrl.searchParams.set("srnamespace", "6"); // File namespace
    searchUrl.searchParams.set("srlimit", "10");
    searchUrl.searchParams.set("origin", "*");
    
    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();
    
    const results = searchData.query?.search || [];
    
    // Get image info for each result
    for (const result of results.slice(0, 5)) {
      try {
        const infoUrl = new URL("https://commons.wikimedia.org/w/api.php");
        infoUrl.searchParams.set("action", "query");
        infoUrl.searchParams.set("format", "json");
        infoUrl.searchParams.set("titles", result.title);
        infoUrl.searchParams.set("prop", "imageinfo");
        infoUrl.searchParams.set("iiprop", "url|extmetadata");
        infoUrl.searchParams.set("iiurlwidth", "300");
        infoUrl.searchParams.set("origin", "*");
        
        const infoResponse = await fetch(infoUrl.toString());
        const infoData = await infoResponse.json();
        
        const pages = infoData.query?.pages || {};
        const page = Object.values(pages)[0] as any;
        
        if (page?.imageinfo?.[0]) {
          const info = page.imageinfo[0] as WikimediaImageInfo;
          
          // Calculate confidence based on various factors
          let confidence = 0.5;
          const lowerTitle = result.title.toLowerCase();
          const lowerQuery = query.toLowerCase();
          
          // Boost if title contains query terms
          if (lowerTitle.includes(lowerQuery.split(" ")[0])) confidence += 0.2;
          
          // Boost for official/verified images
          if (lowerTitle.includes("official")) confidence += 0.1;
          if (lowerTitle.includes("portrait")) confidence += 0.1;
          if (lowerTitle.includes("logo") && kind === "organization") confidence += 0.15;
          
          candidates.push({
            imageUrl: info.url,
            thumbnailUrl: info.thumburl || info.url,
            sourceUrl: info.descriptionurl,
            license: info.extmetadata?.LicenseShortName?.value || 
                     info.extmetadata?.License?.value,
            confidence: Math.min(confidence, 1),
            source: "wikimedia",
          });
        }
      } catch (e) {
        console.error("Error fetching image info:", e);
      }
    }
  } catch (e) {
    console.error("Wikimedia search error:", e);
  }
  
  return candidates;
}

// Search Wikipedia for page images
async function searchWikipedia(
  query: string,
  kind: "person" | "organization"
): Promise<ImageCandidate[]> {
  const candidates: ImageCandidate[] = [];
  
  try {
    // Search Wikipedia for articles
    const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
    searchUrl.searchParams.set("action", "query");
    searchUrl.searchParams.set("format", "json");
    searchUrl.searchParams.set("list", "search");
    searchUrl.searchParams.set("srsearch", query);
    searchUrl.searchParams.set("srlimit", "5");
    searchUrl.searchParams.set("origin", "*");
    
    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();
    
    const results = searchData.query?.search || [];
    
    // Get page images for each result
    for (const result of results.slice(0, 3)) {
      try {
        const imageUrl = new URL("https://en.wikipedia.org/w/api.php");
        imageUrl.searchParams.set("action", "query");
        imageUrl.searchParams.set("format", "json");
        imageUrl.searchParams.set("titles", result.title);
        imageUrl.searchParams.set("prop", "pageimages|info");
        imageUrl.searchParams.set("pithumbsize", "300");
        imageUrl.searchParams.set("inprop", "url");
        imageUrl.searchParams.set("origin", "*");
        
        const imageResponse = await fetch(imageUrl.toString());
        const imageData = await imageResponse.json();
        
        const pages = imageData.query?.pages || {};
        const page = Object.values(pages)[0] as any;
        
        if (page?.thumbnail?.source) {
          // Get full-size image URL
          const fullImageUrl = page.thumbnail.source.replace(/\/\d+px-/, "/800px-");
          
          let confidence = 0.6; // Wikipedia page images are usually relevant
          
          // Boost for exact title match
          if (result.title.toLowerCase() === query.toLowerCase()) {
            confidence += 0.2;
          }
          
          candidates.push({
            imageUrl: fullImageUrl,
            thumbnailUrl: page.thumbnail.source,
            sourceUrl: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
            license: "Wikipedia (check page for license)",
            confidence: Math.min(confidence, 1),
            source: "wikipedia",
          });
        }
      } catch (e) {
        console.error("Error fetching Wikipedia image:", e);
      }
    }
  } catch (e) {
    console.error("Wikipedia search error:", e);
  }
  
  return candidates;
}

// Search Wikidata for structured data
async function searchWikidata(
  query: string,
  kind: "person" | "organization"
): Promise<ImageCandidate[]> {
  const candidates: ImageCandidate[] = [];
  
  try {
    // Search for entities
    const searchUrl = new URL("https://www.wikidata.org/w/api.php");
    searchUrl.searchParams.set("action", "wbsearchentities");
    searchUrl.searchParams.set("format", "json");
    searchUrl.searchParams.set("search", query);
    searchUrl.searchParams.set("language", "en");
    searchUrl.searchParams.set("limit", "5");
    searchUrl.searchParams.set("origin", "*");
    
    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();
    
    const results = searchData.search || [];
    
    // Get entity data for each result
    for (const result of results.slice(0, 3)) {
      try {
        const entityUrl = new URL("https://www.wikidata.org/w/api.php");
        entityUrl.searchParams.set("action", "wbgetentities");
        entityUrl.searchParams.set("format", "json");
        entityUrl.searchParams.set("ids", result.id);
        entityUrl.searchParams.set("props", "claims");
        entityUrl.searchParams.set("origin", "*");
        
        const entityResponse = await fetch(entityUrl.toString());
        const entityData = await entityResponse.json();
        
        const entity = entityData.entities?.[result.id];
        if (!entity?.claims) continue;
        
        // P154 = logo image, P18 = image
        const logoProperty = kind === "organization" ? "P154" : "P18";
        const imageClaim = entity.claims[logoProperty]?.[0] || entity.claims["P18"]?.[0];
        
        if (imageClaim?.mainsnak?.datavalue?.value) {
          const fileName = imageClaim.mainsnak.datavalue.value;
          
          // Convert to Commons URL
          const commonsName = fileName.replace(/ /g, "_");
          const md5 = await crypto.subtle.digest(
            "MD5",
            new TextEncoder().encode(commonsName)
          );
          const hashArray = Array.from(new Uint8Array(md5));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
          
          const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${hashHex[0]}/${hashHex[0]}${hashHex[1]}/${encodeURIComponent(commonsName)}`;
          const thumbUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${hashHex[0]}/${hashHex[0]}${hashHex[1]}/${encodeURIComponent(commonsName)}/300px-${encodeURIComponent(commonsName)}`;
          
          candidates.push({
            imageUrl,
            thumbnailUrl: thumbUrl,
            sourceUrl: `https://www.wikidata.org/wiki/${result.id}`,
            license: "Wikimedia Commons",
            confidence: 0.85, // Wikidata entries are usually accurate
            source: "wikidata",
          });
        }
      } catch (e) {
        console.error("Error fetching Wikidata entity:", e);
      }
    }
  } catch (e) {
    console.error("Wikidata search error:", e);
  }
  
  return candidates;
}

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { nomineeName, kind, additionalContext } = await req.json() as SearchRequest;
    
    if (!nomineeName) {
      return new Response(
        JSON.stringify({ success: false, error: "Nominee name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Build search query
    const query = additionalContext 
      ? `${nomineeName} ${additionalContext}`
      : nomineeName;
    
    console.log(`Searching for ${kind}: ${query}`);
    
    // Run searches in parallel
    const [wikimediaResults, wikipediaResults, wikidataResults] = await Promise.all([
      searchWikimediaCommons(query, kind),
      searchWikipedia(query, kind),
      searchWikidata(nomineeName, kind), // Use exact name for Wikidata
    ]);
    
    // Combine and deduplicate results
    const allCandidates = [
      ...wikidataResults, // Wikidata first (usually most accurate)
      ...wikipediaResults,
      ...wikimediaResults,
    ];
    
    // Deduplicate by image URL
    const seen = new Set<string>();
    const uniqueCandidates = allCandidates.filter(c => {
      const key = c.imageUrl.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    // Sort by confidence
    uniqueCandidates.sort((a, b) => b.confidence - a.confidence);
    
    // Return top 5 candidates
    return new Response(
      JSON.stringify({
        success: true,
        query,
        candidates: uniqueCandidates.slice(0, 5),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Image search error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Search failed",
        candidates: [],
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
