import {
  Brain,
  ChevronDown,
  Cigarette,
  Heart,
  HelpCircleIcon,
  LayoutDashboardIcon,
  List,
  SettingsIcon,
  ShoppingBag,
  Trophy,
} from "lucide-react";
import { Link } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import { NavMain } from "./nav-main";


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
};

const navMain = [
  {
    title: "Dashboard (WIP)",
    url: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Collection",
    url: "/collection/",
    icon: List,
  },
  {
    title: "Palate (WIP)",
    url: "#",
    icon: Brain,
  },
];

const navCommunity = [
  {
    title: "Top Rated (WIP)",
    url: "#",
    icon: Trophy,
  },
  {
    title: "Recommendations (WIP)",
    url: "#",
    icon: Heart,
  },
  {
    title: "Discover (WIP)",
    url: "#",
    icon: ShoppingBag,
  },
]

const navAdmin = [
  {
    title: "Brands",
    url: "/admin/brands",
    icon: List
  },
  {
    title: "Cigars",
    url: "/admin/cigars/manage",
    icon: List
  }
]

const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: SettingsIcon,
  },
  {
    title: "Rating Philosophy",
    url: "#",
    icon: HelpCircleIcon,
  },
  {
    title: "About",
    url: "#",
    icon: HelpCircleIcon,
  },
];



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <Cigarette className="animate-glow h-8 w-8 mr-2" />
                <Link to="/">
                  <span className="font-mono text-2xl tracking-wide">HOT LEAF STICK</span>
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <NavMain items={navMain} />

      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              <span className="font-sans uppercase">Community</span>
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {navCommunity.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span className="font-mono text-xl text-md tracking-wide">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>

      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              <span className="font-sans uppercase tracking-wide">Admin</span>
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {navAdmin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span className="font-mono text-xl text-md tracking-wide">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>

      <NavSecondary items={navSecondary} className="mt-auto" />

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar >
  )
}
