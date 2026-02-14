import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/contexts/RegionContext";
import { useNavigate } from "react-router-dom";

export function RegionSwitcher() {
  const { regions, activeRegion, setActiveRegion, setNigeriaMode, isNigeriaMode } = useRegion();
  const navigate = useNavigate();

  const handleRegionSelect = (region: typeof regions[0]) => {
    setActiveRegion(region);
    setNigeriaMode(false);
  };

  const handleAllAfrica = () => {
    setActiveRegion(null as any);
    localStorage.setItem("nesa_selected_region", "all-africa");
    setNigeriaMode(false);
  };

  const handleNigeriaTrack = () => {
    const westAfrica = regions.find((r) => r.slug === "west-africa");
    if (westAfrica) setActiveRegion(westAfrica);
    setNigeriaMode(true);
    navigate("/region/nigeria");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/80 hover:text-gold hover:bg-gold/10 gap-1.5 font-medium"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isNigeriaMode
              ? "🇳🇬 Nigeria Chapter"
              : activeRegion
              ? `Viewing: ${activeRegion.name}`
              : "All Africa"}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-charcoal border-gold/20 text-white"
      >
        {regions.map((region) => (
          <DropdownMenuItem
            key={region.id}
            onClick={() => handleRegionSelect(region)}
            className="hover:bg-gold/10 hover:text-gold cursor-pointer gap-2"
          >
            {activeRegion?.id === region.id && !isNigeriaMode && (
              <Check className="h-3 w-3 text-gold" />
            )}
            <span className={activeRegion?.id === region.id && !isNigeriaMode ? "text-gold" : ""}>
              {region.name}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={handleAllAfrica}
          className="hover:bg-gold/10 hover:text-gold cursor-pointer gap-2"
        >
          <Globe className="h-3 w-3" />
          All Africa
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={handleNigeriaTrack}
          className="hover:bg-gold/10 hover:text-gold cursor-pointer gap-2"
        >
          🇳🇬 Nigeria Chapter Track
          {isNigeriaMode && <Check className="h-3 w-3 text-gold ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
