import { Award, Vote, Users, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion } from "framer-motion";

export function NominationPathSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();

  const nominationPaths = [
    {
      icon: Award,
      badge: t("landing.nominationPath.paths.icon.badge"),
      title: t("landing.nominationPath.paths.icon.title"),
      period: `2005–${currentEdition.displayYear}`,
      description: t("landing.nominationPath.paths.icon.description"),
      bullets: t("landing.nominationPath.paths.icon.bullets", { returnObjects: true }) as string[],
    },
    {
      icon: Vote,
      badge: t("landing.nominationPath.paths.blueGarnetGold.badge"),
      title: t("landing.nominationPath.paths.blueGarnetGold.title"),
      period: t("landing.nominationPath.annualCompetition"),
      description: t("landing.nominationPath.paths.blueGarnetGold.description"),
      bullets: t("landing.nominationPath.paths.blueGarnetGold.bullets", { returnObjects: true }) as string[],
    },
    {
      icon: Users,
      badge: t("landing.nominationPath.paths.platinum.badge"),
      title: t("landing.nominationPath.paths.platinum.title"),
      period: t("landing.nominationPath.meritBased"),
      description: t("landing.nominationPath.paths.platinum.description"),
      bullets: t("landing.nominationPath.paths.platinum.bullets", { returnObjects: true }) as string[],
    },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            {t("landing.nominationPath.sectionBadge")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            {t("landing.nominationPath.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("landing.nominationPath.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {nominationPaths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-gold/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <path.icon className="h-6 w-6 text-gold" />
                </div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                  {path.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gold transition-colors">{path.title}</h3>
              <p className="text-gold/80 text-sm mb-3">{path.period}</p>
              <p className="text-white/70 text-sm mb-4">{path.description}</p>

              <ul className="space-y-2 mb-6">
                {path.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="h-4 w-4 text-gold flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <Link to="/nominate">
                <Button className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full shadow-lg transition-all duration-300 group-hover:shadow-gold/20">
                  {t("landing.nominationPath.nominateNow")}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
