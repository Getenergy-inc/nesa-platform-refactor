import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Users, Award, Building, Briefcase } from "lucide-react";
import type { AppRole } from "@/config/roles";

interface RoleSwitcherProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
}

const roleIcons: Record<AppRole, React.ReactNode> = {
  FREE_MEMBER: <User className="h-4 w-4" />,
  nrc: <Shield className="h-4 w-4" />,
  jury: <Award className="h-4 w-4" />,
  chapter: <Building className="h-4 w-4" />,
  sponsor: <Briefcase className="h-4 w-4" />,
  admin: <Users className="h-4 w-4" />,
};

const roleLabels: Record<AppRole, string> = {
  FREE_MEMBER: "User",
  nrc: "NRC Reviewer",
  jury: "Jury Member",
  chapter: "Chapter Coordinator",
  sponsor: "Sponsor",
  admin: "Administrator",
};

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const { roles } = useAuth();

  // Don't show switcher if user has only one role
  if (roles.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Viewing as:</span>
      <Select
        value={currentRole}
        onValueChange={(v) => onRoleChange(v as AppRole)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              {roleIcons[currentRole]}
              <span>{roleLabels[currentRole]}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-popover">
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              <div className="flex items-center gap-2">
                {roleIcons[role]}
                <span>{roleLabels[role]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
