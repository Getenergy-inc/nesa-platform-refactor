import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ExternalLink, MapPin, Building2, User } from "lucide-react";
import type { EvidenceDossier } from "@/hooks/useJuryData";

interface DossierDialogProps {
  dossier: EvidenceDossier | null | undefined;
  isLoading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DossierDialog({ dossier, isLoading, open, onOpenChange }: DossierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoal border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gold" />
            Evidence Dossier
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Read-only view of nominee evidence and profile
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : dossier ? (
          <div className="space-y-6 py-4">
            {/* Nominee Profile */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={dossier.photo_url || undefined} alt={dossier.name} />
                <AvatarFallback className="bg-gold/20 text-gold text-xl">
                  {dossier.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'N'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-white">{dossier.name}</h3>
                {dossier.title && (
                  <p className="text-white/70">{dossier.title}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {dossier.organization && (
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      <Building2 className="mr-1 h-3 w-3" />
                      {dossier.organization}
                    </Badge>
                  )}
                  {dossier.region && (
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      <MapPin className="mr-1 h-3 w-3" />
                      {dossier.region}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Category Info */}
            {dossier.subcategory && (
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white/60 mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {dossier.subcategory.category && (
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      {dossier.subcategory.category.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-white/20 text-white">
                    {dossier.subcategory.name}
                  </Badge>
                </div>
              </div>
            )}

            {/* Bio */}
            {dossier.bio && (
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Biography
                </h4>
                <p className="text-white/80 whitespace-pre-wrap">{dossier.bio}</p>
              </div>
            )}

            {/* Evidence URLs */}
            {dossier.evidence_urls && dossier.evidence_urls.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Supporting Evidence ({dossier.evidence_urls.length} file{dossier.evidence_urls.length !== 1 ? 's' : ''})
                </h4>
                <div className="grid gap-2">
                  {dossier.evidence_urls.map((url, index) => {
                    const filename = url.split('/').pop() || `Evidence ${index + 1}`;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 justify-between"
                        asChild
                      >
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <span className="truncate">{filename}</span>
                          <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2" />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {!dossier.evidence_urls?.length && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                <p className="text-yellow-400 text-sm">No evidence files uploaded for this nominee.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-white/60">
            No dossier data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
