import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Gavel,
  LayoutDashboard,
  Star,
  Shield,
  FileText,
  Users,
  Clock,
  LogOut,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react";

const ARENA_NAV = [
  {
    group: "Workspace",
    items: [
      { label: "Dashboard", href: "/judge/dashboard", icon: LayoutDashboard },
      { label: "Scoring Queue", href: "/judge/scoring", icon: Star },
      { label: "COI Declarations", href: "/judge/coi", icon: Shield },
    ],
  },
  {
    group: "Resources",
    items: [
      { label: "Scoring Rubric", href: "/judge/rubric", icon: FileText },
      { label: "Jury Guidelines", href: "/judge/guidelines", icon: BookOpen },
      { label: "Fellow Judges", href: "/judge/panel", icon: Users },
    ],
  },
  {
    group: "Support",
    items: [
      { label: "Help & FAQ", href: "/judge/help", icon: HelpCircle },
      { label: "Settings", href: "/judge/settings", icon: Settings },
    ],
  },
];

export function JudgesSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "JG";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} bg-charcoal border-r border-gold/20`}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-gold/20 p-4">
        <Link to="/judge/dashboard" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center flex-shrink-0">
            <Gavel className="h-5 w-5 text-charcoal" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm">Judges Arena</span>
              <span className="text-[10px] text-white/50 uppercase tracking-wider">NESA-Africa</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {ARENA_NAV.map((section) => (
          <SidebarGroup key={section.group}>
            {!collapsed && (
              <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-wider mb-2 px-3">
                {section.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        end={item.href === "/judge/dashboard"}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/5 ${
                          isActive(item.href)
                            ? "!bg-gold/20 !text-gold border-l-2 border-gold"
                            : ""
                        }`}
                        activeClassName="!bg-gold/20 !text-gold"
                      >
                        <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive(item.href) ? "text-gold" : ""}`} />
                        {!collapsed && <span className="text-sm">{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="border-t border-gold/20 p-4">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <Avatar className="h-9 w-9 border-2 border-gold/30">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gold/20 text-gold text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.user_metadata?.full_name || "Judge"}
              </p>
              <div className="flex items-center gap-1.5">
                <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px] px-1.5 py-0">
                  Jury
                </Badge>
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <Link
            to="/"
            className="mt-3 flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Exit Arena
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
