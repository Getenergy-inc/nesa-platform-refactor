import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Share2, Gift, Youtube, Users } from "lucide-react";
import { toast } from "sonner";

interface NomineeReferralCardProps {
  nomineeName: string;
  nomineeSlug: string;
  variant?: "default" | "compact";
}

export function NomineeReferralCard({ 
  nomineeName, 
  nomineeSlug,
  variant = "default" 
}: NomineeReferralCardProps) {
  const [copied, setCopied] = useState(false);

  // Generate the referral link for this nominee
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${baseUrl}/nominees/${encodeURIComponent(nomineeSlug)}?ref=share`;
  const youtubeChannelUrl = "https://www.youtube.com/@Nesa.africaTV";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Nominee link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    const shareText = `Support ${nomineeName} in the NESA Africa Awards 2025! 🏆 Vote and help them win recognition for their contribution to education in Africa.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${nomineeName} - NESA Africa Awards 2025`,
          text: shareText,
          url: referralLink,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleShareToTwitter = () => {
    const text = encodeURIComponent(`Support ${nomineeName} in the NESA Africa Awards 2025! 🏆 Vote now:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`, "_blank");
  };

  const handleShareToWhatsApp = () => {
    const text = encodeURIComponent(`Support ${nomineeName} in the NESA Africa Awards 2025! 🏆 Vote and help them win: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (variant === "compact") {
    return (
      <div className="rounded-lg border border-gold/20 bg-charcoal-light p-4">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="h-4 w-4 text-gold" />
          <span className="text-sm font-medium text-ivory">Share & Support</span>
        </div>
        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="text-xs bg-charcoal border-gold/20 text-ivory/80 truncate"
          />
          <Button 
            size="icon" 
            onClick={handleCopy}
            variant="outline"
            className={`border-gold/30 ${copied ? "bg-green-500/20 text-green-400" : "text-gold hover:bg-gold/10"}`}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-charcoal-light border-gold/20 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-ivory flex items-center gap-2 text-lg">
          <Gift className="w-5 h-5 text-gold" />
          Share & Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Explanation */}
        <p className="text-sm text-ivory/60">
          Share {nomineeName.split(" ")[0]}'s profile to help them gain visibility and endorsements!
        </p>

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-xs text-ivory/50 uppercase tracking-wider">
            Nominee Profile Link
          </label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="text-sm bg-charcoal border-gold/20 text-ivory/80 font-mono"
            />
            <Button 
              size="icon" 
              onClick={handleCopy}
              variant="outline"
              className={`border-gold/30 flex-shrink-0 ${copied ? "bg-green-500/20 text-green-400 border-green-500/30" : "text-gold hover:bg-gold/10"}`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleShare}
            className="flex-1 bg-gold hover:bg-gold-dark text-charcoal font-medium"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            onClick={handleShareToTwitter}
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10"
          >
            𝕏
          </Button>
          <Button 
            onClick={handleShareToWhatsApp}
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10"
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>

        {/* Watch on NESA TV */}
        <div className="pt-3 border-t border-gold/10">
          <a 
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-400 transition-colors"
          >
            <Youtube className="h-5 w-5" />
            <span className="text-sm font-medium">Watch on NESA Africa TV</span>
          </a>
        </div>

        {/* Bonus Info */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gold/5 border border-gold/10">
          <Badge variant="outline" className="border-gold/30 text-gold text-xs">
            Pro Tip
          </Badge>
          <span className="text-xs text-ivory/60">
            More shares = more endorsements = Platinum Certificate!
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default NomineeReferralCard;
