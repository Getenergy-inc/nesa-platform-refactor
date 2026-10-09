import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Share2, MessageCircle, Linkedin, Facebook, Twitter, Link2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildReferralUrl } from "@/lib/volunteersData";
import { toast } from "@/hooks/use-toast";

interface Props {
  referralCode: string;
  volunteerName: string;
  variant?: "full" | "compact";
}

export function VolunteerReferralBlock({ referralCode, volunteerName, variant = "full" }: Props) {
  const url = buildReferralUrl(referralCode);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Referral link copied", description: url });
    setTimeout(() => setCopied(false), 1800);
  };

  const message = `Join ${volunteerName} and the NESA-Africa volunteer movement — together we're transforming education across Africa.`;
  const enc = encodeURIComponent;
  const shares = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${enc(`${message} ${url}`)}` },
    { label: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${enc(message)}&url=${enc(url)}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${referralCode}`);
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `nesa-${referralCode}.svg`;
    link.click();
  };

  return (
    <Card className="border-gold/30 bg-gradient-to-br from-charcoal/95 to-black p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-gold" />
        <h3 className="font-playfair text-xl text-gold">Refer & Share</h3>
      </div>

      <div className={`grid ${variant === "full" ? "md:grid-cols-[1fr_auto]" : "grid-cols-1"} gap-5`}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-gold/30 bg-black/40 px-3 py-2">
            <Link2 className="h-4 w-4 text-gold/70 shrink-0" />
            <code className="flex-1 truncate text-xs text-white/90">{url}</code>
            <Button size="sm" variant="ghost" onClick={copy} className="text-gold hover:text-gold hover:bg-gold/10">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {shares.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-1.5 rounded-md border border-gold/20 bg-black/30 px-2 py-2 text-xs text-white/80 hover:bg-gold/10 hover:border-gold/50 transition">
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </a>
            ))}
          </div>

          <p className="text-[11px] text-white/50">
            Code: <span className="text-gold font-mono">{referralCode}</span> — every signup grows the movement.
          </p>
        </div>

        {variant === "full" && (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-white p-3">
              <QRCodeSVG id={`qr-${referralCode}`} value={url} size={120} level="M" />
            </div>
            <Button size="sm" variant="ghost" onClick={downloadQR} className="text-gold text-xs">
              <Download className="h-3 w-3 mr-1" /> Save QR
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
