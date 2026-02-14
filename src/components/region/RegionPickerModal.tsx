import { Globe, MapPin, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRegion } from "@/contexts/RegionContext";
import { motion } from "framer-motion";

const REGION_ICONS: Record<string, string> = {
  "west-africa": "🌍",
  "east-africa": "🌍",
  "central-africa": "🌍",
  "southern-africa": "🌍",
  "north-africa": "🌍",
  "sahel-region": "🏜️",
  "horn-of-africa": "🦏",
  "indian-ocean-islands": "🏝️",
  "diaspora": "✈️",
  "friends-of-africa": "🤝",
};

export function RegionPickerModal() {
  const { regions, showRegionPicker, setShowRegionPicker, setActiveRegion, activeRegion } = useRegion();

  const handleSelect = (region: typeof regions[0]) => {
    setActiveRegion(region);
    setShowRegionPicker(false);
  };

  const handleExploreAll = () => {
    setActiveRegion(null as any);
    localStorage.setItem("nesa_selected_region", "all-africa");
    setShowRegionPicker(false);
  };

  return (
    <Dialog open={showRegionPicker} onOpenChange={setShowRegionPicker}>
      <DialogContent className="sm:max-w-lg bg-charcoal border-gold/20 text-white">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center">
            <Globe className="h-6 w-6 text-gold inline mr-2" />
            Where are you joining us from?
          </DialogTitle>
          <DialogDescription className="text-center text-white/60">
            Select your region to see relevant nominees, categories, and events.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-h-[50vh] overflow-y-auto pr-1">
          {regions.map((region, i) => (
            <motion.button
              key={region.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handleSelect(region)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 hover:border-gold/50 hover:bg-gold/10 ${
                activeRegion?.id === region.id
                  ? "border-gold bg-gold/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <span className="text-xl">{REGION_ICONS[region.slug] || "🌍"}</span>
              <span className="font-medium text-sm">{region.name}</span>
              {activeRegion?.id === region.id && (
                <Check className="h-4 w-4 text-gold ml-auto" />
              )}
            </motion.button>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-3 border-white/20 text-white/70 hover:bg-white/10 hover:text-white gap-2"
          onClick={handleExploreAll}
        >
          <Globe className="h-4 w-4" />
          Explore All Africa
          <ArrowRight className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
