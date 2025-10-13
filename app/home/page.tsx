import HeroSection from "@/components/HeroSection";
import AboutMeSection from "@/components/AboutMeSection";
import { TimelineDemo } from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity/ScrollVelocity";
import TechStackSection from "@/components/TechStackSection";
// pastikan nama file/ekspor sesuai: FooterSection.tsx mengekspor default Footer
import Footer from "@/components/FooterSection";
import { SiGithub, SiLinkedin, SiMinutemailer } from "react-icons/si";

export default function Hero() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <HeroSection />

      <div className="w-full">
        <ScrollVelocity
          texts={["About Me", "About Me"]}
          scrollerClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#C6F10E]"
          velocity={10}
          className="custom-scroll-text"
        />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AboutMeSection />
      </main>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TechStackSection />
      </main>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TimelineDemo />
      </main>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        ownerName="Bima Wijaya"
        spotifyEmbedUrl="https://open.spotify.com/embed/playlist/2yYF5jW9wylTDQaod1PmqW?utm_source=generator"
        spotifyHeightMobile={152}
        spotifyHeightDesktop={152}
        socials={[
          {
            label: "GitHub",
            href: "https://github.com/BimaWijaya69",
            icon: <SiGithub className="h-5 w-5" />,
          },
          {
            label: "LinkedIn",
            href: "https://linkedin.com/in/bima-wijaya",
            icon: <SiLinkedin className="h-5 w-5" />,
          },
          {
            label: "Email",
            href: "mailto:bima@example.com",
            icon: <SiMinutemailer className="h-5 w-5" />,
          },
        ]}
      />
    </div>
  );
}
