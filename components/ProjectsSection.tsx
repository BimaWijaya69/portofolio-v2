interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  liveDemoLink: string;
  githubLink: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Maintenance",
    description: "500 Internal Server Error.",
    tech: ["React", "Tailwind"],
    liveDemoLink: "#",
    githubLink: "#",
  },
  {
    id: 2,
    title: "Maintenance",
    description: "500 Internal Server Error.",
    tech: ["Next.js", "Tailwind"],
    liveDemoLink: "#",
    githubLink: "#",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20">
      <h2 className="text-4xl sm:text-5xl font-bold mb-10 text-center">
        My Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="h-48 w-full bg-gray-700 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
            <p className="text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((techItem, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-600 rounded"
                >
                  {techItem}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <a
                href={project.liveDemoLink}
                className="bg-[#C6F10E] text-black px-4 py-2 rounded"
              >
                Live Demo
              </a>
              <a
                href={project.githubLink}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
