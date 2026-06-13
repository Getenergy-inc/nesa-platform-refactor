import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  BarChart3,
  Scale,
  FileText,
  Bell,
  Search,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/judges-arena", icon: LayoutDashboard, end: true },
  { title: "My Assignments", url: "/judges-arena/nominees", icon: Users, badge: "12" },
  { title: "Discussion Arena", url: "/judges-arena/discussion", icon: MessageSquare, badge: "3" },
  { title: "Scoring Rubrics", url: "/judges-arena/rubric", icon: Scale },
  { title: "Calendar & Deadlines", url: "/judges-arena/calendar", icon: Calendar },
  { title: "Reports & Analytics", url: "/judges-arena/reports", icon: BarChart3 },
  { title: "Resources", url: "/judges-arena/resources", icon: BookOpen },
  { title: "Guidelines", url: "/judges-arena/guidelines", icon: FileText },
];

function ArenaSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-gold/20 bg-charcoal">
      <SidebarContent>
        <div className="px-4 py-5 border-b border-gold/15">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gold/15 grid place-items-center">
              <ShieldCheck className="h-4 w-4 text-gold" />
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold text-gold leading-tight">Judges Arena</div>
                <div className="text-[10px] uppercase tracking-wider text-gold/60">Confidential</div>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gold/60">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  item.end ? pathname === item.url : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={
                        active
                          ? "border-l-2 border-gold bg-gold/10 text-gold hover:bg-gold/15"
                          : "text-white/70 hover:bg-white/5 hover:text-gold"
                      }
                    >
                      <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <span className="flex-1 flex items-center justify-between">
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant="outline"
                                className="ml-2 h-5 border-gold/40 text-gold text-[10px]"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function JudgesArenaLayout() {
  return (
    <SidebarProvider>
      <Helmet>
        <title>Judges Arena | NESA-Africa</title>
      </Helmet>
      <div className="min-h-screen flex w-full bg-charcoal text-white">
        <ArenaSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top utility bar */}
          <header className="h-14 border-b border-gold/15 bg-charcoal/95 backdrop-blur sticky top-0 z-30 flex items-center gap-3 px-3 sm:px-5">
            <SidebarTrigger className="text-gold" />
            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
              <Input
                placeholder="Search nominees, categories, regions…"
                className="pl-9 bg-white/5 border-gold/20 text-white placeholder:text-white/40 focus-visible:ring-gold/40"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-gold relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-gold" asChild>
                <NavLink to="/dashboard"><LogOut className="h-4 w-4" /></NavLink>
              </Button>
            </div>
          </header>

          {/* Watermark + content */}
          <main className="flex-1 relative overflow-x-hidden">
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 flex items-center justify-center select-none z-0"
            >
              <div className="text-gold/[0.03] font-black tracking-widest text-[120px] md:text-[180px] rotate-[-22deg] whitespace-nowrap">
                CONFIDENTIAL · JUDGES ARENA
              </div>
            </div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
