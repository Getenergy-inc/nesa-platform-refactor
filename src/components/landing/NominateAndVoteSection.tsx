import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Vote, Coins } from "lucide-react";

export function NominateAndVoteSection() {
  const blocks = [
    {
      icon: UserPlus,
      eyebrow: "Step 1",
      title: "Nominate a Changemaker",
      body: "Submit a person, organisation, or institution transforming education across Africa or its diaspora.",
      href: "/nominate",
      cta: "Start Nomination",
    },
    {
      icon: Vote,
      eyebrow: "Step 2",
      title: "Explore Recognition",
      body: "Use Afri-Gold Coins to back finalists during the Blue Garnet voting window. Every vote is auditable.",
      href: "/vote",
      cta: "Open Voting Hub",
    },
    {
      icon: Coins,
      eyebrow: "Step 3",
      title: "Earn AGC",
      body: "Engage, share, and refer to grow your wallet — then convert participation into real influence.",
      href: "/earn-agc",
      cta: "Earn AGC Now",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-charcoal to-charcoal-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
            How participation works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2">
            Nominate. Vote. Earn.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {blocks.map((b, i) => (
            <motion.div
              key={b.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                to={b.href}
                className="block h-full rounded-2xl border border-gold/20 hover:border-gold/60 bg-charcoal p-6 transition-all group hover:shadow-[0_20px_50px_-20px_hsl(42_85%_52%/0.4)]"
              >
                <div className="w-11 h-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-charcoal transition-colors">
                  <b.icon className="w-5 h-5" />
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-gold/80 mb-1">
                  {b.eyebrow}
                </div>
                <h3 className="font-display text-xl font-bold text-ivory mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-ivory/65 mb-4">{b.body}</p>
                <span className="text-sm font-semibold text-gold">{b.cta} →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NominateAndVoteSection;
