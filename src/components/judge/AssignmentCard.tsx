import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import type { JuryAssignment } from "@/hooks/useJuryData";

interface AssignmentCardProps {
  assignment: JuryAssignment;
  onScore?: (assignment: JuryAssignment) => void;
  onViewDossier?: (assignment: JuryAssignment) => void;
}

export function AssignmentCard({ assignment, onScore, onViewDossier }: AssignmentCardProps) {
  const nominee = assignment.nominee;
  
  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
    completed: { label: "Scored", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
    recused: { label: "Recused", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: AlertTriangle },
  };
  
  const status = statusConfig[assignment.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card className="border-white/10 bg-white/5 hover:border-gold/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={nominee?.photo_url || undefined} alt={nominee?.name} />
            <AvatarFallback className="bg-gold/20 text-gold">
              {nominee?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'N'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h4 className="font-semibold text-white truncate">{nominee?.name || 'Unknown Nominee'}</h4>
                {nominee?.title && (
                  <p className="text-sm text-white/60 truncate">{nominee.title}</p>
                )}
              </div>
              <Badge className={status.color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {status.label}
              </Badge>
            </div>
            
            {nominee?.organization && (
              <p className="text-xs text-white/50 mb-2 truncate">{nominee.organization}</p>
            )}
            
            {nominee?.subcategory && (
              <div className="flex flex-wrap gap-1 mb-3">
                {nominee.subcategory.category && (
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                    {nominee.subcategory.category.name}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                  {nominee.subcategory.name}
                </Badge>
              </div>
            )}
            
            {assignment.status === 'completed' && assignment.score !== null && (
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gold" />
                  <span className="text-gold font-semibold">{assignment.score}/100</span>
                </div>
                {assignment.comment && (
                  <p className="text-xs text-white/50 mt-1 line-clamp-2">{assignment.comment}</p>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              {assignment.status !== 'recused' && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => onViewDossier?.(assignment)}
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Evidence
                  </Button>
                  {assignment.status === 'pending' && (
                    <Button 
                      size="sm" 
                      className="bg-gold hover:bg-gold/90 text-black"
                      onClick={() => onScore?.(assignment)}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Score
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
