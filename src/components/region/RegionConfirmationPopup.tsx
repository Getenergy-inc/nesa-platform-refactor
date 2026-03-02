import { useState, useEffect, forwardRef } from "react";
import { Globe, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRegion } from "@/contexts/RegionContext";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Agency Confirmation Popup
 * Shows after auto-assignment to let user confirm or switch region
 */
export function RegionConfirmationPopup() {
  const { user } = useAuth();
  const { activeRegion, setActiveRegion, setShowRegionPicker, userChapter } = useRegion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user && userChapter?.region_name && activeRegion) {
      const confirmed = localStorage.getItem(`nesa_region_confirmed_${user.id}`);
      if (!confirmed) {
        setShow(true);
      }
    }
  }, [user, userChapter, activeRegion]);

  const handleContinue = () => {
    if (user) localStorage.setItem(`nesa_region_confirmed_${user.id}`, "true");
    setShow(false);
  };

  const handleExploreAll = () => {
    setActiveRegion(null as any);
    localStorage.setItem("nesa_selected_region", "all-africa");
    if (user) localStorage.setItem(`nesa_region_confirmed_${user.id}`, "true");
    setShow(false);
  };

  const handleSwitch = () => {
    if (user) localStorage.setItem(`nesa_region_confirmed_${user.id}`, "true");
    setShow(false);
    setShowRegionPicker(true);
  };

  if (!activeRegion) return null;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-md bg-charcoal border-gold/20 text-white">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center">
            <Globe className="h-5 w-5 text-gold inline mr-2" />
            Region Assigned
          </DialogTitle>
          <DialogDescription className="text-center text-white/60">
            We've assigned you to <span className="text-gold font-semibold">{activeRegion.name}</span>.
            Would you like to:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Button
            className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold gap-2"
            onClick={handleContinue}
          >
            Continue with {activeRegion.name}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white/80 hover:bg-white/10 gap-2"
            onClick={handleExploreAll}
          >
            <Globe className="h-4 w-4" />
            Explore All Africa
          </Button>
          <Button
            variant="ghost"
            className="w-full text-white/60 hover:text-white gap-2"
            onClick={handleSwitch}
          >
            <RefreshCw className="h-4 w-4" />
            Switch Region
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
