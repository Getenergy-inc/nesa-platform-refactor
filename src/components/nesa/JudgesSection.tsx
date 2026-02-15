import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Gavel, Users, Award, LayoutGrid, ShieldCheck } from "lucide-react";
import { GOVERNANCE_STATS } from "@/lib/regions";

export function JudgesSection() {
  const { t } = useTranslation("pages");

  const stats = [
    { value: String(GOVERNANCE_STATS.judges), label: t("judgesSection.stats.expertJudges"), icon: Users },
    { value: String(GOVERNANCE_STATS.categories), label: t("judgesSection.stats.categories"), icon: LayoutGrid },
    { value: String(GOVERNANCE_STATS.subcategories), label: t("judgesSection.stats.subCategories"), icon: Award },
    { value: "100%", label: t("judgesSection.stats.transparency"), icon: ShieldCheck },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Gavel className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">{t("judgesSection.badge")}</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("judgesSection.title")} <span className="text-gold">{t("judgesSection.titleHighlight")}</span>
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            {t("judgesSection.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-charcoal-light border border-gold/20 hover:border-gold/40 transition-colors"
            >
              <stat.icon className="h-6 w-6 text-gold mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-gold mb-1">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8"
          >
            <Link to="/judgeapply">{t("judgesSection.applyJudge")}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10 rounded-full px-8"
          >
            <Link to="/judge-status">{t("judgesSection.checkStatus")}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 rounded-full px-8"
          >
            <Link to="/judges">{t("judgesSection.learnMore")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
