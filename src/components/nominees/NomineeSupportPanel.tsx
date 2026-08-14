import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link2, Loader2, MessageSquareQuote, ShieldCheck } from "lucide-react";
import { useSupportMessages } from "@/hooks/useNomineeProfile";

interface Props {
  nomineeId?: string;
  nomineeName: string;
  shareUrl: string;
}

/**
 * Supporter messages: moderated testimonials only.
 * There is no public voting and no visible counter — NESA-Africa 2026 is a
 * recognition cycle, not a popularity contest.
 */
export function NomineeSupportPanel({ nomineeId, nomineeName, shareUrl }: Props) {
  const { messages, submit } = useSupportMessages(nomineeId);
  const [form, setForm] = useState({
    author_name: "",
    author_email: "",
    author_organization: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const share = async () => {
    const data = {
      title: `${nomineeName} · NESA-Africa 2026`,
      text: `${nomineeName} is recognised on Africa's Education Impact Directory.`,
      url: shareUrl,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Profile link copied");
      }
    } catch {
      /* dismissed */
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }
    setSending(true);
    try {
      await submit({
        author_name: form.author_name.trim(),
        author_email: form.author_email.trim() || undefined,
        author_organization: form.author_organization.trim() || undefined,
        message: form.message.trim(),
      });
      toast.success("Thank you — your message goes to NRC review before publication.");
      setForm({ author_name: "", author_email: "", author_organization: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gold/15 bg-charcoal-light p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-white">
          Messages of support
        </h2>
        <Button variant="outline" size="sm" onClick={share} className="border-gold/30 text-gold">
          <Link2 className="mr-2 h-4 w-4" /> Share this profile
        </Button>
      </div>
      <p className="mt-2 flex items-start gap-2 text-sm text-white/60">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
        Messages are testimonials, not votes. Every message is reviewed by the Nominee
        Research Corps before it appears here, and none of them affect recognition outcomes.
      </p>

      {messages.length > 0 && (
        <ul className="mt-6 space-y-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <MessageSquareQuote className="h-4 w-4 text-gold/70" />
              <p className="mt-2 text-sm leading-relaxed text-white/80">{m.message}</p>
              <p className="mt-3 text-xs text-white/50">
                {m.author_name}
                {m.author_organization ? ` · ${m.author_organization}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sup-name" className="text-white/80">Your name</Label>
          <Input
            id="sup-name"
            required
            value={form.author_name}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sup-org" className="text-white/80">Organisation (optional)</Label>
          <Input
            id="sup-org"
            value={form.author_organization}
            onChange={(e) => setForm({ ...form, author_organization: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="sup-email" className="text-white/80">Email (optional, never published)</Label>
          <Input
            id="sup-email"
            type="email"
            value={form.author_email}
            onChange={(e) => setForm({ ...form, author_email: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="sup-msg" className="text-white/80">Your message</Label>
          <Textarea
            id="sup-msg"
            rows={4}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={`Why does ${nomineeName}'s work matter for education in Africa?`}
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={sending}>
            {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit for review
          </Button>
        </div>
      </form>
    </section>
  );
}
