import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { StageConfig } from "@/types/admin";

interface StageControlCardProps {
  stages: StageConfig[];
  loading?: boolean;
  onUpdateStage: (id: string, updates: Partial<StageConfig>) => Promise<void>;
}

const stageLabels: Record<string, { label: string; description: string; color: string }> = {
  nominations: {
    label: "Nominations",
    description: "Allow users to submit new nominations",
    color: "bg-blue-500",
  },
  public_voting: {
    label: "Public Voting",
    description: "Enable Gold Certificate public voting",
    color: "bg-amber-500",
  },
  jury_scoring: {
    label: "Jury Scoring",
    description: "Allow jury members to score nominees",
    color: "bg-purple-500",
  },
  results: {
    label: "Results",
    description: "Make results publicly visible",
    color: "bg-emerald-500",
  },
  certificates: {
    label: "Certificates",
    description: "Enable certificate download",
    color: "bg-rose-500",
  },
};

export function StageControlCard({ stages, loading, onUpdateStage }: StageControlCardProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleToggle = async (stage: StageConfig) => {
    setUpdating(stage.id);
    try {
      await onUpdateStage(stage.id, { is_open: !stage.is_open });
      toast.success(`${stageLabels[stage.action]?.label ?? stage.action} ${!stage.is_open ? 'opened' : 'closed'}`);
    } catch (error) {
      toast.error("Failed to update stage");
    } finally {
      setUpdating(null);
    }
  };

  const handleDateChange = async (stage: StageConfig, field: 'opens_at' | 'closes_at', value: string) => {
    try {
      await onUpdateStage(stage.id, { [field]: value || null });
      toast.success("Schedule updated");
    } catch (error) {
      toast.error("Failed to update schedule");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-500" />
          Stage Control
        </CardTitle>
        <CardDescription>
          Manage the lifecycle stages for the current season
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage) => {
            const config = stageLabels[stage.action] ?? { 
              label: stage.action, 
              description: '', 
              color: 'bg-gray-500' 
            };
            
            return (
              <div 
                key={stage.id}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    <div>
                      <h4 className="font-medium">{config.label}</h4>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {stage.is_open ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Open
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Closed
                      </Badge>
                    )}
                    <Switch
                      checked={stage.is_open ?? false}
                      onCheckedChange={() => handleToggle(stage)}
                      disabled={updating === stage.id}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Opens At
                    </Label>
                    <Input
                      type="datetime-local"
                      value={stage.opens_at?.slice(0, 16) ?? ''}
                      onChange={(e) => handleDateChange(stage, 'opens_at', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Closes At
                    </Label>
                    <Input
                      type="datetime-local"
                      value={stage.closes_at?.slice(0, 16) ?? ''}
                      onChange={(e) => handleDateChange(stage, 'closes_at', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          
          {stages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No stages configured for the current season
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
