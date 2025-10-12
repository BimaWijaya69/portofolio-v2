import LogoLoop from "./reactbits/LogoLoop/LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiLaravel,
  SiVsco,
  SiVscodium,
  SiPhp,
} from "react-icons/si";
import ScrollFloat from "./reactbits/ScrollFloat/ScrollFloat";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  { node: <SiLaravel />, title: "Laravel", href: "https://laravel.com" },
  { node: <SiPhp />, title: "PHP", href: "" },
];

// Alternative with image sources
const imageLogos = [
  {
    src: "/logos/company1.png",
    alt: "Company 1",
    href: "https://company1.com",
  },
  {
    src: "/logos/company2.png",
    alt: "Company 2",
    href: "https://company2.com",
  },
  {
    src: "/logos/company3.png",
    alt: "Company 3",
    href: "https://company3.com",
  },
];

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20">
      <ScrollFloat
        animationDuration={1}
        textClassName="text-4xl sm:text-5xl font-bold mb-10"
        ease="back.inOut(2)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        containerClassName="text-center"
        stagger={0.03}
      >
        Technology Stack
      </ScrollFloat>
      <div
        style={{ height: "200px", position: "relative", overflow: "hidden" }}
      >
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={40}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#000000"
          ariaLabel="Technology partners"
        />
      </div>
    </section>
  );
}
