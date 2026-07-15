import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, Twitter, Facebook, Linkedin, Share2, Mail, MessageCircle, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  nomineeName: string;
  nomineeSlug: string;
  awardTitle?: string;
  subcategoryTitle?: string;
}

/**
 * Public-profile card that gives every nominee:
 *  1) A shareable "Endorse my contribution" link (with ?ref=<slug>) they can
 *     post to their own audience to call for endorsements.
 *  2) An "Accept your nomination" entry point for the nominee themselves —
 *     they paste the acceptance token from their email and are routed to
 *     the secure /nominee/accept/:token flow.
 */
export function NomineeEndorseShare({
  nomineeName,
  nomineeSlug,
  awardTitle,
  subcategoryTitle,
}: Props) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  const shareUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://nesa.africa";
    const url = new URL(`/nominees/${nomineeSlug}`, origin);
    url.searchParams.set("ref", nomineeSlug);
    url.searchParams.set("utm_source", "nominee_share");
    url.searchParams.set("utm_medium", "endorsement");
    url.searchParams.set("utm_campaign", "nesa2026_endorse");
    return url.toString();
  }, [nomineeSlug]);

  const shareMessage = useMemo(() => {
    const focus = subcategoryTitle || awardTitle || "NESA-Africa 2026";
    return `I've been nominated as an Enabler of Education for All Across Africa — ${focus} (NESA-Africa 2026). Please endorse my contribution and help advance quality education across the continent.`;
  }, [awardTitle, subcategoryTitle]);

  const encMsg = encodeURIComponent(shareMessage);
  const encUrl = encodeURIComponent(shareUrl);

  const socials = [
    { label: "Twitter / X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encMsg}&url=${encUrl}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}&quote=${encMsg}` },
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encMsg}%20${encUrl}` },
    { label: "Email", icon: Mail, href: `mailto:?subject=${encodeURIComponent("Please endorse my NESA-Africa 2026 nomination")}&body=${encMsg}%0A%0A${encUrl}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${shareMessage}\n\n${shareUrl}`);
      setCopied(true);
      toast.success("Endorsement link copied to your clipboard");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Copy failed — please long-press the link to copy manually.");
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: `Endorse ${nomineeName} — NESA-Africa 2026`, text: shareMessage, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
  }

  function goAccept() {
    const raw = tokenInput.trim();
    if (!raw) {
      toast.error("Paste the acceptance token from your nomination email.");
      return;
    }
    // Accept both a raw token or a full URL containing /nominee/accept/<token>
    const match = raw.match(/nominee\/accept\/([^/?#]+)/i);
    const token = match ? match[1] : raw;
    navigate(`/nominee/accept/${encodeURIComponent(token)}`);
  }

  return (
    <Card className="bg-charcoal-light/60 border-gold/20">
      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Endorsement share */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-display text-ivory font-semibold">
                Share your endorsement link
              </h2>
              <p className="text-[12px] text-ivory/60 mt-0.5">
                Ask your community to endorse your contribution as an Enabler of Education for All Across Africa.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <Input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="bg-charcoal/60 border-gold/20 text-ivory text-xs md:text-sm"
              aria-label="Your shareable endorsement link"
            />
            <div className="flex gap-2">
              <Button
                onClick={copyLink}
                className="bg-gold hover:bg-gold-dark text-charcoal font-medium"
              >
                {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="outline"
                onClick={nativeShare}
                className="border-gold/30 text-ivory hover:bg-gold/10"
              >
                <Share2 className="w-4 h-4 mr-1.5" /> Share
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 px-3 py-1.5 text-[12px] text-ivory/85 transition-colors"
                aria-label={`Share on ${label}`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </a>
            ))}
          </div>

          <p className="text-[11px] text-ivory/45 mt-3 leading-relaxed">
            Suggested message: <span className="italic text-ivory/70">"{shareMessage}"</span>
          </p>
        </div>

        <div className="h-px bg-gold/10" />

        {/* Accept nomination */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-display text-ivory font-semibold">
                Are you {nomineeName}? Accept your nomination
              </h2>
              <p className="text-[12px] text-ivory/60 mt-0.5">
                Use the secure acceptance link sent to the email on your nomination record.
              </p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-medium">
                <KeyRound className="w-4 h-4 mr-1.5" /> Accept nomination
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-charcoal border-gold/20 text-ivory">
              <DialogHeader>
                <DialogTitle className="font-display text-ivory">Accept your NESA-Africa 2026 nomination</DialogTitle>
                <DialogDescription className="text-ivory/70">
                  Paste your acceptance token — or the full acceptance link — from the email we sent you.
                  Can't find it? Email <a className="text-gold underline" href="mailto:nominations@nesa.africa">nominations@nesa.africa</a> for a resend.
                </DialogDescription>
              </DialogHeader>
              <Input
                autoFocus
                placeholder="Paste token or https://nesa.africa/nominee/accept/…"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="bg-charcoal-light/60 border-gold/20 text-ivory"
              />
              <DialogFooter>
                <Button onClick={goAccept} className="bg-gold hover:bg-gold-dark text-charcoal font-medium">
                  Continue to secure acceptance →
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default NomineeEndorseShare;
