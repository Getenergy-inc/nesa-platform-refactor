// Icon-specific governance / non-influence statement.
//
// Previously attached to the (now removed) IconTimelineSection. It still has to
// render near the Icon flagship content, so it lives on as a small standalone
// text block placed directly under the flagship + pathway cards.

import { ICON_GOVERNANCE_STATEMENT } from "@/config/brandHierarchy";

export function IconGovernanceNote() {
  return (
    <div className="ed-wrap pb-10">
      <div className="mx-auto max-w-3xl space-y-1.5 border-t border-gold/15 pt-5 text-center">
        {ICON_GOVERNANCE_STATEMENT.map((line) => (
          <p key={line} className="text-xs leading-relaxed text-white/50">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export default IconGovernanceNote;
