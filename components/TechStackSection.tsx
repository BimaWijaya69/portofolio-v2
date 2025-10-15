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
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiDart,
  SiFlutter,
  SiBootstrap,
} from "react-icons/si";
import ScrollFloat from "./reactbits/ScrollFloat/ScrollFloat";

const techLogos = [
  {
    node: (
      <SiReact className="text-[#61DBFB] hover:scale-110 transition-transform duration-300" />
    ),
    title: "React",
    href: "https://react.dev",
  },
  {
    node: (
      <SiNextdotjs className="text-white hover:scale-110 transition-transform duration-300" />
    ),
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTypescript color="#3178C6" />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss color="#06B6D4" />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: (
      <SiLaravel className="text-[#FF2D20] hover:scale-110 transition-transform duration-300" />
    ),
    title: "Laravel",
    href: "https://laravel.com",
  },
  {
    node: (
      <SiPhp className="text-[#777BB4] hover:scale-110 transition-transform duration-300" />
    ),
    title: "PHP",
    href: "https://www.php.net",
  },
  {
    node: (
      <SiHtml5 className="text-[#E34F26] hover:scale-110 transition-transform duration-300" />
    ),
    title: "HTML5",
    href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  {
    node: (
      <SiCss3 className="text-[#1572B6] hover:scale-110 transition-transform duration-300" />
    ),
    title: "CSS3",
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  {
    node: (
      <SiJavascript className="text-[#F7DF1E] hover:scale-110 transition-transform duration-300" />
    ),
    title: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    node: (
      <SiFlutter className="text-[#02569B] hover:scale-110 transition-transform duration-300" />
    ),
    title: "Flutter",
    href: "https://flutter.dev",
  },
  {
    node: (
      <SiBootstrap className="text-[#7952B3] hover:scale-110 transition-transform duration-300" />
    ),
    title: "Bootstrap",
    href: "https://getbootstrap.com",
  },
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
