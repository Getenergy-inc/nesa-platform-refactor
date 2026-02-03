/**
 * Enriched Profile Display Card
 * Shows summary, contributions, highlights, and social links for a nominee
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ExternalLink, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook, 
  Youtube, 
  Globe, 
  CheckCircle2,
  BookOpen,
  Sparkles,
  Quote
} from "lucide-react";
import type { EnrichedNomineeProfile } from "@/types/nomineeProfile";

interface EnrichedProfileCardProps {
  profile: EnrichedNomineeProfile;
  nomineeName: string;
}

export function EnrichedProfileCard({ profile, nomineeName }: EnrichedProfileCardProps) {
  const { social_links, summary_2025, education_for_all_contributions, highlights, sources } = profile;
  
  // Check if profile has meaningful content
  const hasContent = summary_2025 || education_for_all_contributions.length > 0 || highlights.length > 0;
  
  if (!hasContent) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {summary_2025 && (
        <Card className="bg-charcoal-light border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-ivory flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-gold" />
              About {nomineeName.split(" ")[0]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-ivory/80 leading-relaxed whitespace-pre-line">
              {summary_2025}
            </p>
            {profile.asOfDate && (
              <p className="text-xs text-ivory/40 mt-4">
                Information as of {new Date(profile.asOfDate).toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long" 
                })}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contributions Section */}
      {education_for_all_contributions.length > 0 && (
        <Card className="bg-charcoal-light border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-ivory flex items-center gap-2 text-lg">
              <CheckCircle2 className="w-5 h-5 text-gold" />
              Education for All Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {education_for_all_contributions.map((contribution, idx) => (
                <li key={idx} className="flex gap-3 text-ivory/80">
                  <span className="text-gold flex-shrink-0">•</span>
                  <span>{contribution}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Highlights Section */}
      {highlights.length > 0 && (
        <Card className="bg-charcoal-light border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-ivory flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-gold" />
              Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="bg-gold/10 text-gold border-gold/20 px-3 py-1"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Links Section */}
      {Object.keys(social_links).some(key => social_links[key as keyof typeof social_links]) && (
        <Card className="bg-charcoal-light border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-ivory flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-gold" />
              Connect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {social_links.website && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  asChild
                >
                  <a href={social_links.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
              {social_links.linkedin && (
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  asChild
                >
                  <a href={social_links.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {social_links.x && (
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  asChild
                >
                  <a href={social_links.x} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {social_links.instagram && (
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  asChild
                >
                  <a href={social_links.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {social_links.facebook && (
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  asChild
                >
                  <a href={social_links.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {social_links.youtube && (
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  asChild
                >
                  <a href={social_links.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sources Section - Collapsible */}
      {sources.length > 0 && (
        <details className="group">
          <summary className="text-sm text-ivory/40 cursor-pointer hover:text-ivory/60 flex items-center gap-2">
            <Quote className="w-4 h-4" />
            View {sources.length} source{sources.length > 1 ? "s" : ""} for this profile
          </summary>
          <div className="mt-3 space-y-2 pl-6">
            {sources.map((source, idx) => (
              <div key={idx} className="text-xs text-ivory/50">
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {source.title} — {source.publisher}
                  {source.publishedDate && ` (${source.publishedDate})`}
                </a>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
