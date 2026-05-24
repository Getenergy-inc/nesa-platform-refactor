import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const REGIONS = [
  "west-africa",
  "east-africa",
  "southern-africa",
  "central-africa",
  "north-africa",
  "horn-africa",
  "sahel",
  "indian-ocean",
  "diaspora-europe",
  "diaspora-americas",
];

export default function JoinLocalChapter() {
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    country: "",
    region: params.get("region") || "",
    intent: "join",
    motivation: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.region) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("volunteer_activity_logs").insert({
      action: "chapter_application",
      metadata: form as any,
    } as any);
    setLoading(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
    toast.success("Application received — we'll reach out shortly");
  };

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet>
        <title>Join a Local NESA-Africa Chapter</title>
        <meta
          name="description"
          content="Apply to join, lead, or partner with a NESA-Africa local chapter in your region."
        />
      </Helmet>

      <section className="container mx-auto max-w-3xl px-4 pt-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-widest mb-3">
            <Users className="h-3 w-3" /> Local Chapters
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl text-gold mb-3">
            Join a Local Chapter
          </h1>
          <p className="text-white/70">
            Become part of a community advancing education in your region.
          </p>
        </motion.div>

        {submitted ? (
          <div className="rounded-2xl border border-gold/30 bg-white/[0.04] p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl text-gold mb-2">Application Received</h2>
            <p className="text-white/70 mb-6">
              A chapter coordinator will reach out within 5 business days.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to="/volunteers">Meet Our Volunteers</Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/40 text-gold">
                <Link to="/chapters">Browse Chapters</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6 md:p-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">Full Name *</Label>
                <Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
              </div>
              <div>
                <Label className="text-white/80">Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <Label className="text-white/80">Country</Label>
                <Input value={form.country} onChange={(e) => update("country", e.target.value)} />
              </div>
              <div>
                <Label className="text-white/80">Region *</Label>
                <Select value={form.region} onValueChange={(v) => update("region", v)}>
                  <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-white/80">I want to *</Label>
                <Select value={form.intent} onValueChange={(v) => update("intent", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="join">Join an existing chapter</SelectItem>
                    <SelectItem value="lead">Start / lead a chapter</SelectItem>
                    <SelectItem value="partner">Partner with a chapter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-white/80">Why do you want to join?</Label>
                <Textarea
                  rows={4}
                  value={form.motivation}
                  onChange={(e) => update("motivation", e.target.value)}
                  placeholder="Tell us about your motivation and what you can contribute…"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} size="lg" className="w-full bg-gold text-charcoal hover:bg-gold/90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit Application <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
