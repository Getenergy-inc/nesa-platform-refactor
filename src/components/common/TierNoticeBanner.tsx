// TierNoticeBanner — standardises the "no public voting / recognition edition /
// jury-only / impact-based" notice that must appear near the top of every
// 2026 award tier page. Prevents inconsistent phrasing across surfaces.

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TierNoticeKind = "recognition" | "jury-only" | "impact-based" | "icon";

const NOTICES: Record<TierNoticeKind, { title: string; body: string }> = {
  recognition: {
    title: "2026 Recognition Edition",
    body: "No public voting or competitive ranking in 2026. Verified nominees receive a Certificate of Recognition, a Letter of Appreciation, a verified profile, and a directory listing. Competitive recognition returns in 2027.",
  },
  "jury-only": {
    title: "Jury-only recognition",
    body: "NRC verification, independent jury assessment, and governance approval determine outcomes. No public voting, no sponsor influence.",
  },
  "impact-based": {
    title: "Recognised for verified impact, not popularity",
    body: "Nominees are assessed on verified education impact — not follower count, celebrity status, or public popularity.",
  },
  icon: {
    title: "Lifetime recognition",
    body: "The Africa Education Icon Award recognises two decades of contribution across three pathways. Nine laureates. No public voting.",
  },
};

export interface TierNoticeBannerProps {
  kind: TierNoticeKind;
  className?: string;
}

export function TierNoticeBanner({ kind, className }: TierNoticeBannerProps) {
  const notice = NOTICES[kind];
  return (
    <aside
      role="note"
      aria-label={notice.title}
      className={cn(
        "flex gap-3 rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm text-foreground",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
      <div>
        <p className="font-semibold text-gold">{notice.title}</p>
        <p className="mt-1 text-muted-foreground">{notice.body}</p>
      </div>
    </aside>
  );
}

export default TierNoticeBanner;
