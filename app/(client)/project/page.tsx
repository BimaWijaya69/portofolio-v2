"use client";

import React from "react";
import { ProjectCard } from "@/components/custom/ProjectCard"; // pastikan path sesuai
import ContactSection from "@/components/ContactSection";
import ShinyText from "@/components/ShinyText";

const projects = [
  {
    title: "MoviesForDevs",
    status: "Deployed",
    imageUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1470&auto=format&fit=crop",
    hrefDemo: "https://movies-for-devs.vercel.app",
    hrefCode: "https://github.com/your/moviesfordevs",
  },
  {
    title: "StockIn",
    status: "On Development",
    imageUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1470&auto=format&fit=crop",
    hrefDemo: "https://movies-for-devs.vercel.app",
    hrefCode: "https://github.com/your/moviesfordevs",
  },
  {
    title: "Next Blog",
    status: "Deployed",
    imageUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1470&auto=format&fit=crop",
    hrefDemo: "https://movies-for-devs.vercel.app",
    hrefCode: "https://github.com/your/moviesfordevs",
  },
];

export default function ProjectPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      {/* Projects section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
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
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </section>

      {/* Contact section - TIDAK DIUBAH */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </section>
    </div>
  );
}
