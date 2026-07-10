"use client";

import * as React from "react";
import {
  LayoutDashboardIcon,
  HelpCircleIcon,
  SettingsIcon,
  SearchIcon,
  ArrowUpCircleIcon,
} from "lucide-react";
import { IconListDetails } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navData = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    {
      title: "Master Data",
      icon: IconListDetails,
      items: [
        {
          title: "Projects",
          url: "/dashboard",
          icon: IconListDetails,
        },
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "/dashboard", icon: SettingsIcon },
    { title: "Get Help", url: "/dashboard", icon: HelpCircleIcon },
    { title: "Search", url: "/dashboard", icon: SearchIcon },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
