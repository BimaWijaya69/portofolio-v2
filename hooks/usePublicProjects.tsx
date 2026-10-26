// hooks/usePublicProjects.tsx
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@/types/projects";

async function fetchPublicProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export function usePublicProjects() {
  return useQuery({
    queryKey: ["public-projects"],
    queryFn: fetchPublicProjects,
  });
}

export function usePublicProject(id: string) {
  return useQuery({
    queryKey: ["public-project", id],
    queryFn: async (): Promise<Project> => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Project tidak ditemukan");
      return res.json();
    },
    enabled: Boolean(id),
  });
}
