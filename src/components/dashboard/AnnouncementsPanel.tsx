/**
 * Announcements + Quick Links panel for the dashboard
 */

import { Megaphone, ExternalLink, Calendar, Star, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const announcements = [
  {
    id: 1,
    title: "Platinum Nominations Now Open",
    date: "March 2026",
    highlight: true,
  },
  {
    id: 2,
    title: "NESA Africa Gala — June 27, 2026",
    date: "Save the Date",
    highlight: false,
  },
  {
    id: 3,
    title: "New: Gold Special Recognition 2025",
    date: "Sports, Music & Social Media",
    highlight: false,
  },
];

const quickLinks = [
  { label: "Apply as Judge", href: "/judgeapply", icon: Star },
  { label: "Buy Gala Tickets", href: "/buy-your-ticket", icon: Calendar },
  { label: "View Regions", href: "/regions", icon: Globe },
  { label: "Shop Merchandise", href: "/shop", icon: ExternalLink },
];

export function AnnouncementsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Announcements */}
      <div className="rounded-xl border border-white/5 bg-[hsl(30_8%_8%)] p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-4">
          <Megaphone className="h-4 w-4 text-gold" />
          Announcements
        </h3>
        <div className="space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`rounded-lg border p-3 ${
                item.highlight
                  ? "border-gold/20 bg-gold/5"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <p className="text-sm text-white/80 font-medium">{item.title}</p>
              <p className="text-xs text-white/40 mt-0.5">{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border border-white/5 bg-[hsl(30_8%_8%)] p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm text-white/60 hover:text-gold hover:border-gold/20 hover:bg-gold/5 transition-all"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
