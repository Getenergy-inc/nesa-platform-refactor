import { Link } from "react-router-dom";
import { NESALogo } from "@/components/nesa/NESALogo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, LogOut, Settings, Bell } from "lucide-react";

interface NomineeDashboardHeaderProps {
  nomineeName: string;
  photoUrl?: string;
  acceptanceStatus: string;
  onLogout?: () => void;
}

export function NomineeDashboardHeader({
  nomineeName,
  photoUrl,
  acceptanceStatus,
  onLogout,
}: NomineeDashboardHeaderProps) {
  const initials = nomineeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <NESALogo variant="icon" className="h-8 w-8" />
            <span className="hidden font-display font-bold text-lg md:inline-block">
              NESA-Africa
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <span>/</span>
            <span className="font-medium text-foreground">
              Nominee Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={acceptanceStatus === "ACCEPTED" ? "default" : "secondary"}
            className="hidden sm:flex"
          >
            <Award className="h-3 w-3 mr-1" />
            {acceptanceStatus === "ACCEPTED" ? "Verified Nominee" : "Pending"}
          </Badge>

          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </Button> */}

          {/* <Button variant="ghost" size="icon" asChild>
            <Link to="/nominee/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button> */}

          <div className="flex items-center gap-2 pl-2 border-l">
            <Avatar className="h-8 w-8">
              <AvatarImage src={photoUrl} alt={nomineeName} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline-block text-sm font-medium max-w-[120px] truncate">
              {nomineeName}
            </span>
          </div>

          {onLogout && (
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
