import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Award, Eye } from "lucide-react";

interface NominationStatusBadgeProps {
  status: string;
  size?: "sm" | "default";
}

export function NominationStatusBadge({ status, size = "default" }: NominationStatusBadgeProps) {
  const iconClass = size === "sm" ? "mr-1 h-3 w-3" : "mr-1.5 h-4 w-4";
  
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className={size === "sm" ? "text-xs" : ""}>
          <Clock className={iconClass} />
          Pending
        </Badge>
      );
    case "under_review":
      return (
        <Badge className={`bg-warning text-warning-foreground ${size === "sm" ? "text-xs" : ""}`}>
          <Eye className={iconClass} />
          Under Review
        </Badge>
      );
    case "approved":
      return (
        <Badge className={`bg-success text-success-foreground ${size === "sm" ? "text-xs" : ""}`}>
          <CheckCircle className={iconClass} />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className={size === "sm" ? "text-xs" : ""}>
          <XCircle className={iconClass} />
          Rejected
        </Badge>
      );
    case "platinum":
      return (
        <Badge className={`bg-primary text-primary-foreground ${size === "sm" ? "text-xs" : ""}`}>
          <Award className={iconClass} />
          Platinum
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
