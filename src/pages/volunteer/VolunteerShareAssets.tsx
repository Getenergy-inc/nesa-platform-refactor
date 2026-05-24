import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Download, Share2, Copy, ImageIcon, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const ASSETS = [
  { name: "NESA-Africa Volunteer Badge (PNG)", icon: ImageIcon, type: "image" },
  { name: "Social Media Cover Pack (1200x630)", icon: ImageIcon, type: "image" },
  { name: "Instagram Story Templates", icon: ImageIcon, type: "image" },
  { name: "Volunteer Recruitment One-Pager (PDF)", icon: FileText, type: "pdf" },
  { name: "Chapter Welcome Deck", icon: FileText, type: "pdf" },
  { name: "Ambassador Pitch Script", icon: FileText, type: "pdf" },
];

const COPY_SNIPPETS = [
  {
    label: "Twitter / X",
    text: "I'm proud to volunteer with @nesaafrica — building Africa's education movement, one chapter at a time. Join us → nesa.africa/volunteer",
  },
  {
    label: "LinkedIn",
    text: "I'm contributing to NESA-Africa, a Pan-African education recognition platform. We're looking for volunteers across tech, media, data, and storytelling. Apply: nesa.africa/volunteer",
  },
  {
    label: "WhatsApp",
    text: "Hey! I'm volunteering with NESA-Africa to recognize education changemakers across Africa. Want to join me? → nesa.africa/volunteer",
  },
];

function Inner() {
  const copy = (s: string) => {
    navigator.clipboard.writeText(s);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet><title>Volunteer Share Assets — NESA-Africa</title></Helmet>
      <div className="container mx-auto max-w-5xl px-4 pt-10">
        <Link to="/volunteer/dashboard" className="inline-flex items-center gap-1 text-gold/80 hover:text-gold text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="font-playfair text-3xl md:text-4xl text-gold mb-2">Share Assets</h1>
        <p className="text-white/60 mb-8">
          Branded graphics, copy, and campaign assets to help you grow the movement.
        </p>

        <h2 className="text-gold/90 uppercase tracking-widest text-xs mb-3">Downloadable assets</h2>
        <div className="grid md:grid-cols-2 gap-3 mb-10">
          {ASSETS.map((a) => (
            <div key={a.name} className="flex items-center gap-3 rounded-xl border border-gold/20 bg-white/[0.03] p-4">
              <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <a.icon className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1 text-sm text-white/80">{a.name}</div>
              <Button size="sm" variant="outline" className="border-gold/40 text-gold" onClick={() => toast.info("Coming soon")}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <h2 className="text-gold/90 uppercase tracking-widest text-xs mb-3">Copy snippets</h2>
        <div className="space-y-3">
          {COPY_SNIPPETS.map((c) => (
            <div key={c.label} className="rounded-xl border border-gold/20 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-widest text-gold/80">{c.label}</div>
                <Button size="sm" variant="ghost" className="text-gold" onClick={() => copy(c.text)}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <p className="text-sm text-white/80">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
          <Share2 className="h-8 w-8 text-gold mx-auto mb-2" />
          <p className="text-white/80 mb-4">
            Share your profile and grow your referrals from the dashboard.
          </p>
          <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to="/volunteer/referrals">Go to Referrals</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VolunteerShareAssets() {
  return <ProtectedRoute><Inner /></ProtectedRoute>;
}
