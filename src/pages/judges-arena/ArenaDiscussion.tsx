import { useState } from "react";
import { motion } from "framer-motion";
import { MessagesSquare, Send, EyeOff, Users, Vote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const forums = [
  { id: "stem", name: "STEM Innovation Judges", members: 12, unread: 3 },
  { id: "lifetime", name: "Lifetime Champions Panel", members: 7, unread: 0 },
  { id: "inclusion", name: "Inclusive Education Panel", members: 9, unread: 1 },
];

const threads = [
  {
    nominee: "SHOFCO Kenya",
    last: "Solid evidence on retention. Worth advancing to shortlist.",
    author: "Judge A4",
    time: "12m ago",
    replies: 6,
  },
  {
    nominee: "Building Tomorrow",
    last: "Need clarification on cost-per-learner figures.",
    author: "Judge B2",
    time: "1h ago",
    replies: 3,
  },
  {
    nominee: "AMI Nigeria",
    last: "Excellent depth, scalability concerns flagged.",
    author: "Judge C1",
    time: "Yesterday",
    replies: 9,
  },
];

const messages = [
  { from: "Judge A4", text: "Strong story. Retention metric is independently verified.", anon: false, time: "12:01" },
  { from: "Anonymous", text: "I'd like to see more on financial sustainability.", anon: true, time: "12:04" },
  { from: "Judge B2", text: "Agree — let's request supplementary evidence via NRC.", anon: false, time: "12:08" },
];

export default function ArenaDiscussion() {
  const [anonymous, setAnonymous] = useState(false);
  const [text, setText] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white">Discussion Arena</h1>
          <p className="text-white/60 text-sm mt-1">
            Moderated, timestamped, audit-logged. Use anonymous mode for sensitive remarks.
          </p>
        </div>
        <Badge className="bg-gold/15 text-gold border border-gold/30 hidden sm:inline-flex">
          Audit trail active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-5">
        {/* Forums */}
        <Card className="bg-white/[0.03] border-gold/15 text-white self-start">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gold/70 flex items-center gap-2">
              <Users className="h-4 w-4" /> Category forums
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {forums.map((f, i) => (
              <button
                key={f.id}
                className={`w-full text-left px-4 py-3 border-t border-gold/10 hover:bg-gold/5 ${i === 0 ? "bg-gold/10 border-l-2 border-l-gold" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{f.name}</span>
                  {f.unread > 0 && (
                    <Badge className="bg-gold text-charcoal hover:bg-gold">{f.unread}</Badge>
                  )}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{f.members} members</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Thread + chat */}
        <div className="space-y-5 min-w-0">
          {/* Threads */}
          <Card className="bg-white/[0.03] border-gold/15 text-white">
            <CardHeader>
              <CardTitle className="text-white font-serif text-lg flex items-center gap-2">
                <MessagesSquare className="h-4 w-4 text-gold" /> Active threads — STEM Innovation Judges
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gold/10 p-0">
              {threads.map((t) => (
                <div key={t.nominee} className="px-5 py-3 hover:bg-gold/5 cursor-pointer">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{t.nominee}</span>
                    <span className="text-xs text-white/40">{t.time}</span>
                  </div>
                  <div className="text-sm text-white/70 mt-1 line-clamp-1">
                    <span className="text-gold/80">{t.author}:</span> {t.last}
                  </div>
                  <div className="text-[11px] text-white/40 mt-1">{t.replies} replies</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active conversation */}
          <Card className="bg-white/[0.03] border-gold/15 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white font-serif text-lg">SHOFCO Kenya — Panel chat</CardTitle>
              <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
                <Vote className="h-4 w-4 mr-1" /> Open shortlist poll
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-gold/10 bg-charcoal/40 p-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={m.anon ? "text-white/50 italic" : "text-gold"}>{m.from}</span>
                      <span className="text-white/40">{m.time}</span>
                    </div>
                    <p className="text-sm text-white/85 mt-1">{m.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Composer */}
              <div className="pt-3 border-t border-gold/15 space-y-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="anon"
                    checked={anonymous}
                    onCheckedChange={setAnonymous}
                    className="data-[state=checked]:bg-gold"
                  />
                  <Label htmlFor="anon" className="text-xs text-white/70 flex items-center gap-1.5">
                    <EyeOff className="h-3.5 w-3.5" /> Post anonymously
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share your panel observation…"
                    className="bg-white/5 border-gold/20 text-white placeholder:text-white/40"
                  />
                  <Button className="bg-gold text-charcoal hover:bg-gold-light">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
