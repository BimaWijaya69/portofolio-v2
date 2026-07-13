// hooks/usePublicProjects.tsx
import { useQuery } from "@tanstack/react-query";

type ApiProject = {
  id: string;
  name: string;
  description: string;
  image_url: string[];
  file_url: string;
};

async function fetchPublicProjects(): Promise<ApiProject[]> {
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
