import { NavLink, useLocation } from "react-router-dom";
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
  CheckSquare,
  Plus,
  Zap,
  ScrollText,
  User,
  Home,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Task List",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Create Task",
    url: "/create-task",
    icon: Plus,
  },
  {
    title: "Run AI",
    url: "/run-ai",
    icon: Zap,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: ScrollText,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path)
      ? "bg-accent text-accent-foreground font-medium shadow-card"
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-smooth";
  };

  return (
    <Sidebar className="border-r bg-card/50 backdrop-blur-sm">
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${getNavClassName(
                        item.url
                      )}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {state === "expanded" && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
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
}