import { NESALogo } from "@/components/nesa/NESALogo";
import { Award } from "lucide-react";

interface AcceptanceLetterHeaderProps {
  nomineeName: string;
}

export function AcceptanceLetterHeader({ nomineeName }: AcceptanceLetterHeaderProps) {
  return (
    <div className="text-center space-y-6 pb-6 border-b">
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-2xl">
          <NESALogo variant="full" className="h-20" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Award className="h-4 w-4" />
          <span>Official Nomination Letter</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          NESA-Africa 2025
        </h1>
        <p className="text-muted-foreground">
          New Education Standard Awards Africa
        </p>
      </div>

      <div className="bg-gradient-to-r from-transparent via-border to-transparent h-px" />

      <div className="text-left space-y-2 pt-4">
        <p className="text-muted-foreground">Dear</p>
        <p className="text-xl font-semibold text-foreground">{nomineeName},</p>
      </div>
    </div>
  );
}
