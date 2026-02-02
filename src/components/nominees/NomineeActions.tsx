import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VoteModal } from "./VoteModal";
import { RenominateModal } from "./RenominateModal";
import { ThumbsUp, RotateCcw } from "lucide-react";

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
}

interface NomineeActionsProps {
  nominee: NomineeActionsData;
  /** Visual variant */
  variant?: "default" | "compact" | "icon-only";
  /** Show vote button */
  showVote?: boolean;
  /** Show renominate/endorse button */
  showRenominate?: boolean;
  /** Callback after successful vote */
  onVoteSuccess?: () => void;
  /** Callback after successful renomination */
  onRenominateSuccess?: () => void;
  /** Additional class names */
  className?: string;
}

export function NomineeActions({
  nominee,
  variant = "default",
  showVote = true,
  showRenominate = true,
  onVoteSuccess,
  onRenominateSuccess,
  className = "",
}: NomineeActionsProps) {
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [renominateModalOpen, setRenominateModalOpen] = useState(false);

  const isCompact = variant === "compact";
  const isIconOnly = variant === "icon-only";

  const handleVoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVoteModalOpen(true);
  };

  const handleRenominateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRenominateModalOpen(true);
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Vote Button - Primary */}
        {showVote && (
          <Button
            onClick={handleVoteClick}
            size={isCompact || isIconOnly ? "sm" : "default"}
            className={`${
              isIconOnly
                ? "h-8 w-8 p-0"
                : isCompact
                ? "h-8 px-3"
                : ""
            } bg-gold hover:bg-gold-dark text-charcoal font-medium`}
            title="Vote for this nominee"
          >
            <ThumbsUp className={`${isIconOnly ? "h-4 w-4" : "h-4 w-4 mr-1.5"}`} />
            {!isIconOnly && "Vote"}
          </Button>
        )}

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
            title="Endorse this nominee"
          >
            <RotateCcw className={`${isIconOnly ? "h-4 w-4" : "h-4 w-4 mr-1.5"}`} />
            {!isIconOnly && "Endorse"}
          </Button>
        )}
      </div>

      {/* Vote Modal */}
      <VoteModal
        open={voteModalOpen}
        onOpenChange={setVoteModalOpen}
        nomineeId={nominee.nomineeId}
        nomineeName={nominee.nomineeName}
        nomineeSlug={nominee.nomineeSlug}
        awardTitle={nominee.awardTitle}
        subcategoryTitle={nominee.subcategoryTitle}
        onVoteSuccess={onVoteSuccess}
      />

      {/* Renominate Modal */}
      <RenominateModal
        open={renominateModalOpen}
        onOpenChange={setRenominateModalOpen}
        nomineeId={nominee.nomineeId}
        nomineeName={nominee.nomineeName}
        awardTitle={nominee.awardTitle}
        subcategoryTitle={nominee.subcategoryTitle}
        currentCount={nominee.renominationCount}
        onRenominateSuccess={onRenominateSuccess}
      />
    </>
  );
}

export default NomineeActions;
