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
    { title: "Dashboard", url: "/admin", icon: LayoutDashboardIcon },
    {
      title: "Master Data",
      icon: IconListDetails,
      items: [
        {
          title: "Properties",
          url: "/admin/properties",
          icon: IconListDetails,
        },
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
    { title: "Get Help", url: "/admin/help", icon: HelpCircleIcon },
    { title: "Search", url: "/admin/search", icon: SearchIcon },
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
              <a href="/admin">
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
