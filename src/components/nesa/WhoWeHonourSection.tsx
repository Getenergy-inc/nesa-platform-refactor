import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Crown,
  HeartHandshake,
  Building2,
  Globe2,
  Cpu,
  Coins,
  BookOpen,
  Landmark,
  Megaphone,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type HonourCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
};

const CARDS: HonourCard[] = [
  {
    icon: Crown,
    title: "Africa Education Icons",
    body: "Exceptional individuals whose lifetime contributions have transformed education across Africa.",
    href: "/awards/pillars/africa-education-icon",
  },
  {
    icon: HeartHandshake,
    title: "Philanthropy for Education",
    body: "Philanthropists, foundations and scholarship providers investing in opportunity, equity and access.",
    href: "/awards/pillars/philanthropy-for-education",
  },
  {
    icon: Building2,
    title: "CSR for Education by Organisations",
    body: "Companies whose Corporate Social Responsibility creates measurable education impact across the continent.",
    href: "/awards/pillars/csr-for-education",
  },
  {
    icon: Globe2,
    title: "Diaspora African Contributors",
    body: "Africans abroad whose funding, mentorship, advocacy and partnerships strengthen education back home.",
    href: "/awards/pillars/diaspora-champions",
  },
  {
    icon: Cpu,
    title: "EdTech & STEM Innovation",
    body: "Innovators, researchers, TVET institutions and STEM pioneers transforming how Africa learns.",
    href: "/awards/pillars/edtech-stem",
  },
  {
    icon: Coins,
    title: "Institutional & Bilateral Grants",
    body: "Bilateral agencies, multilateral organisations and grant-makers funding sustainable education systems.",
    href: "/awards/pillars/education-funding",
  },
  {
    icon: BookOpen,
    title: "Faith-Based & Religious Organisations",
    body: "Christian, Islamic and other faith-based organisations advancing education, scholarships and inclusion.",
    href: "/awards/pillars/faith-based-education",
  },
  {
    icon: Landmark,
    title: "Institutional Excellence in Education",
    body: "Governments, ministries, universities, research institutes, NGOs and public institutions strengthening systems.",
    href: "/awards/pillars/continental-recognition",
  },
  {
    icon: Megaphone,
    title: "Social Media Education Champions",
    body: "Sports, music and digital creators using their influence to inspire learning and advance Education for All.",
    href: "/awards/pillars/social-media-champions",
  },
];

export function WhoWeHonourSection() {
  return (
    <section className="relative py-20 md:py-28 bg-charcoal-light/10" aria-labelledby="who-we-honour-heading">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            id="who-we-honour-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Who Does <span className="text-gold">NESA-Africa</span> Recognise?
          </h2>
          <p className="text-white/75 text-base md:text-lg">
            NESA-Africa recognises the enablers of Education for All — the individuals, organisations,
            institutions and partnerships creating lasting educational impact across Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <Link
                  to={card.href}
                  onClick={() =>
                    trackEvent("home_cta_click", {
                      cta: "honour_card",
                      label: card.title,
                      to: card.href,
                      section: "who_we_honour",
                    })
                  }
                  className="group block h-full rounded-2xl border border-gold/20 bg-charcoal/60 p-6 hover:border-gold/60 hover:bg-charcoal/80 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-gold transition">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{card.body}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/awards/pillars"
            onClick={() =>
              trackEvent("home_cta_click", {
                cta: "find_recognition_path",
                to: "/awards/pillars",
                section: "who_we_honour",
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-charcoal font-bold hover:bg-gold-dark transition"
          >
            Find Your Recognition Path
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhoWeHonourSection;
