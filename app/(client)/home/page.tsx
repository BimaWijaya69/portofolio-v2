"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import AboutMeSection from "@/components/AboutMeSection";
import { TimelineDemo } from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity/ScrollVelocity";
import TechStackSection from "@/components/TechStackSection";
import { ProjectCard } from "@/components/custom/ProjectCard";

type ApiProject = {
  id: string;
  name: string;
  image_url: string[];
  file_url: string;
};

export default function HomePage() {
  const [projects, setProjects] = useState<ApiProject[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) return;
        const data: ApiProject[] = await res.json();
        setProjects(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <section id="home">
        <HeroSection />
      </section>

      <div className="w-full">
        <ScrollVelocity
          texts={["About Me", "About Me"]}
          scrollerClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-full font-bold text-[#C6F10E]"
          velocity={10}
          numCopies={20}
          className="custom-scroll-text"
        />
      </div>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AboutMeSection />
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TechStackSection />
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TimelineDemo />
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold">Latest Projects</h2>
          <Link
            href="/project"
            className="text-sm font-medium text-lime-400 hover:text-lime-300"
          >
            See all
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-zinc-400">Belum ada project untuk ditampilkan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        )}
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </section>
    </div>
  );
}
