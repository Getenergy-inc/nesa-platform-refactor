/**
 * Volunteer Command Center — internal operations hub for NESA-Africa 2026.
 *
 * Houses the volunteer mission statement, social channels, team structure,
 * SMAT objectives, all 22 nomination call captions, platform adaptation
 * guide, submission process, and the 22-category assignment tracker.
 *
 * Sign-in gated. Linked from /volunteer footer (not in public nav).
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Lock, ExternalLink } from "lucide-react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";

// ============================================================================
// DATA — sourced verbatim from the NESA-Africa 2026 volunteer brief
// ============================================================================

const MISSION_STATEMENT =
  "To architect a world-class digital ecosystem that amplifies African educational excellence, unifies global diaspora advocacy, and drives transparent institutional accountability by turning multi-platform visibility into direct structural investments for marginalized learners across the continent.";

const SOCIAL_CHANNELS: Array<{ platform: string; handle: string; url?: string }> = [
  { platform: "Instagram", handle: "@nesaafrica", url: "https://instagram.com/nesaafrica" },
  { platform: "TikTok", handle: "@nesa_africa", url: "https://tiktok.com/@nesa_africa" },
  { platform: "Facebook", handle: "NESA Africa", url: "https://facebook.com/nesaafrica" },
  { platform: "X (Twitter)", handle: "@Nesa_Award", url: "https://x.com/Nesa_Award" },
  {
    platform: "LinkedIn",
    handle: "New Education Standard Award Africa (NESA-Africa)",
    url: "https://linkedin.com/company/nesa-africa",
  },
];

const REQUIRED_HASHTAGS = ["#NESAAfrica", "#EducationForAll", "#SDG4", "#Agenda2063"];

const TEAMS = [
  {
    name: "Team Alpha — Growth & Regions",
    capacity: "6–8",
    platforms: "Instagram, TikTok, Facebook",
    kpi: "5,000 followed nominees & 40 school profiles",
    weeklyTime: "4 hrs",
    objectives: "Objectives 2 & 3",
  },
  {
    name: "Team Beta — Influencers & Hype",
    capacity: "6–8",
    platforms: "WhatsApp, Telegram, LekeeLekee",
    kpi: "100 affiliate ambassador leads onboarded",
    weeklyTime: "4 hrs",
    objectives: "Objectives 1 & 5",
  },
  {
    name: "Team Gamma — B2B Partnerships",
    capacity: "3–4",
    platforms: "LinkedIn, WeChat, YouTube",
    kpi: "250 qualified corporate CSR leads",
    weeklyTime: "5 hrs",
    objectives: "Objectives 4 & 5",
  },
  {
    name: "Central Coordination Unit",
    capacity: "1–2",
    platforms: "Central automation software",
    kpi: "100% on-time scheduled content output",
    weeklyTime: "3 hrs",
    objectives: "All — coordinator role",
  },
];

const SMAT_OBJECTIVES = [
  {
    n: 1,
    title: "Viral Reach & Affiliate Conversion",
    metric:
      "40 million aggregate reach via 100 high-engagement African/Diaspora influencers onboarded as nominees and affiliate brand ambassadors.",
    execution:
      "Team Beta — Instagram/TikTok DMs with standardised Affiliate Nomination Toolkit and custom digital badges.",
  },
  {
    n: 2,
    title: "Target-Driven Follower Acquisition",
    metric:
      "5,000 verified educational professionals, school administrators, and academic institutions connected by Q3 2026.",
    execution:
      "Team Alpha — 20 targeted profiles per day per volunteer via platform search tools on X and LinkedIn.",
  },
  {
    n: 3,
    title: "Verified Special Needs Nominations",
    metric:
      "Minimum 5 verified grassroots special needs school nominations per region × 8 regions = 40 profiles for Rebuild My School Africa structural grants.",
    execution:
      "Team Alpha — WhatsApp and Telegram outreach to NGOs and school districts; lightweight mobile web-forms with photo evidence.",
  },
  {
    n: 4,
    title: "B2B Relationship & Sponsorship Pipeline",
    metric:
      "250 verified corporate CSR executives, multinational foundations, and international development agencies for Platinum Certifications and Gala ticket sales.",
    execution:
      "Team Gamma — LinkedIn and email only; weekly case studies on NESA transparent funding metrics.",
  },
  {
    n: 5,
    title: "Global Subconscious Mindshare",
    metric:
      "40 million global users via a non-negotiable 3×/week multi-platform publishing cadence with short-form vertical video.",
    execution:
      "Central Content Scheduler — unified asset folders and Buffer/Hootsuite automation; daily volunteer workload under 45 minutes.",
  },
];

interface CategoryCaption {
  id: number;
  tier: 1 | 2 | 3 | 4;
  name: string;
  subs: number;
  caption: string;
}

const CAPTIONS: CategoryCaption[] = [
  // Tier 1 — Blue Garnet
  { id: 1, tier: 1, name: "Best CSR for Education (Africa Regional)", subs: 6, caption: "Nominations are open for Best CSR for Education (Africa Regional) — the Blue Garnet category honoring corporate social responsibility initiatives advancing education across the continent. Know a company doing the work? Nominate them now." },
  { id: 2, tier: 1, name: "Best CSR for Education (Nigeria)", subs: 23, caption: "Calling all Nigerian corporations leading on education CSR — nominations are open for Best CSR for Education (Nigeria). Help us celebrate the companies investing in the nation's classrooms." },
  { id: 3, tier: 1, name: "Best EduTech Innovation for Education (Africa Regional)", subs: 3, caption: "Is your edtech innovation transforming how Africa learns? Nominations are open for Best EduTech Innovation for Education (Africa Regional) — nominate a platform, app, or tool making real classroom impact." },
  { id: 4, tier: 1, name: "Best Media Organisation for Education Advocacy (Nigeria)", subs: 4, caption: "Which Nigerian media house is championing education in its coverage? Nominate them for Best Media Organisation for Education Advocacy (Nigeria) — recognizing journalism that puts learning on the front page." },
  { id: 5, tier: 1, name: "Best NGO for Education Advancement (Nigeria)", subs: 5, caption: "Nominations are open for Best NGO for Education Advancement (Nigeria). Tell us which non-governmental organisation is making the biggest difference in Nigerian classrooms and communities." },
  { id: 6, tier: 1, name: "Best NGO for Education Advancement (Africa Regional)", subs: 5, caption: "From literacy programs to school infrastructure, NGOs across Africa are closing the education gap. Nominate one for Best NGO for Education Advancement (Africa Regional)." },
  { id: 7, tier: 1, name: "Best STEM Education Programme (Africa Regional)", subs: 4, caption: "Science, technology, engineering, and maths shape Africa's future workforce. Nominate an outstanding initiative for Best STEM Education Programme (Africa Regional)." },
  { id: 8, tier: 1, name: "Best Creative Arts Contribution to Education (Nigeria)", subs: 7, caption: "Art, music, film, and design are powerful teaching tools. Nominate a Nigerian creative individual or organisation for Best Creative Arts Contribution to Education." },
  { id: 9, tier: 1, name: "Best Education Policy & Implementation State (Nigeria)", subs: 6, caption: "Which Nigerian state is getting education policy right? Nominate it for Best Education Policy & Implementation State — recognizing real implementation, not just paperwork." },
  // Tier 2 — Platinum
  { id: 10, tier: 2, name: "Best Tertiary Institution Library (Nigeria)", subs: 8, caption: "Libraries shape how students learn to think. Nominate a Nigerian tertiary institution for Best Tertiary Institution Library and help us celebrate excellence in higher-education library services." },
  { id: 11, tier: 2, name: "Excellence in Research & Development for Education (Nigeria)", subs: 3, caption: "Nominate a Nigerian research institution advancing education through evidence and innovation — Excellence in Research & Development for Education nominations are now open." },
  { id: 12, tier: 2, name: "Excellence in Christian Education Impact (Africa Regional)", subs: 3, caption: "Faith-based institutions have shaped African education for generations. Nominate a Christian organisation or leader for Excellence in Christian Education Impact (Africa Regional)." },
  { id: 13, tier: 2, name: "Excellence in Islamic Education Impact (Africa Regional)", subs: 3, caption: "Nominate an Islamic institution or leader making a lasting impact on education across Africa — Excellence in Islamic Education Impact (Africa Regional) nominations are open." },
  { id: 14, tier: 2, name: "Excellence in Political Leadership for Education (Nigeria)", subs: 3, caption: "Which Nigerian political leader has put education policy into real action? Nominate them for Excellence in Political Leadership for Education." },
  { id: 15, tier: 2, name: "Excellence in International Partnership for Education (Africa)", subs: 4, caption: "International partnerships are accelerating education outcomes across Africa. Nominate a global partner organisation for Excellence in International Partnership for Education." },
  { id: 16, tier: 2, name: "Excellence in Diaspora Educational Impact (International)", subs: 3, caption: "From scholarships to school-building, the diaspora is investing in African education from abroad. Nominate a diaspora organisation for Excellence in Diaspora Educational Impact." },
  // Tier 3 — Icon
  { id: 17, tier: 3, name: "Africa Education Philanthropy Icon of the Decade", subs: 1, caption: "This is a once-in-a-decade honor. Nominate a philanthropist whose lifetime giving has transformed African education for Africa Education Philanthropy Icon of the Decade." },
  { id: 18, tier: 3, name: "Literary & New Curriculum Advocate Icon of the Decade", subs: 1, caption: "Nominate a literary figure or curriculum reformer who has shaped how Africa's children learn — Literary & New Curriculum Advocate Icon of the Decade." },
  { id: 19, tier: 3, name: "Africa Technical Educator Icon of the Decade", subs: 1, caption: "Nominate a pioneer of technical and vocational education whose work has opened doors for an entire generation — Africa Technical Educator Icon of the Decade." },
  // Tier 4 — Influencers
  { id: 20, tier: 4, name: "African Social Media Influencers Education Impact Award", subs: 1, caption: "Creators, podcasters, and online educators are changing how Africa learns. Nominate a social media influencer using their platform for education — African Social Media Influencers Education Impact Award." },
  { id: 21, tier: 4, name: "African Sports Icons Supporting Education", subs: 1, caption: "From scholarship funds to school-building, athletes are scoring wins for education too. Nominate a sports icon or academy for African Sports Icons Supporting Education." },
  { id: 22, tier: 4, name: "African Music Icons Supporting Education", subs: 1, caption: "Music moves culture — and sometimes, it moves whole communities toward education. Nominate a musician or music executive for African Music Icons Supporting Education." },
];

const PLATFORM_GUIDE = [
  { platform: "Instagram", format: "Carousel (4–6 slides, 1080×1350px) or 15–30s Reel", adaptation: "Hook slide → eligibility slide → how to nominate slide → deadline reminder slide", cta: "Link in bio; tag someone who deserves nomination" },
  { platform: "TikTok", format: "15–60s vertical video (1080×1920px)", adaptation: "Hook in first 3 seconds; category name and eligibility on screen; nominate link as text overlay at end", cta: "Link in bio; duet or comment with who they're nominating" },
  { platform: "Facebook", format: "Single image or short video (1200×630px), 150–250 words", adaptation: "Add one sentence of context on why the category matters; keep rest as written", cta: "Directly clickable nominate link; encourage shares and tags" },
  { platform: "X (Twitter)", format: "2–3 post thread; first post includes image", adaptation: "Trim to under 280 characters per post; lead with category name and \"Nominations are open\"", cta: "Quote-tweet with their nomination" },
  { platform: "LinkedIn", format: "Single post 150–250 words with one graphic, professional register", adaptation: "Reframe opening toward professional peers: \"Know a colleague or partner organization who...\"", cta: "Invite connections to nominate a colleague or partner" },
];

const SUBMISSION_STEPS = [
  "Save draft (text + image/video) to shared campaign folder: Category_VolunteerName_Platform_Date",
  "Submit at least 48 hours before scheduled posting date",
  "Campaign coordinator reviews for category name accuracy, nominate link, deadline, and hashtag compliance",
  "Coordinator schedules and posts — volunteers do not post directly to official accounts unless instructed",
];

const TIER_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: "Tier 1 · Blue Garnet",
  2: "Tier 2 · Platinum",
  3: "Tier 3 · Africa Education Icon",
  4: "Tier 4 · Influencers Education Impact",
};

// ============================================================================
// COMPONENT
// ============================================================================

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold/80 font-semibold"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function SignInGate() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-charcoal px-4">
      <div className="max-w-md w-full rounded-2xl border border-gold/25 bg-charcoal/70 p-8 text-center">
        <Lock className="h-10 w-10 text-gold mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-ivory mb-2">
          Volunteer Command Center
        </h1>
        <p className="text-ivory/70 text-sm mb-6">
          This is an internal operations hub for the NESA-Africa volunteer corps.
          Sign in with your volunteer account to continue.
        </p>
        <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
          <Link to="/auth/login?redirect=/volunteers/command-center">Sign in to continue</Link>
        </Button>
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center text-ivory/60 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <>
      <LocalizedSEO
        pathname="/volunteers/command-center"
        title="Volunteer Command Center | NESA-Africa 2026"
        description="Internal operations hub for the NESA-Africa volunteer corps — mission, teams, SMAT objectives, nomination captions, platform guide, and assignment tracker."
      />
      <div className="min-h-screen bg-charcoal pt-14 sm:pt-16">
        <NESAHeader />

        {!user ? (
          <SignInGate />
        ) : (
          <main className="container mx-auto px-4 py-10 max-w-7xl">
            <header className="mb-8">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                Internal · Volunteer Operations
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2">
                Volunteer Command Center
              </h1>
              <p className="text-ivory/70 text-sm md:text-base mt-2 max-w-3xl">
                Everything the NESA-Africa 2026 volunteer corps needs to run the
                season — mission, teams, objectives, captions, platform guide,
                workflow, and tracker.
              </p>
            </header>

            <Tabs defaultValue="mission" className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-charcoal-light/40 border border-gold/15 p-2">
                <TabsTrigger value="mission">Mission</TabsTrigger>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="objectives">SMAT Objectives</TabsTrigger>
                <TabsTrigger value="captions">Captions</TabsTrigger>
                <TabsTrigger value="platforms">Platform Guide</TabsTrigger>
                <TabsTrigger value="process">Process</TabsTrigger>
                <TabsTrigger value="tracker">Tracker</TabsTrigger>
              </TabsList>

              {/* MISSION */}
              <TabsContent value="mission" className="mt-6">
                <div className="rounded-2xl border border-gold/25 bg-charcoal/70 p-6 md:p-8">
                  <h2 className="font-display text-lg text-gold uppercase tracking-wider mb-4">
                    Social Media Mission Statement
                  </h2>
                  <blockquote className="font-display text-xl md:text-2xl text-ivory leading-relaxed border-l-4 border-gold pl-5">
                    “{MISSION_STATEMENT}”
                  </blockquote>
                </div>
              </TabsContent>

              {/* CHANNELS */}
              <TabsContent value="channels" className="mt-6 space-y-4">
                <div className="rounded-2xl border border-gold/25 bg-charcoal/70 p-6">
                  <h2 className="font-display text-lg text-ivory mb-4">Official Social Media Channels</h2>
                  <ul className="divide-y divide-gold/10">
                    {SOCIAL_CHANNELS.map((c) => (
                      <li key={c.platform} className="flex items-center justify-between py-3">
                        <div>
                          <div className="text-ivory font-semibold text-sm">{c.platform}</div>
                          <div className="text-ivory/70 text-xs">{c.handle}</div>
                        </div>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold text-xs inline-flex items-center gap-1 hover:underline"
                          >
                            Open <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-gold/25 bg-charcoal/70 p-6">
                  <h2 className="font-display text-lg text-ivory mb-3">Required Hashtags (every post)</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {REQUIRED_HASHTAGS.map((h) => (
                      <span
                        key={h}
                        className="rounded-full bg-gold/15 border border-gold/30 text-gold px-3 py-1 text-xs font-semibold"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                  <CopyButton text={REQUIRED_HASHTAGS.join(" ")} label="Copy all hashtags" />
                </div>
              </TabsContent>

              {/* TEAMS */}
              <TabsContent value="teams" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {TEAMS.map((t) => (
                    <div key={t.name} className="rounded-2xl border border-gold/25 bg-charcoal/70 p-5">
                      <h3 className="font-display text-lg text-ivory mb-3">{t.name}</h3>
                      <dl className="grid grid-cols-2 gap-2 text-xs">
                        <dt className="text-ivory/55 uppercase tracking-wider">Capacity</dt>
                        <dd className="text-ivory/90">{t.capacity}</dd>
                        <dt className="text-ivory/55 uppercase tracking-wider">Platforms</dt>
                        <dd className="text-ivory/90">{t.platforms}</dd>
                        <dt className="text-ivory/55 uppercase tracking-wider">KPI</dt>
                        <dd className="text-ivory/90">{t.kpi}</dd>
                        <dt className="text-ivory/55 uppercase tracking-wider">Weekly time</dt>
                        <dd className="text-ivory/90">{t.weeklyTime}</dd>
                        <dt className="text-ivory/55 uppercase tracking-wider">Owns</dt>
                        <dd className="text-gold">{t.objectives}</dd>
                      </dl>
                    </div>
                  ))}
                </div>
                <p className="text-ivory/60 text-xs mt-4">
                  Total workforce: 15–25 volunteers across 4 teams.
                </p>
              </TabsContent>

              {/* SMAT OBJECTIVES */}
              <TabsContent value="objectives" className="mt-6 space-y-4">
                {SMAT_OBJECTIVES.map((o) => (
                  <div key={o.n} className="rounded-2xl border border-gold/25 bg-charcoal/70 p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="rounded-full bg-gold text-charcoal font-bold w-7 h-7 flex items-center justify-center text-sm">
                        {o.n}
                      </span>
                      <h3 className="font-display text-lg text-ivory">{o.title}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm mt-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-gold/70 mb-1">Metric</div>
                        <p className="text-ivory/85 leading-relaxed">{o.metric}</p>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-gold/70 mb-1">Execution</div>
                        <p className="text-ivory/85 leading-relaxed">{o.execution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* CAPTIONS */}
              <TabsContent value="captions" className="mt-6 space-y-6">
                {[1, 2, 3, 4].map((tier) => (
                  <div key={tier}>
                    <h2 className="font-display text-lg text-gold mb-3">
                      {TIER_LABEL[tier as 1 | 2 | 3 | 4]}
                    </h2>
                    <div className="space-y-3">
                      {CAPTIONS.filter((c) => c.tier === tier).map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-gold/20 bg-charcoal/60 p-4"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="font-semibold text-ivory text-sm">
                              <span className="text-gold/70 font-mono mr-2">
                                {String(c.id).padStart(2, "0")}
                              </span>
                              {c.name}
                            </h4>
                            <CopyButton text={c.caption} />
                          </div>
                          <p className="text-ivory/80 text-sm leading-relaxed">{c.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* PLATFORM GUIDE */}
              <TabsContent value="platforms" className="mt-6">
                <div className="rounded-2xl border border-gold/25 bg-charcoal/70 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-charcoal-light/40 text-ivory/70 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="text-left p-3">Platform</th>
                        <th className="text-left p-3">Format</th>
                        <th className="text-left p-3">Adaptation</th>
                        <th className="text-left p-3">CTA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {PLATFORM_GUIDE.map((p) => (
                        <tr key={p.platform} className="align-top">
                          <td className="p-3 text-gold font-semibold whitespace-nowrap">{p.platform}</td>
                          <td className="p-3 text-ivory/85">{p.format}</td>
                          <td className="p-3 text-ivory/85">{p.adaptation}</td>
                          <td className="p-3 text-ivory/85">{p.cta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* PROCESS */}
              <TabsContent value="process" className="mt-6">
                <div className="rounded-2xl border border-gold/25 bg-charcoal/70 p-6">
                  <h2 className="font-display text-lg text-ivory mb-4">
                    Submission &amp; Review Process
                  </h2>
                  <ol className="space-y-3">
                    {SUBMISSION_STEPS.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ivory/85">
                        <span className="rounded-full bg-gold text-charcoal font-bold w-6 h-6 flex items-center justify-center text-xs shrink-0">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">
                          {step.includes("Category_VolunteerName_Platform_Date") ? (
                            <>
                              {step.split("Category_VolunteerName_Platform_Date")[0]}
                              <code className="bg-charcoal-light/60 text-gold px-1.5 py-0.5 rounded text-xs">
                                Category_VolunteerName_Platform_Date
                              </code>
                              {step.split("Category_VolunteerName_Platform_Date")[1]}
                            </>
                          ) : (
                            step
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </TabsContent>

              {/* TRACKER */}
              <TabsContent value="tracker" className="mt-6">
                <div className="rounded-2xl border border-gold/25 bg-charcoal/70 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-charcoal-light/40 text-ivory/70 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="text-left p-3 w-12">#</th>
                        <th className="text-left p-3">Award Category</th>
                        <th className="text-left p-3 w-32">Tier</th>
                        <th className="text-left p-3 w-32">Assignee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {CAPTIONS.map((c) => (
                        <tr key={c.id}>
                          <td className="p-3 text-gold/70 font-mono">{String(c.id).padStart(2, "0")}</td>
                          <td className="p-3 text-ivory/90">{c.name}</td>
                          <td className="p-3 text-ivory/70 text-xs">
                            {TIER_LABEL[c.tier].replace(/^Tier \d · /, "")}
                          </td>
                          <td className="p-3 text-ivory/40 italic text-xs">unassigned</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-ivory/55 text-xs mt-3">
                  Assignment persistence is not wired to the database yet. Track
                  assignments in the shared campaign folder until the volunteer
                  assignments table ships.
                </p>
              </TabsContent>
            </Tabs>
          </main>
        )}

        <NESAFooter />
      </div>
    </>
  );
}
