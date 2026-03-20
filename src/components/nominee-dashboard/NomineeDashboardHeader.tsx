import { Link } from "react-router-dom";
import { NESALogo } from "@/components/nesa/NESALogo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, LogOut, Menu } from "lucide-react";

interface NomineeDashboardHeaderProps {
  nomineeName: string;
  photoUrl?: string;
  acceptanceStatus: string;
  onLogout?: () => void;
  onMenuClick?: () => void; // ✅ ADD THIS
}

export function NomineeDashboardHeader({
  nomineeName,
  photoUrl,
  acceptanceStatus,
  onLogout,
  onMenuClick,
}: NomineeDashboardHeaderProps) {
  const initials = nomineeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* ✅ Mobile Menu Trigger */}
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <NESALogo variant="icon" className="h-8 w-8" />
            <span className="hidden sm:inline-block font-display font-bold text-lg">
              NESA-Africa
            </span>
          </Link>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <span>/</span>
            <span className="font-medium text-foreground">
              Nominee Dashboard
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <Badge
            variant={acceptanceStatus === "ACCEPTED" ? "default" : "secondary"}
            className="hidden sm:flex"
          >
            <Award className="h-3 w-3 mr-1" />
            <span className="hidden md:inline">
              {acceptanceStatus === "ACCEPTED" ? "Verified Nominee" : "Pending"}
            </span>
          </Badge>

          {/* Avatar */}
          <div className="flex items-center gap-2 pl-2 sm:border-l">
            <Avatar className="h-8 w-8">
              <AvatarImage src={photoUrl} alt={nomineeName} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <span className="hidden lg:inline-block text-sm font-medium max-w-[140px] truncate">
              {nomineeName}
            </span>
          </div>

          {/* Logout */}
          {onLogout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="hidden md:flex"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
