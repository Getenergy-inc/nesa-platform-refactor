import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Building2, User } from "lucide-react";
import { Link } from "react-router-dom";
import { type MasterNominee } from "@/lib/nomineeMasterData";
import { NomineeWorkflowStatusBadge } from "./NomineeWorkflowStatus";

interface NomineeStoryCardProps {
  nominee: MasterNominee;
  showWorkflow?: boolean;
}

function isOrg(name: string): boolean {
  const orgKeywords = ["bank", "group", "foundation", "university", "church", "association", "network", "initiative", "company", "ltd", "plc", "nigeria", "africa", "state", "council", "committee", "institute", "academy", "school", "college", "polytechnic", "library", "hospital", "organization", "organisation", "ngo", "fund", "trust", "society", "programme", "program", "ministry", "agency", "board", "commission", "corporation"];
  const lower = name.toLowerCase();
  return orgKeywords.some(kw => lower.includes(kw));
}

function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function NomineeStoryCard({ nominee, showWorkflow = false }: NomineeStoryCardProps) {
  const org = isOrg(nominee.name);

  return (
    <Card className="bg-charcoal-light/50 border-gold/10 hover:border-gold/25 transition-all group overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image / Avatar */}
          <div className="w-full sm:w-32 h-32 sm:h-auto bg-charcoal flex-shrink-0 flex items-center justify-center relative overflow-hidden">
            {nominee.imageUrl && nominee.imageUrl !== "/images/placeholder.svg" ? (
              <img
                src={nominee.imageUrl}
                alt={nominee.name}
                className={`w-full h-full ${org ? "object-contain p-3" : "object-cover"}`}
                loading="lazy"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                {org ? (
                  <Building2 className="w-7 h-7 text-gold/40" />
                ) : (
                  <span className="text-gold/60 font-display text-lg">{getInitials(nominee.name)}</span>
                )}
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="bg-charcoal/80 border-gold/20 text-gold text-[10px]">
                {nominee.pathway}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-ivory text-sm font-semibold leading-tight group-hover:text-gold transition-colors">
                  {nominee.name}
                </h3>
                {nominee.country && (
                  <div className="flex items-center gap-1 mt-1 text-ivory/40 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{nominee.country}{nominee.state ? `, ${nominee.state}` : ""}</span>
                  </div>
                )}
              </div>
              {showWorkflow && (
                <NomineeWorkflowStatusBadge status={nominee.workflowStatus} compact />
              )}
            </div>

            <p className="text-ivory/50 text-xs leading-relaxed line-clamp-2">
              {nominee.achievement || "Contribution to education across Africa."}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="outline" className="border-gold/15 text-ivory/40 text-[10px] px-1.5 py-0">
                  {nominee.subcategory.length > 40 ? nominee.subcategory.slice(0, 40) + "…" : nominee.subcategory}
                </Badge>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-gold/60 hover:text-gold hover:bg-gold/5 text-xs"
              >
                <Link to={`/nominees/${encodeURIComponent(nominee.slug)}`}>
                  View <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NomineeStoryCard;
