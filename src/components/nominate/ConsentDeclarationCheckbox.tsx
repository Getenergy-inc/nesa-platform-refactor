import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
  children?: React.ReactNode;
}

export function ConsentDeclarationCheckbox({
  checked,
  onChange,
  id = "consent-declaration",
  children,
}: Props) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/5 p-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(Boolean(v))}
        className="mt-0.5 border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:text-charcoal"
      />
      <Label htmlFor={id} className="text-xs text-white/75 leading-relaxed cursor-pointer">
        {children ??
          "I confirm that the nomination information submitted is accurate to the best of my knowledge and that I understand nominations are subject to eligibility, verification, category-fit, governance, and integrity review."}
      </Label>
    </div>
  );
}
