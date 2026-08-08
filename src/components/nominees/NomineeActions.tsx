import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RenominateModal } from "./RenominateModal";
import { RotateCcw } from "lucide-react";

export interface NomineeActionsData {
  nomineeId: string;
  nomineeSlug: string;
  nomineeName: string;
  awardSlug?: string;
  awardTitle?: string;
  subcategorySlug?: string;
  subcategoryTitle?: string;
  groupSlug?: string; // region/diaspora/friends
  groupName?: string;
  imageUrl?: string;
  country?: string;
  renominationCount?: number;
  /** Referral code from ?ref= — attributes endorsement + increments counter atomically. */
  referralCode?: string;
}

interface NomineeActionsProps {
  nominee: NomineeActionsData;
  /** Visual variant */
  variant?: "default" | "compact" | "icon-only";
  /** Show renominate/endorse button */
  showRenominate?: boolean;
  /** Callback after successful renomination */
  onRenominateSuccess?: () => void;
  /** Additional class names */
  className?: string;
}

export function NomineeActions({
  nominee,
  variant = "default",
  showRenominate = true,
  onRenominateSuccess,
  className = "",
}: NomineeActionsProps) {
  const [renominateModalOpen, setRenominateModalOpen] = useState(false);

  const isCompact = variant === "compact";
  const isIconOnly = variant === "icon-only";


  const handleRenominateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRenominateModalOpen(true);
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>

        {/* Renominate/Endorse Button - Secondary */}
        {showRenominate && (
          <Button
            onClick={handleRenominateClick}
            variant="outline"
            size={isCompact || isIconOnly ? "sm" : "default"}
            className={`${
              isIconOnly
                ? "h-8 w-8 p-0"
                : isCompact
                ? "h-8 px-3"
                : ""
            } border-gold/30 text-gold hover:bg-gold/10`}
            title="Renominate / Endorse this nominee"
          >
            <RotateCcw className={`${isIconOnly ? "h-4 w-4" : "h-4 w-4 mr-1.5"}`} />
            {!isIconOnly && "Renominate"}
          </Button>
        )}
      </div>


      {/* Renominate Modal */}
      <RenominateModal
        open={renominateModalOpen}
        onOpenChange={setRenominateModalOpen}
        nomineeId={nominee.nomineeId}
        nomineeName={nominee.nomineeName}
        nomineeSlug={nominee.nomineeSlug}
        awardSlug={nominee.awardSlug}
        awardTitle={nominee.awardTitle}
        subcategorySlug={nominee.subcategorySlug}
        subcategoryTitle={nominee.subcategoryTitle}
        groupSlug={nominee.groupSlug}
        groupName={nominee.groupName}
        currentCount={nominee.renominationCount}
        referralCode={nominee.referralCode}
        onRenominateSuccess={onRenominateSuccess}
      />
    </>
  );
}

export default NomineeActions;
