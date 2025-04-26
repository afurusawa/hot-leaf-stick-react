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

import { NavUser } from "./nav-user"
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
    title: "Dashboard",
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
    title: "Top Rated",
    url: "#",
    icon: Trophy,
  },
  {
    title: "Recommendations",
    url: "#",
    icon: Heart,
  },
  {
    title: "Discover",
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
              <a href="/">
                <Cigarette className="h-5 w-5" />
                <span className="text-base font-semibold">HOT LEAF STICK</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <NavMain items={navMain} />

      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Community
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {navCommunity.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
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
              Admin
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {navAdmin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
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
