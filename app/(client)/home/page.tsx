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
import { usePublicProjects } from "@/hooks/usePublicProjects";
import { usePublicExperiences } from "@/hooks/usePublicExperiences";
import dynamic from "next/dynamic";

const Lanyard = dynamic(
  () => import("@/components/reactbits/Lanyard/Lanyard"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function HomePage() {
  const { data: projects = [], isLoading } = usePublicProjects();
  const { data: experiences = [] } = usePublicExperiences();

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <section id="home">
        <HeroSection />
      </section>

      <div className="relative">
        <div className="w-full">
          <ScrollVelocity
            texts={["About Me", "About Me"]}
            scrollerClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-full font-bold text-[#C6F10E]"
            velocity={10}
            numCopies={20}
            className="custom-scroll-text"
          />
        </div>

        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 left-0 z-10 hidden lg:block lg:w-1/2">
            <Lanyard
              className="pointer-events-auto"
              position={[0, 0, 17]}
              gravity={[0, -35, 0]}
              fov={24}
              verticalOffset={0.5}
            />
          </div>
          <AboutMeSection />
        </section>
      </div>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TechStackSection />
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TimelineDemo experiences={experiences} />
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </section>
    </div>
  );
}
