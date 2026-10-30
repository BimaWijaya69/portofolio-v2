// app/(client)/project/page.tsx
"use client";

import { usePublicProjects } from "@/hooks/usePublicProjects";
import { ProjectCard } from "@/components/custom/ProjectCard";
import ContactSection from "@/components/ContactSection";
import ShinyText from "@/components/ShinyText";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectCardSkeleton() {
  return (
    <div className="rounded-[14px] bg-[#1e1e1e] p-6" aria-hidden="true">
      <Skeleton className="aspect-[16/9] w-full rounded-[7px] bg-white/[0.08]" />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36 rounded-md bg-white/[0.08]" />
          <Skeleton className="h-4 w-24 rounded-md bg-white/[0.06]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-11 w-11 rounded-xl bg-white/[0.08]" />
          <Skeleton className="h-11 w-11 rounded-xl bg-white/[0.08]" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const { data: projects = [], isLoading, isError } = usePublicProjects();

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6 lg:pt-28">
        <header className="mb-8">
          <ShinyText
            text="MY WORK"
            disabled={false}
            speed={20}
            className="text-sm"
          />
          <h1 className="mt-1 text-4xl font-medium tracking-tight text-[#e7e1f4] sm:text-5xl">
            Projects
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2">
          {isLoading &&
            Array.from({ length: 4 }, (_, index) => (
              <ProjectCardSkeleton key={`project-skeleton-${index}`} />
            ))}
          {isError && <p className="text-red-400">Gagal memuat projects.</p>}

          {!isLoading && projects.length === 0 && (
            <p className="text-zinc-400">Belum ada project yang dipublish.</p>
          )}

          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              title={p.title}
              status={p.isFeatured ? "Featured project" : "Published"}
              imageUrl={
                p.banner_url ||
                p.image_url?.[0] ||
                "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1470&auto=format&fit=crop"
              }
              hrefDemo={p.project_url || undefined}
              hrefDetail={`/project/${p.id}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </section>
    </div>
  );
}
