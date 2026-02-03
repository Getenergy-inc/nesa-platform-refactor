import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  Twitter,
  MessageCircle,
  Link2,
  Heart,
  Users,
  Tv,
  Mail,
  ExternalLink,
} from "lucide-react";

interface NomineeEngagementHubProps {
  nomineeSlug: string;
  nomineeName: string;
  referralCode?: string;
}

export function NomineeEngagementHub({
  nomineeSlug,
  nomineeName,
  referralCode,
}: NomineeEngagementHubProps) {
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/nominees/${nomineeSlug}`;
  const referralUrl = referralCode
    ? `${profileUrl}?ref=${referralCode}`
    : profileUrl;

  const shareText = `I've been nominated for the NESA-Africa 2025 Excellence Awards! Support my journey by endorsing me: ${referralUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const engagementActions = [
    {
      title: "Donate to NESA",
      description: "Support education in Africa",
      icon: Heart,
      href: "/donate",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
    },
    {
      title: "Nominate Others",
      description: "Recognize deserving educators",
      icon: Users,
      href: "/nominate",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "NESA TV Features",
      description: "Watch nominee spotlights",
      icon: Tv,
      href: "/media/nesa-tv",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Newsletter Signup",
      description: "Stay updated on NESA news",
      icon: Mail,
      href: "/contact",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Share Your Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-5 w-5 text-primary" />
            Share Your Nomination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mobilize your community! Every share increases your visibility and endorsements.
          </p>

          {/* Shareable Link */}
          <div className="flex gap-2">
            <Input
              value={referralUrl}
              readOnly
              className="bg-muted font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className={copied ? "border-green-500 text-green-500" : ""}
            >
              {copied ? <Copy className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              onClick={shareTwitter}
              className="flex-1 hover:bg-sky-50 hover:border-sky-500 hover:text-sky-600"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter/X
            </Button>
            <Button
              variant="outline"
              onClick={shareWhatsApp}
              className="flex-1 hover:bg-green-50 hover:border-green-500 hover:text-green-600"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Get Involved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {engagementActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group"
              >
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {action.description}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
