/**
 * Nominee self-service media submission.
 *
 * Extends the existing token-based nominee verification pathway (/nominee/accept/:token)
 * so a nominee can supply their own official website, logo or portrait and confirm
 * they are permitted to share it. Nothing submitted here appears publicly until a
 * reviewer approves it in the admin media review queue.
 */
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function NomineeMediaSubmission() {
  const { token } = useParams<{ token: string }>();
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [correctedName, setCorrectedName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!confirmed) {
      toast.error("Please confirm you are permitted to share this image.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.rpc("submit_nominee_media", {
      p_token: token,
      p_website: website.trim() || null,
      p_image_url: imageUrl.trim() || null,
      p_usage_confirmed: confirmed,
      p_corrected_name: correctedName.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error(`We could not save that: ${error.message}`);
      return;
    }
    setDone(true);
    toast.success("Thank you — your details are with our review team.");
  }

  return (
    <PublicLayout>
      <Helmet>
        <title>Send us your official image | NESA-Africa</title>
        <meta
          name="description"
          content="Nominees can share their official website, logo or portrait for review before it appears publicly."
        />
      </Helmet>

      <section className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-serif text-3xl font-bold">Send us your official image</h1>
        <p className="mt-3 text-muted-foreground">
          We only publish images an organisation or individual has shared themselves, or that
          our team has verified. Everything you send here is reviewed before it appears on
          your public nominee card.
        </p>

        {done ? (
          <div className="mt-8 rounded-xl border border-gold/30 bg-gold/5 p-6">
            <ShieldCheck className="h-6 w-6 text-gold" />
            <p className="mt-3 font-semibold">Received — awaiting review</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your nominee card keeps its branded placeholder until a reviewer approves the
              image. This does not affect your nomination or its review in any way.
            </p>
            <Button asChild variant="outline" className="mt-5">
              <Link to={`/nominee/dashboard/${token}`}>Back to your nominee page</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="website">Official website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://your-organisation.org"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="image">Link to your logo or portrait</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://your-organisation.org/logo.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                A direct link to the image file works best.
              </p>
            </div>
            <div>
              <Label htmlFor="name">Correct name, if ours is wrong</Label>
              <Input
                id="name"
                value={correctedName}
                onChange={(e) => setCorrectedName(e.target.value)}
                placeholder="Leave blank if the name we have is correct"
              />
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <Checkbox
                id="confirm"
                checked={confirmed}
                onCheckedChange={(v) => setConfirmed(v === true)}
              />
              <Label htmlFor="confirm" className="text-sm font-normal leading-relaxed">
                I confirm this image belongs to me or my organisation, and NESA-Africa may
                display it on this nominee profile.
              </Label>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send for review
            </Button>
          </form>
        )}
      </section>
    </PublicLayout>
  );
}
