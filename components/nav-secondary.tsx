// components/nav-secondary.tsx
"use client";

import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type NavSecondaryItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

// 🔥 Tambahkan prop pathname
export function NavSecondary({
  items,
  className,
  pathname, // 🔥 Dapat dari props
}: {
  items: NavSecondaryItem[];
  className?: string;
  pathname: string;
}) {
  const isActive = (url: string) => pathname === url;

  return (
    <SidebarMenu className={className}>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            size="sm"
            isActive={isActive(item.url)}
            className={
              isActive(item.url)
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }
          >
            <Link href={item.url}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
