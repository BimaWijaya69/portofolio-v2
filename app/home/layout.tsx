import type { Metadata } from "next";
import MorphingNav from "@/components/custom/MorphingNav";
import Footer from "@/components/FooterSection";
import { SiGithub, SiLinkedin, SiMinutemailer } from "react-icons/si";

export const metadata: Metadata = {
  title: "Home - Portfolio",
  description: "Welcome to my portfolio",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br  bg-black text-white">
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-40" />

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-40" />

      <MorphingNav />
      <main>{children}</main>
      <Footer
        ownerName="Bima Wijaya"
        spotifyEmbedUrl="https://open.spotify.com/embed/playlist/2yYF5jW9wylTDQaod1PmqW?theme=1"
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
