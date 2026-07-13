// app/(client)/project/page.tsx
"use client";

import { usePublicProjects } from "@/hooks/usePublicProjects";
import { ProjectCard } from "@/components/custom/ProjectCard";
import ContactSection from "@/components/ContactSection";
import ShinyText from "@/components/ShinyText";

export default function ProjectPage() {
  const { data: projects = [], isLoading, isError } = usePublicProjects();

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10 pt-8">
          <ShinyText
            text="MY PROJECT"
            disabled={false}
            speed={20}
            className="text-md"
          />
          <h3 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
            Projects
          </h3>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && <p className="text-zinc-400">Loading projects...</p>}
          {isError && <p className="text-red-400">Gagal memuat projects.</p>}

          {!isLoading && projects.length === 0 && (
            <p className="text-zinc-400">Belum ada project yang dipublish.</p>
          )}

          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              title={p.name}
              status="Published"
              imageUrl={
                p.image_url?.[0] ||
                "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1470&auto=format&fit=crop"
              }
              hrefDemo={p.file_url}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </section>
    </div>
  );
}
