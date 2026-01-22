import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    id: "intro",
    title: "1. Introduction",
    content: `The New Education Standards Awards Africa (NESA-Africa) is a continental education standards, recognition, and accountability platform established to elevate education impact, public trust, and measurable outcomes across Africa.

Vision 2035 defines NESA-Africa's 10-year strategic direction — moving from an awards-led initiative into a continent-wide education standards and impact institution that connects recognition with lasting social transformation.

This vision aligns with:
• SDG 4 — Quality Education
• African Union Agenda 2063
• National education reform agendas
• CSR and philanthropic accountability frameworks`,
  },
  {
    id: "problem",
    title: "2. The Problem NESA-Africa Addresses",
    content: "Details about the educational challenges NESA-Africa aims to solve across the continent.",
  },
  {
    id: "vision",
    title: "3. Vision Statement",
    content: "The long-term vision for education standards and recognition in Africa by 2035.",
  },
  {
    id: "mission",
    title: "4. Mission Statement",
    content: "The mission guiding NESA-Africa's operations and initiatives.",
  },
  {
    id: "pillars",
    title: "5. Core Pillars of Vision 2035",
    content: "The foundational pillars supporting NESA-Africa's strategic direction.",
  },
  {
    id: "milestones",
    title: "6. Strategic Milestones (2025–2035)",
    content: "Key milestones and targets for the next decade.",
  },
  {
    id: "platinum",
    title: "7. Role of Platinum Certification",
    content: "How Platinum certification serves as the baseline recognition layer.",
  },
  {
    id: "governance",
    title: "8. Governance & Integrity",
    content: "The governance framework ensuring transparency and integrity.",
  },
  {
    id: "success",
    title: "9. What Success Looks Like by 2035",
    content: "Measurable outcomes and indicators of success by 2035.",
  },
  {
    id: "conclusion",
    title: "10. Conclusion",
    content: `Vision 2035 aligns with continental and global frameworks:
• SDG 4
• AU Agenda 2063
• ECOWAS
• SADC
• EAC
• ECCAS`,
  },
];

export function VisionDocumentSection() {
  const [expandAll, setExpandAll] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleExpandAll = () => {
    if (expandAll) {
      setOpenItems([]);
    } else {
      setOpenItems(sections.map((s) => s.id));
    }
    setExpandAll(!expandAll);
  };

  return (
    <section id="vision-2035" className="bg-nesa-navy py-16 md:py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <p className="text-nesa-gold text-sm font-medium mb-2 text-center">
            Strategic Vision Document
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            NESA-AFRICA VISION 2035
          </h2>
          <p className="text-nesa-text-muted text-center mb-4">
            Setting Africa's Education Standards. Recognising Impact. Delivering Legacy.
          </p>
          <p className="text-nesa-text-muted text-center mb-8 max-w-2xl mx-auto">
            Vision 2035 defines NESA-Africa's 10-year strategic direction — moving from an
            awards-led initiative into a continent-wide education standards and impact institution
            that connects recognition with lasting social transformation.
          </p>

          <div className="flex justify-center mb-6">
            <Button
              variant="outline"
              onClick={handleExpandAll}
              className="border-nesa-gold/30 text-nesa-gold hover:bg-nesa-gold/10 rounded-full gap-2"
            >
              {expandAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse All Sections
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All Sections
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
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="bg-nesa-navy-dark/50 border border-nesa-gold/10 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-white hover:text-nesa-gold hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-nesa-text-muted whitespace-pre-line">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
