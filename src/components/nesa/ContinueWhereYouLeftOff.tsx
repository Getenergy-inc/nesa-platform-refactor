import { Link } from "react-router-dom";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { motion } from "framer-motion";

/**
 * ContinueWhereYouLeftOff - Shows recently viewed nominees
 * 
 * Displays for returning visitors who have view history.
 * Helps re-engage users with content they showed interest in.
 */
export function ContinueWhereYouLeftOff() {
  const { nominees, hasHistory, getMostRecent } = useRecentlyViewed();
  
  // Only show if user has viewed nominees before
  if (!hasHistory || nominees.length === 0) {
    return null;
  }

  const recentNominees = getMostRecent(4);

  return (
    <section className="bg-charcoal py-8 border-b border-gold/10">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" />
            <h3 className="text-white font-semibold">Continue Where You Left Off</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-gold/10 gap-1" asChild>
            <Link to="/nominees">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {recentNominees.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <Link to={`/nominees/${item.slug}`}>
                <div className="group flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/10 hover:border-gold/30 transition-all min-w-[200px]">
                  {/* Avatar or Initials */}
                  <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gold font-semibold text-sm">
                        {item.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate group-hover:text-gold transition-colors">
                      {item.name}
                    </p>
                    {item.subtitle && (
                      <p className="text-white/50 text-xs truncate">{item.subtitle}</p>
                    )}
                  </div>

                  <Eye className="h-4 w-4 text-white/30 group-hover:text-gold transition-colors flex-shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContinueWhereYouLeftOff;
