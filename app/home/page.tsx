import HeroSection from "@/components/HeroSection";
import AboutMeSection from "@/components/AboutMeSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity/ScrollVelocity";
export default function Hero() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <HeroSection />
      <ScrollVelocity
        texts={["About Me", "About Me"]}
        scrollerClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#C6F10E]"
        velocity={10}
        className="custom-scroll-text"
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AboutMeSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}
