import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryNominationForm } from "./CategoryNominationForm";
import type { AwardCategoryConfig } from "@/config/awardCategories";

interface Props {
  config: AwardCategoryConfig;
  trigger: ReactNode;
}

/**
 * Wraps any trigger button in a Dialog that shows the category's
 * inline Google Form (or fallback CTA) without navigating away.
 */
export function CategoryNominationDialog({ config, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const nominateHref =
    config.ctaNominateHref ?? `/nominate?category=${encodeURIComponent(config.slug)}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-charcoal border-gold/30">
        <DialogHeader>
          <DialogTitle className="font-playfair text-gold text-xl md:text-2xl">
            Nominate — {config.finalName}
          </DialogTitle>
        </DialogHeader>
        <div className="-mx-6 -mb-6">
          <CategoryNominationForm config={config} />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            <Link to={nominateHref}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open full page
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-foreground/70"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { Sparkles };
