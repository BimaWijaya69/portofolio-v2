import { useQuery } from "@tanstack/react-query";
import type { Experience } from "@/types/experiences";

async function fetchPublicExperiences(): Promise<Experience[]> {
  const response = await fetch("/api/experiences?published=true");
  if (!response.ok) throw new Error("Failed to load experiences");
  return response.json();
}

export function usePublicExperiences() {
  return useQuery({
    queryKey: ["public-experiences"],
    queryFn: fetchPublicExperiences,
  });
}
