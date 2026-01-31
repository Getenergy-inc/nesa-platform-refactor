import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Trophy,
  UserCheck,
  Users,
  UserPlus,
  CheckCircle,
  Tv,
  Share2,
  Gift,
  LucideIcon,
} from "lucide-react";
import { AGC_EARNING_METHODS, type AGCEarningMethod } from "@/config/agcConfig";

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Trophy,
  UserCheck,
  Users,
  UserPlus,
  CheckCircle,
  Tv,
  Share2,
  Gift,
};

interface EarningMethodCardProps {
  method: AGCEarningMethod;
}

function EarningMethodCard({ method }: EarningMethodCardProps) {
  const Icon = iconMap[method.icon] || Gift;
  
  return (
    <Card className="h-full hover:border-primary/50 transition-colors">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight">{method.title}</h4>
            <Badge variant="secondary" className="mt-1 text-xs bg-gold/10 text-gold border-gold/20">
              {method.reward}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground flex-1">{method.description}</p>
      </CardContent>
    </Card>
  );
}

interface EarningMethodsGridProps {
  className?: string;
  showTitle?: boolean;
  maxItems?: number;
}

export function EarningMethodsGrid({ 
  className, 
  showTitle = true,
  maxItems,
}: EarningMethodsGridProps) {
  const methods = maxItems 
    ? AGC_EARNING_METHODS.filter(m => m.isActive).slice(0, maxItems)
    : AGC_EARNING_METHODS.filter(m => m.isActive);

  return (
    <section className={className} id="earn">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">How to Earn Afri Gold Coin (AGC & AGCc)</h2>
          <p className="text-muted-foreground">
            Earn AGCc through participation and convert to AGC for voting.
          </p>
        </div>
      )}
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => (
          <EarningMethodCard key={method.id} method={method} />
        ))}
      </div>
    </section>
  );
}
