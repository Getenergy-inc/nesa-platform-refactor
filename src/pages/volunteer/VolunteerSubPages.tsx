import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { VolunteerReferralBlock } from "@/components/volunteers/VolunteerReferralBlock";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet><title>{`${title} — NESA-Africa`}</title></Helmet>
      <div className="container mx-auto px-4 pt-10 max-w-4xl">
        <Link to="/volunteer/dashboard" className="inline-flex items-center gap-1 text-gold/80 hover:text-gold text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="font-playfair text-3xl md:text-4xl text-gold mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}

// ============ PROFILE EDIT ============
function ProfileEditInner() {
  const { user } = useAuth();
  const [row, setRow] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("volunteers").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setRow(data));
  }, [user]);

  const save = async () => {
    if (!row) return;
    setSaving(true);
    const { error } = await supabase.from("volunteers").update({
      full_name: row.full_name, bio: row.bio, headline: row.headline,
      country: row.country, city: row.city, social_links: row.social_links ?? {},
    }).eq("id", row.id);
    setSaving(false);
    toast({ title: error ? "Save failed" : "Profile saved", description: error?.message });
  };

  if (!row) return <Shell title="My Profile"><Card className="border-gold/20 bg-black/40 p-6 text-white/60">No profile yet — apply via the Become a Volunteer page.</Card></Shell>;

  return (
    <Shell title="My Profile">
      <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6 space-y-4">
        <div><label className="text-sm text-white/70">Full name</label>
          <Input value={row.full_name ?? ""} onChange={(e) => setRow({ ...row, full_name: e.target.value })} className="bg-black/40 border-gold/30 text-white" />
        </div>
        <div><label className="text-sm text-white/70">Headline</label>
          <Input value={row.headline ?? ""} onChange={(e) => setRow({ ...row, headline: e.target.value })} className="bg-black/40 border-gold/30 text-white" />
        </div>
        <div><label className="text-sm text-white/70">Bio</label>
          <Textarea rows={5} value={row.bio ?? ""} onChange={(e) => setRow({ ...row, bio: e.target.value })} className="bg-black/40 border-gold/30 text-white" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-white/70">Country</label>
            <Input value={row.country ?? ""} onChange={(e) => setRow({ ...row, country: e.target.value })} className="bg-black/40 border-gold/30 text-white" />
          </div>
          <div><label className="text-sm text-white/70">City</label>
            <Input value={row.city ?? ""} onChange={(e) => setRow({ ...row, city: e.target.value })} className="bg-black/40 border-gold/30 text-white" />
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="bg-gold text-black hover:bg-gold/90">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </Card>
    </Shell>
  );
}
export function VolunteerProfileEdit() { return <ProtectedRoute><ProfileEditInner /></ProtectedRoute>; }

// ============ REFERRALS ============
function ReferralsInner() {
  const { user } = useAuth();
  const [vol, setVol] = useState<any>(null);
  const [refs, setRefs] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: v } = await supabase.from("volunteers").select("id,full_name,referral_code,referral_count").eq("user_id", user.id).maybeSingle();
      setVol(v);
      if (v) {
        const { data: r } = await supabase.from("volunteer_referrals").select("*").eq("volunteer_id", v.id).order("created_at", { ascending: false });
        setRefs(r ?? []);
      }
    })();
  }, [user]);

  if (!vol) return <Shell title="My Referrals"><Card className="border-gold/20 bg-black/40 p-6 text-white/60">Activate your volunteer profile to start referring.</Card></Shell>;

  return (
    <Shell title="My Referrals">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6">
          <h2 className="font-playfair text-xl text-gold mb-3">Conversions ({vol.referral_count})</h2>
          {refs.length === 0 ? (
            <p className="text-white/60 text-sm">No referrals yet — share your link to get started.</p>
          ) : (
            <div className="divide-y divide-gold/10">
              {refs.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm">{r.referred_name ?? r.referred_email ?? "Anonymous"}</div>
                    <div className="text-xs text-white/50">{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge className={r.status === "converted" ? "bg-gold/20 text-gold border-gold/40" : "bg-white/10 text-white/70"}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
        <VolunteerReferralBlock referralCode={vol.referral_code} volunteerName={vol.full_name} />
      </div>
    </Shell>
  );
}
export function VolunteerReferralsPage() { return <ProtectedRoute><ReferralsInner /></ProtectedRoute>; }

// ============ TASKS ============
function TasksInner() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: v } = await supabase.from("volunteers").select("id").eq("user_id", user.id).maybeSingle();
      if (!v) return;
      const { data } = await supabase.from("volunteer_tasks").select("*").eq("volunteer_id", v.id).order("created_at", { ascending: false });
      setTasks(data ?? []);
    })();
  }, [user]);

  return (
    <Shell title="My Tasks">
      <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6">
        {tasks.length === 0 ? (
          <p className="text-white/60 text-sm">No tasks assigned yet. Your team lead will assign tasks here.</p>
        ) : (
          <div className="divide-y divide-gold/10">
            {tasks.map((t) => (
              <div key={t.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{t.title}</div>
                  <Badge className="bg-gold/20 text-gold border-gold/40 capitalize">{t.status}</Badge>
                </div>
                {t.description && <p className="text-sm text-white/60 mt-1">{t.description}</p>}
                <div className="text-xs text-gold/70 mt-1">{t.points} pts</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Shell>
  );
}
export function VolunteerTasksPage() { return <ProtectedRoute><TasksInner /></ProtectedRoute>; }

// ============ ANALYTICS ============
function AnalyticsInner() {
  const { user } = useAuth();
  const [me, setMe] = useState<any>(null);
  useEffect(() => {
    if (!user) return;
    supabase.from("volunteers").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => setMe(data));
  }, [user]);

  if (!me) return <Shell title="Analytics"><Card className="border-gold/20 bg-black/40 p-6 text-white/60">No profile yet.</Card></Shell>;

  const cards = [
    { label: "Profile Views", value: me.profile_views ?? 0 },
    { label: "Contribution Score", value: me.contribution_score },
    { label: "Referral Conversions", value: me.referral_count },
    { label: "Tasks Completed", value: me.tasks_completed },
    { label: "Shares", value: me.shares_count ?? 0 },
    { label: "Events", value: me.events_count ?? 0 },
  ];
  return (
    <Shell title="Analytics">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c) => (
          <Card key={c.label} className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-5 text-center">
            <div className="text-3xl font-bold text-gold">{c.value}</div>
            <div className="text-xs text-white/60 uppercase tracking-wider mt-1">{c.label}</div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
export function VolunteerAnalyticsPage() { return <ProtectedRoute><AnalyticsInner /></ProtectedRoute>; }

// ============ SETTINGS ============
function SettingsInner() {
  const { user } = useAuth();
  const [row, setRow] = useState<any>(null);
  useEffect(() => {
    if (!user) return;
    supabase.from("volunteers").select("id,visibility_status").eq("user_id", user.id).maybeSingle().then(({ data }) => setRow(data));
  }, [user]);

  const setVis = async (v: string) => {
    if (!row) return;
    await supabase.from("volunteers").update({ visibility_status: v }).eq("id", row.id);
    setRow({ ...row, visibility_status: v });
    toast({ title: "Visibility updated" });
  };

  return (
    <Shell title="Settings">
      <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6 space-y-4">
        <h2 className="font-playfair text-xl text-gold">Profile Visibility</h2>
        {row ? (
          <div className="flex flex-wrap gap-2">
            {["public", "hidden", "alumni"].map((v) => (
              <Button key={v} variant={row.visibility_status === v ? "default" : "outline"}
                      onClick={() => setVis(v)}
                      className={row.visibility_status === v ? "bg-gold text-black" : "border-gold/40 text-gold"}>
                {v}
              </Button>
            ))}
          </div>
        ) : <p className="text-white/60 text-sm">No profile yet.</p>}
        <p className="text-xs text-white/50">Hidden profiles are only visible to you and admins. Alumni profiles remain visible but flagged as past contributors.</p>
      </Card>
    </Shell>
  );
}
export function VolunteerSettingsPage() { return <ProtectedRoute><SettingsInner /></ProtectedRoute>; }
