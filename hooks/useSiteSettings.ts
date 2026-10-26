"use client";

import { useQuery } from "@tanstack/react-query";

export type SiteSettings = {
  id: string;
  linkedin_url: string;
  github_url: string;
  email: string;
  cv_url: string | null;
  hero_greeting: string;
  hero_title: string;
  hero_description: string;
  about_text: string;
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Gagal memuat pengaturan");
      return response.json();
    },
  });
}
