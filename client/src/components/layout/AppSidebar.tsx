import { NavLink } from "@/components/NavLink";
import { useRole } from "@/contexts/RoleContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home, Users, Swords, Inbox, BarChart3, User, ClipboardList,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface NavItem { title: string; url: string; icon: LucideIcon }

const TALENT_NAV: NavItem[] = [
  { title: "Pulpit",       url: "/",         icon: Home },
  { title: "Battle Tasks", url: "/tasks",    icon: Swords },
  { title: "Skrzynka",     url: "/inbox",    icon: Inbox },
  { title: "Moja karta",   url: "/profile",  icon: User },
];

const MENTOR_NAV: NavItem[] = [
  { title: "Pulpit",          url: "/",          icon: Home },
  { title: "Talenty",         url: "/talents",   icon: Users },
  { title: "Battle Tasks",    url: "/tasks",     icon: Swords },
  { title: "Zgłoszenia",      url: "/decisions", icon: ClipboardList },
  { title: "Ranking firm",    url: "/employers", icon: BarChart3 },
];

export const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role } = useRole();
  const items = role === "talent" ? TALENT_NAV : MENTOR_NAV;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "talent" ? "Talent" : "Mentor"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60 rounded-md"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
