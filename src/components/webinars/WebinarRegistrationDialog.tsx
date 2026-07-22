import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { downloadIcs } from "@/lib/ics";
import { trackEvent } from "@/lib/analytics";

export interface WebinarInfo {
  id: string | number;
  title: string;
  date: string;
  time: string;
  /** Optional real start Date for calendar export; falls back to a computed placeholder. */
  startAt?: Date;
  durationMinutes?: number;
  category?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webinar: WebinarInfo | null;
}

const FormSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  organization: z.string().max(200).optional().or(z.literal("")),
  country: z.string().max(120).optional().or(z.literal("")),
  role: z.string().max(120).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

function guessStart(webinar: WebinarInfo): Date {
  if (webinar.startAt) return webinar.startAt;
  // Fallback: parse first date-like token in webinar.date, default 15:00 WAT (UTC+1)
  const m = webinar.date.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  const now = new Date();
  if (!m) return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const [, dd, mon, yyyy] = m;
  const monthIdx = new Date(`${mon} 1, 2000`).getMonth();
  // 15:00 WAT === 14:00 UTC
  return new Date(Date.UTC(Number(yyyy), monthIdx, Number(dd), 14, 0, 0));
}

export function WebinarRegistrationDialog({ open, onOpenChange, webinar }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ id?: string; already?: boolean } | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    organization: "",
    country: "",
    role: "",
    notes: "",
  });

  const reset = () => {
    setForm({ full_name: "", email: "", organization: "", country: "", role: "", notes: "" });
    setDone(null);
  };

  const handleClose = (v: boolean) => {
    if (!v) setTimeout(reset, 200);
    onOpenChange(v);
  };

  const handleCalendar = () => {
    if (!webinar) return;
    const start = guessStart(webinar);
    const end = new Date(start.getTime() + (webinar.durationMinutes ?? 90) * 60 * 1000);
    downloadIcs(`nesa-webinar-${webinar.id}`, {
      uid: `webinar-${webinar.id}`,
      title: `NESA-Africa · ${webinar.title}`,
      description: `${webinar.title}\n${webinar.date} · ${webinar.time}\nJoin link will be shared by email.`,
      location: "Online (link emailed before session)",
      url: `${window.location.origin}/media/webinars`,
      start,
      end,
    });
    trackEvent("webinar_calendar_export", { webinar_id: String(webinar.id), title: webinar.title });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webinar) return;
    const parsed = FormSchema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast.error(first ?? "Please check the form and try again");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("webinar-register", {
        body: {
          webinar_id: String(webinar.id),
          webinar_title: webinar.title,
          webinar_date: webinar.date,
          webinar_time: webinar.time,
          full_name: parsed.data.full_name,
          email: parsed.data.email,
          organization: parsed.data.organization || null,
          country: parsed.data.country || null,
          role: parsed.data.role || null,
          notes: parsed.data.notes || null,
          source: "webinars_page",
        },
      });
      if (error) throw new Error(error.message);
      trackEvent("webinar_register_success", {
        webinar_id: String(webinar.id),
        title: webinar.title,
        already_registered: Boolean((data as any)?.already_registered),
      });
      setDone({ id: (data as any)?.registration_id, already: (data as any)?.already_registered });
      if ((data as any)?.already_registered) {
        toast.success("You're already on the list for this session.");
      } else {
        toast.success("You're registered! A confirmation email is on its way.");
      }
    } catch (err: any) {
      console.error("webinar-register failed", err);
      toast.error(err?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {webinar && !done && (
          <>
            <DialogHeader>
              <DialogTitle>Reserve your seat</DialogTitle>
              <DialogDescription>
                {webinar.title} — {webinar.date} · {webinar.time}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="full_name">Full name*</Label>
                  <Input id="full_name" required value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email*</Label>
                  <Input id="email" type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="role">Your role</Label>
                  <Input id="role" placeholder="Educator, funder, student, journalist…" value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="notes">Anything you'd like the panel to address? (optional)</Label>
                  <Textarea id="notes" rows={3} value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:justify-between">
                <Button type="button" variant="ghost" onClick={() => handleClose(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-gold hover:bg-gold-dark text-charcoal">
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering…</> : "Confirm RSVP"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {webinar && done && (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="mb-1 text-xl font-semibold">
              {done.already ? "You're already on the list" : "You're registered!"}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {webinar.title} — {webinar.date} · {webinar.time}
            </p>
            <p className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> A confirmation email has been queued to {form.email || "your inbox"}.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={handleCalendar} className="bg-gold hover:bg-gold-dark text-charcoal">
                <Calendar className="mr-2 h-4 w-4" /> Add to calendar (.ics)
              </Button>
              <Button variant="outline" onClick={() => handleClose(false)}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
