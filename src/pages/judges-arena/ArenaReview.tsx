import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Send, MessageCircleQuestion, Flag, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const dimensions = [
  { key: "equity", label: "Equity", desc: "Fair access and opportunity across populations served." },
  { key: "depth", label: "Depth of Impact", desc: "Tangible, measurable change in learners' lives." },
  { key: "innovation", label: "Innovation", desc: "Originality and creativity of the approach." },"" as any,
  { key: "scalability", label: "Scalability", desc: "Potential to replicate or expand the model." },
  { key: "sustainability", label: "Sustainability", desc: "Financial, operational, and ecological durability." },
  { key: "integrity", label: "Integrity", desc: "Governance, transparency, and ethical conduct." },
].filter(Boolean) as { key: string; label: string; desc: string }[];

export default function ArenaReview() {
  const { slug = "shofco-kenya" } = useParams();
  const name = decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(dimensions.map((d) => [d.key, 70]))
  );
  const overall = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / dimensions.length
  );

  return (
    <div className="space-y-5">
      {/* Top breadcrumb */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="text-gold hover:bg-gold/10 -ml-2">
          <Link to="/judges-arena/nominees"><ArrowLeft className="h-4 w-4 mr-1" /> Back to queue</Link>
        </Button>
        <Badge className="bg-gold/15 text-gold border border-gold/30">
          <ShieldCheck className="h-3 w-3 mr-1" /> Confidential review
        </Badge>
      </div>

      {/* Hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light to-charcoal p-5 flex flex-col md:flex-row gap-4 md:items-center"
      >
        <div className="h-14 w-14 rounded-xl bg-gold/15 grid place-items-center text-gold font-bold text-lg">
          {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-2xl text-white">{name}</h1>
          <div className="text-xs text-white/50 mt-1">Africa Education Impact · East Africa · Deadline Jun 18</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-white/40">EDI auto</div>
            <div className="text-2xl font-bold text-gold">82</div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-white/40">Your score</div>
            <div className="text-2xl font-bold text-gold">{overall}</div>
          </div>
        </div>
      </motion.div>

      {/* Split screen */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-5">
        {/* LEFT: Profile viewer */}
        <Card className="bg-white/[0.03] border-gold/15 text-white">
          <CardContent className="p-4 sm:p-5">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white/5 border border-gold/15">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="story">Full Story</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="edi">EDI Breakdown</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="text-sm text-white/80 leading-relaxed">
                  {name} has reached <span className="text-gold font-semibold">240,000+ learners</span>{" "}
                  across 14 informal settlements, combining tuition-free schooling with
                  community health programs. Their model integrates EDI principles end-to-end.
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ["240k+", "Learners reached"],
                    ["38", "Schools"],
                    ["91%", "Retention"],
                    ["12", "Years operating"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-lg border border-gold/15 bg-charcoal/40 p-3">
                      <div className="text-xl font-bold text-gold">{v}</div>
                      <div className="text-xs text-white/50">{l}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="story" className="mt-4 text-sm text-white/75 space-y-3">
                <p><strong className="text-gold">Problem.</strong> Quality education was inaccessible in Kibera due to fees, distance, and gender-based barriers.</p>
                <p><strong className="text-gold">Approach.</strong> Tuition-free schools paired with girls' empowerment, health and economic programs.</p>
                <p><strong className="text-gold">Outcome.</strong> 91% retention, 78% transition to secondary, recognized by regional ministries.</p>
              </TabsContent>

              <TabsContent value="evidence" className="mt-4 space-y-2">
                {["Independent evaluation 2024 (PDF)", "Ministry of Education endorsement letter", "Audited financials 2023"].map((e) => (
                  <div key={e} className="flex items-center justify-between p-3 rounded border border-gold/15 bg-charcoal/40">
                    <span className="text-sm">{e}</span>
                    <Button size="sm" variant="ghost" className="text-gold hover:bg-gold/10">View</Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="media" className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-video rounded-lg bg-gold/10 border border-gold/20 grid place-items-center text-gold/60 text-xs">Photo</div>
                  <div className="aspect-video rounded-lg bg-gold/10 border border-gold/20 grid place-items-center text-gold/60 text-xs">Video</div>
                </div>
              </TabsContent>

              <TabsContent value="edi" className="mt-4 space-y-3">
                {dimensions.map((d) => (
                  <div key={d.key} className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{d.label}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-40 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold" style={{ width: `${scores[d.key]}%` }} />
                      </div>
                      <span className="text-gold font-semibold w-10 text-right">{scores[d.key]}</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* RIGHT: Scoring */}
        <Card className="bg-white/[0.03] border-gold/15 text-white self-start lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle className="font-serif text-white text-lg">Your EDI Scoring</CardTitle>
            <p className="text-xs text-white/50">
              Each dimension scored 0–100. Confidential comments recommended.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {dimensions.map((d) => (
              <div key={d.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-white/85">{d.label}</Label>
                  <span className="text-gold font-semibold tabular-nums">{scores[d.key]}</span>
                </div>
                <p className="text-[11px] text-white/45">{d.desc}</p>
                <Slider
                  value={[scores[d.key]]}
                  max={100}
                  step={1}
                  onValueChange={(v) => setScores((s) => ({ ...s, [d.key]: v[0] }))}
                  className="[&_[role=slider]]:bg-gold [&_[role=slider]]:border-gold"
                />
              </div>
            ))}

            <div className="pt-2 border-t border-gold/15">
              <Label className="text-white/85">Confidential notes</Label>
              <Textarea
                placeholder="Evidence, rationale, follow-up questions… visible only to NRC/Admins."
                className="mt-1.5 bg-white/5 border-gold/20 text-white placeholder:text-white/40 min-h-[90px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/85 text-sm">Impact validation checklist</Label>
              {["Evidence is verifiable", "Outcomes are measurable", "EDI principles upheld", "No COI detected"].map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <Checkbox id={c} className="border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:text-charcoal" />
                  <Label htmlFor={c} className="text-sm text-white/75 font-normal">{c}</Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-white/85 text-sm">Recommendation</Label>
              <RadioGroup defaultValue="advance" className="grid grid-cols-2 gap-2">
                {[
                  ["shortlist", "Shortlist"],
                  ["advance", "Advance"],
                  ["info", "Needs info"],
                  ["reject", "Reject"],
                ].map(([v, l]) => (
                  <div key={v} className="flex items-center gap-2 rounded border border-gold/15 px-3 py-2 has-[:checked]:border-gold has-[:checked]:bg-gold/10">
                    <RadioGroupItem value={v} id={v} className="border-gold/40 text-gold" />
                    <Label htmlFor={v} className="text-sm font-normal cursor-pointer">{l}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button className="bg-gold text-charcoal hover:bg-gold-light flex-1">
                <Send className="h-4 w-4 mr-1" /> Submit
              </Button>
              <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <Save className="h-4 w-4 mr-1" /> Save draft
              </Button>
              <Button variant="ghost" className="text-white/70 hover:text-gold">
                <MessageCircleQuestion className="h-4 w-4 mr-1" /> Ask NRC
              </Button>
              <Button variant="ghost" className="text-white/70 hover:text-rose-300">
                <Flag className="h-4 w-4 mr-1" /> Flag
              </Button>
            </div>

            <p className="text-[11px] text-white/40 italic pt-2 border-t border-gold/10">
              "My scores reflect independent judgment based on the provided evidence."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
