import { AlertTriangle } from "lucide-react";

export function SaveSessionWarning() {
  return (
    <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 flex items-start gap-2">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
      <p>
        Your nomination entries are temporarily saved in this session. Please do not refresh or
        close this page until you submit.
      </p>
    </div>
  );
}
