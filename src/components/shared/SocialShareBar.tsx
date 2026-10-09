// Cross-platform share buttons for amplifying contributor recognition
import { Twitter, Linkedin, Facebook, MessageCircle, Send, Link as LinkIcon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SocialShareBarProps {
  url: string;
  title: string;
  text?: string;
  hashtags?: string[];
  className?: string;
}

export function SocialShareBar({ url, title, text = "", hashtags = [], className }: SocialShareBarProps) {
  const { toast } = useToast();
  const enc = encodeURIComponent;
  const fullText = `${title}${text ? " — " + text : ""}`;
  const tags = hashtags.length ? " " + hashtags.map((h) => `#${h.replace(/[^A-Za-z0-9]/g, "")}`).join(" ") : "";

  const links = {
    twitter: `https://twitter.com/intent/tweet?text=${enc(fullText + tags)}&url=${enc(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(fullText)}`,
    whatsapp: `https://wa.me/?text=${enc(fullText + " " + url)}`,
    telegram: `https://t.me/share/url?url=${enc(url)}&text=${enc(fullText)}`,
    email: `mailto:?subject=${enc(title)}&body=${enc(fullText + "\n\n" + url)}`,
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Share it anywhere on social media." });
    } catch {
      toast({ title: "Copy failed", description: "Please copy the URL from your address bar.", variant: "destructive" });
    }
  };

  const btn = "border-gold/30 text-gold hover:bg-gold/10";

  return (
    <div className={className}>
      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Amplify on social</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline" className={btn}>
          <a href={links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on X / Twitter">
            <Twitter className="h-4 w-4" /> X
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className={btn}>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className={btn}>
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <Facebook className="h-4 w-4" /> Facebook
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className={btn}>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className={btn}>
          <a href={links.telegram} target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
            <Send className="h-4 w-4" /> Telegram
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className={btn}>
          <a href={links.email} aria-label="Share via Email">
            <Mail className="h-4 w-4" /> Email
          </a>
        </Button>
        <Button size="sm" variant="outline" className={btn} onClick={copy}>
          <LinkIcon className="h-4 w-4" /> Copy
        </Button>
      </div>
    </div>
  );
}

export default SocialShareBar;
