"use client";

import HeroSection from "@/components/HeroSection";
import AboutMeSection from "@/components/AboutMeSection";
import { TimelineDemo } from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity/ScrollVelocity";
import TechStackSection from "@/components/TechStackSection";
import Footer from "@/components/FooterSection";
import { SiGithub, SiLinkedin, SiMinutemailer } from "react-icons/si";

export default function HomePage() {
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

      <section id="about" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AboutMeSection />
      </section>

      <section id="tech" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TechStackSection />
      </section>

      <section
        id="experience"
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <TimelineDemo />
      </section>

      <section id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </section>
    </div>
  );
}
