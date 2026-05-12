import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, ShoppingBag, Music, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import galaImg from "@/assets/movement/gala-ticket.jpg";
import merchImg from "@/assets/movement/merchandise.jpg";
import anthemImg from "@/assets/movement/anthem.jpg";
import ambassadorsImg from "@/assets/movement/ambassadors.jpg";

const FALLBACK_IMAGE = "/images/placeholder.svg";

interface CardItem {
  icon: typeof Ticket;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  accent: string;
  image: string;
  imageAlt: string;
}

const items: CardItem[] = [
  {
    icon: Ticket,
    eyebrow: "Awards Gala",
    title: "Buy Your Gala Ticket",
    description:
      "Reserve your seat at the NESA-Africa Blue Garnet Awards Gala — an unforgettable night honoring Africa's education changemakers.",
    cta: "Buy Tickets",
    href: "/buy-your-ticket",
    accent: "from-gold/20 to-gold/5",
    image: galaImg,
    imageAlt: "NESA-Africa Blue Garnet Awards Gala ballroom with golden trophy",
  },
  {
    icon: ShoppingBag,
    eyebrow: "Shop & Support",
    title: "Buy Official Merchandise",
    description:
      "Wear the movement. Every purchase from the official NESA store funds Rebuild My School Africa and education legacy projects.",
    cta: "Visit Shop",
    href: "/shop",
    accent: "from-emerald-500/15 to-emerald-500/5",
    image: merchImg,
    imageAlt: "Young African ambassadors wearing NESA-Africa branded apparel",
  },
  {
    icon: Music,
    eyebrow: "Official Anthem",
    title: "Listen to the NESA Song",
    description:
      "Stream and download the official NESA-Africa anthem — a tribute to teachers, learners, and changemakers across the continent.",
    cta: "Play & Download",
    href: "/media",
    accent: "from-fuchsia-500/15 to-fuchsia-500/5",
    image: anthemImg,
    imageAlt: "African vocalist and chorus recording the NESA-Africa anthem",
  },
  {
    icon: Users,
    eyebrow: "Join the Network",
    title: "Become an Ambassador or SCEF Member",
    description:
      "Join a local chapter and sign up as a NESA-Africa Ambassador or SCEF Active Member today — lead change in your region and earn AGC rewards.",
    cta: "Join the Movement",
    href: "/ambassadors",
    accent: "from-sky-500/15 to-sky-500/5",
    image: ambassadorsImg,
    imageAlt: "NESA-Africa local chapter meeting with ambassadors around a table",
  },
];

function CardImage({ src, alt }: { src: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      width={1280}
      height={800}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 bg-charcoal"
      onError={() => setCurrentSrc(FALLBACK_IMAGE)}
    />
  );
}

export function SupportExperienceSection() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/20 to-charcoal" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <div className="container relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold tracking-wider uppercase mb-4">
            Experience • Support • Celebrate
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Be Part of the <span className="text-gold">Movement</span>
          </h2>
          <p className="text-white/65 text-base md:text-lg leading-relaxed">
            Attend the gala, wear the brand, play the anthem, or join a local chapter — four
            ways to celebrate and lead Africa's education movement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl border border-gold/15 bg-charcoal-light/40 backdrop-blur-sm overflow-hidden hover:border-gold/40 transition-colors flex flex-col"
            >
              {/* Hero image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  width={1280}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-charcoal-light/30 to-transparent" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-charcoal/70 backdrop-blur-sm border border-gold/30 px-3 py-1">
                  <item.icon className="h-3.5 w-3.5 text-gold" />
                  <span className="text-[10px] tracking-widest uppercase text-gold font-semibold">
                    {item.eyebrow}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="relative p-6 flex flex-col flex-1">
                <div
                  className={`absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-to-br ${item.accent} blur-2xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />
                <div className="relative flex flex-col flex-1">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                    {item.description}
                  </p>

                  <Link to={item.href} className="block mt-auto">
                    <Button
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full gap-2 group/btn"
                      size="lg"
                    >
                      {item.cta}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SupportExperienceSection;
