import type { IconType } from "react-icons";
import {
  SiBootstrap,
  SiCss3,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";

export type TechStackOption = {
  name: string;
  icon: IconType;
  color: string;
};

export const TECH_STACK_OPTIONS: TechStackOption[] = [
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express.js", icon: SiExpress, color: "#ffffff" },
  { name: "Prisma", icon: SiPrisma, color: "#ffffff" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "PHP", icon: SiPhp, color: "#777BB4" },
  { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
  { name: "Flutter", icon: SiFlutter, color: "#54C5F8" },
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", icon: SiCss3, color: "#1572B6" },
  { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GitHub", icon: SiGithub, color: "#ffffff" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
];

export function getTechStackOption(name: string) {
  const normalizedName = name
    .toLowerCase()
    .replace(/[.\s_-]/g, "")
    .replace("js", "javascript");

  return TECH_STACK_OPTIONS.find((option) => {
    const normalizedOptionName = option.name
      .toLowerCase()
      .replace(/[.\s_-]/g, "")
      .replace("js", "javascript");

    return (
      normalizedOptionName === normalizedName ||
      (normalizedName === "nextjavascript" && option.name === "Next.js") ||
      (normalizedName === "reactjavascript" && option.name === "React") ||
      (normalizedName === "tailwind" && option.name === "Tailwind CSS") ||
      (normalizedName === "tailwindcss" && option.name === "Tailwind CSS") ||
      (normalizedName === "postgres" && option.name === "PostgreSQL") ||
      (normalizedName === "vue" && option.name === "Vue.js")
    );
  });
}
