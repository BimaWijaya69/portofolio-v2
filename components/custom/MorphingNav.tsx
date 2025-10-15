"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/home" },
  { id: "project", label: "Project", href: "/project" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function MorphingNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Determine active item based on current pathname
  const getActiveItem = () => {
    const currentItem = navItems.find((item) => pathname.startsWith(item.href));
    return currentItem?.id || "home";
  };

  const activeItem = getActiveItem();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ease-out">
      <div
        className={`mx-auto transition-all duration-500 ease-out ${
          scrolled ? "max-w-md" : "max-w-full"
        }`}
      >
        <div
          className={`transition-all duration-500 ease-out ${
            scrolled
              ? "backdrop-blur-3xl bg-black/20 border border-white/10 shadow-xl rounded-full px-6 py-2"
              : "bg-transparent border border-transparent"
          }`}
        >
          <div className="flex items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`relative flex items-center gap-2 py-1.5 font-medium text-sm transition-all duration-300 ${
                  activeItem === item.id
                    ? "text-white"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                {activeItem === item.id && (
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-[#C6F10E]"></span>

                    <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-[#C6F10E] animate-ping"></span>
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
