// Rebuild My School Africa — Regional Nomination Portal
// Rendered for each of the 5 regions via URL slug

import { Helmet } from "react-helmet-async";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Shield, Lock, Calendar, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  REBUILD_MILESTONES,
  REBUILD_REGIONS,
  REBUILD_BADGES,
  isRebuildNominationsOpen,
} from "@/config/rebuildConfig";
import { SPECIAL_NEEDS_TRACKS, ALL_SUBCATEGORIES } from "@/config/specialNeedsCategories";
import { useSeason } from "@/contexts/SeasonContext";
import { toast } from "sonner";

export default function RebuildRegionalPortal() {
  const { regionSlug } = useParams<{ regionSlug: string }>();
  const { currentEdition } = useSeason();

  const region = REBUILD_REGIONS.find((r) => r.slug === regionSlug);
  if (!region) return <Navigate to="/eduaid-africa/rebuild-my-school" replace />;

  // Stage gating: nominations only open from config date
  const nominationsOpen = isRebuildNominationsOpen();

  return (
    <>
      <Helmet>
        <title>Nominate a School — {region.name} | Rebuild My School Africa</title>
        <meta
          name="description"
          content={`Nominate a special needs school in ${region.name} for the Rebuild My School Africa intervention.`}
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* ── Header ── */}
        <section className="pt-24 pb-12 border-b border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <Link
              to="/eduaid-africa/rebuild-my-school"
              className="inline-flex items-center gap-2 text-white/50 hover:text-primary text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to All Regions
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                  {region.name}
                </h1>
                <p className="text-white/40 text-xs">{region.countries.join(", ")}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {REBUILD_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold tracking-wider uppercase"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline Summary ── */}
        <section className="py-8 border-b border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {REBUILD_MILESTONES.map((m, i) => (
                <div key={m.label} className="rounded-lg border border-primary/10 bg-primary/5 p-3 text-center">
                  <m.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-white text-[11px] font-semibold">{m.displayDate}</p>
                  <p className="text-white/40 text-[9px]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Nomination Form or Locked State ── */}
        <section id="governance" className="py-16">
          <div className="container max-w-2xl mx-auto px-4">
            {nominationsOpen ? (
              <NominationForm region={region} />
            ) : (
              <LockedState />
            )}
          </div>
        </section>
      </div>
    </>
  );
}

// ── Locked State ──────────────────────────────────────────────────────────────

function LockedState() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-display font-bold text-white">
          Nominations Not Yet Open
        </h3>
        <p className="mb-4 max-w-md text-white/50 text-sm">
          School nominations for Rebuild My School Africa open in{" "}
          <span className="text-primary font-semibold">{REBUILD_MILESTONES[0].displayDate}</span>.
          Check back then to nominate a special needs school in your region.
        </p>
        <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white/60">
          <Calendar className="h-4 w-4" />
          <span>Opens: {REBUILD_MILESTONES[0].displayDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Nomination Form ───────────────────────────────────────────────────────────

function NominationForm({ region }: { region: (typeof REBUILD_REGIONS)[number] }) {
  const [selectedTrack, setSelectedTrack] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredSubs = selectedTrack
    ? ALL_SUBCATEGORIES.filter((s) => s.trackId === selectedTrack)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: wire to Supabase
    setTimeout(() => {
      toast.success("Nomination submitted successfully! It will be reviewed by the SCEF Regional Board.");
      setSubmitting(false);
    }, 1500);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
          Nominate a School in <span className="text-primary">{region.name}</span>
        </h2>
        <p className="text-white/50 text-sm">All fields marked * are required</p>
      </div>

      {/* School Details */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
        <h3 className="text-white text-sm font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" /> School Information
        </h3>

        <div>
          <Label className="text-white/70 text-xs">School Name *</Label>
          <Input required placeholder="Enter school name" className="bg-white/5 border-white/10 text-white" />
        </div>

        <div>
          <Label className="text-white/70 text-xs">Country *</Label>
          <Select required>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {region.countries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white/70 text-xs">Special Needs Track *</Label>
          <Select required onValueChange={setSelectedTrack}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select track" />
            </SelectTrigger>
            <SelectContent>
              {SPECIAL_NEEDS_TRACKS.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTrack && (
          <div>
            <Label className="text-white/70 text-xs">Subcategory *</Label>
            <Select required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubs.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label className="text-white/70 text-xs">Estimated Student Count</Label>
          <Input type="number" min={1} placeholder="e.g., 200" className="bg-white/5 border-white/10 text-white" />
        </div>
      </div>

      {/* Narrative */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
        <h3 className="text-white text-sm font-semibold">Challenges & Justification</h3>

        <div>
          <Label className="text-white/70 text-xs">Key Challenges *</Label>
          <Textarea required rows={3} placeholder="Describe the school's main challenges..." className="bg-white/5 border-white/10 text-white" />
        </div>

        <div>
          <Label className="text-white/70 text-xs">Why Intervention is Needed *</Label>
          <Textarea required rows={3} placeholder="Explain why this school should be selected..." className="bg-white/5 border-white/10 text-white" />
        </div>

        <div>
          <Label className="text-white/70 text-xs">Estimated Funding Need (USD)</Label>
          <Input type="number" min={0} placeholder="e.g., 25000" className="bg-white/5 border-white/10 text-white" />
        </div>
      </div>

      {/* Document Upload */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
        <h3 className="text-white text-sm font-semibold flex items-center gap-2">
          <Upload className="h-4 w-4 text-primary" /> Supporting Documents
        </h3>
        <p className="text-white/40 text-[11px]">Max 10MB per file. Accepted: PDF, JPG, PNG, DOCX</p>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.docx"
          className="bg-white/5 border-white/10 text-white text-xs"
        />
      </div>

      {/* Nominator Details */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
        <h3 className="text-white text-sm font-semibold">Your Details (Nominator)</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-white/70 text-xs">Full Name *</Label>
            <Input required placeholder="Your name" className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-white/70 text-xs">Email *</Label>
            <Input required type="email" placeholder="you@example.com" className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-white/70 text-xs">Phone</Label>
            <Input type="tel" placeholder="+234..." className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-white/70 text-xs">Organisation</Label>
            <Input placeholder="Your organisation (optional)" className="bg-white/5 border-white/10 text-white" />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary hover:bg-primary/90 text-secondary font-semibold py-3 text-base shadow-lg shadow-primary/20"
      >
        {submitting ? "Submitting..." : "Submit Nomination"}
      </Button>

      <p className="text-white/30 text-[10px] text-center">
        By submitting, you confirm all information is accurate. SCEF Regional Board will review this nomination.
      </p>
    </motion.form>
  );
}
