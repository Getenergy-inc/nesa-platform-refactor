import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ChannelCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
  index: number;
}

export function ChannelCard({ icon: Icon, name, description, href, index }: ChannelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <Link to={href}>
        <div className="group flex items-center gap-4 rounded-xl border border-border/10 bg-secondary/60 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-secondary/80">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-semibold text-secondary-foreground transition-colors group-hover:text-primary">
              {name}
            </h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </Link>
    </motion.div>
  );
}
