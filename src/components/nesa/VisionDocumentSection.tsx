import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSeason } from "@/contexts/SeasonContext";

export function VisionDocumentSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  const visionEndYear = currentEdition.displayYear + 10;
  
  const [expandAll, setExpandAll] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const sectionKeys = [
    "intro", "problem", "vision", "mission", "pillars",
    "milestones", "platinum", "governance", "success", "conclusion"
  ];

  const handleExpandAll = () => {
    if (expandAll) {
      setOpenItems([]);
    } else {
      setOpenItems(sectionKeys);
    }
    setExpandAll(!expandAll);
  };

  return (
    <section id="vision-2035" className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-sm font-medium mb-2 text-center">
            {t("landing.vision.badge")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            {t("landing.vision.title", { year: visionEndYear })}
          </h2>
          <p className="text-white/70 text-center mb-4">
            {t("landing.vision.tagline")}
          </p>
          <p className="text-white/70 text-center mb-8 max-w-2xl mx-auto">
            {t("landing.vision.description", { year: visionEndYear })}
          </p>

          <div className="flex justify-center mb-6">
            <Button
              variant="outline"
              onClick={handleExpandAll}
              className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
            >
              {expandAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {t("landing.vision.collapseAll")}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {t("landing.vision.expandAll")}
                </>
              )}
            </Button>
          </div>

          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
            className="space-y-3"
          >
            {sectionKeys.map((sectionKey) => (
              <AccordionItem
                key={sectionKey}
                value={sectionKey}
                className="bg-charcoal-light border border-gold/20 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-white hover:text-gold hover:no-underline">
                  {t(`landing.vision.sections.${sectionKey}.title`)}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-white/70 whitespace-pre-line">
                  {t(`landing.vision.sections.${sectionKey}.content`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
