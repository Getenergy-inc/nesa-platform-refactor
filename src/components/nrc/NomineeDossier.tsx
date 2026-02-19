/**
 * Nominee Dossier Component
 * Read-only view of nominee information for NRC verification
 */

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Building2,
  Calendar,
  FileText,
  ExternalLink,
  Globe,
  Award,
  Tag,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { NRCQueueItem } from "@/types/nrc";

interface NomineeDossierProps {
  nomination: NRCQueueItem["nomination"];
}

function InfoRow({
  icon: Icon,
  label,
  value,
  link,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null | undefined;
  link?: boolean;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {link ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {value}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-sm">{value}</p>
        )}
      </div>
    </div>
  );
}

export function NomineeDossier({ nomination }: NomineeDossierProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="shrink-0">
            {nomination.nominee_photo_url ? (
              <img
                src={nomination.nominee_photo_url}
                alt={nomination.nominee_name}
                className="h-20 w-20 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-bold leading-tight">
              {nomination.nominee_name}
            </h3>
            {nomination.nominee_title && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {nomination.nominee_title}
              </p>
            )}

            {/* Category Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {nomination.subcategory?.category && (
                <Badge variant="outline">
                  <Award className="mr-1 h-3 w-3" />
                  {nomination.subcategory.category.name}
                </Badge>
              )}
              {nomination.subcategory && (
                <Badge variant="secondary">
                  <Tag className="mr-1 h-3 w-3" />
                  {nomination.subcategory.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Details Grid */}
        <div className="grid gap-0 divide-y">
          <InfoRow
            icon={Building2}
            label="Organization"
            value={nomination.nominee_organization}
          />
          <InfoRow
            icon={Calendar}
            label="Submitted"
            value={new Date(nomination.created_at).toLocaleDateString()}
          />
        </div>

        <Separator />

        {/* Bio */}
        {nomination.nominee_bio && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Biography</h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {nomination.nominee_bio}
            </p>
          </div>
        )}

        <Separator />

        {/* Evidence */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Evidence ({nomination.evidence_urls?.length || 0} files)
          </h4>

          {nomination.evidence_urls && nomination.evidence_urls.length > 0 ? (
            <ScrollArea className="h-[120px]">
              <div className="space-y-2">
                {nomination.evidence_urls.map((url, index) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                  const isPDF = /\.pdf$/i.test(url);
                  const fileName =
                    url.split("/").pop() || `Evidence ${index + 1}`;

                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted transition-colors"
                    >
                      {isImage ? (
                        <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : isPDF ? (
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate flex-1">{fileName}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                    </a>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">
              No evidence files attached
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
