"use client";
import { Lexend } from "next/font/google";
import PillNavAnimatedButton from "./reactbits/AnimatedButton/AnimatedButton";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const headingFont = Lexend({
  subsets: ["latin"],
  weight: ["500", "600"],
});

function WaveHandIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function HeroSection() {
  const { data: settings } = useSiteSettings();
  const emailHref = settings
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        settings.email,
      )}`
    : "#";
  const socials = settings
    ? [
        { label: "LinkedIn", href: settings.linkedin_url },
        { label: "GitHub", href: settings.github_url },
        { label: "Email", href: emailHref },
      ]
    : [];
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden  px-6 pb-8 pt-28 font-sans text-white sm:px-10 lg:px-16 lg:pb-12 lg:pt-32"
    >
      {/* Lanyard: Area diletakkan di setengah layar bagian kanan */}

      {/* Animasi tangan melambai */}
      <style>{`
        @keyframes wave-hand {
          0%, 60%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(16deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(16deg); }
          40% { transform: rotate(-6deg); }
          50% { transform: rotate(10deg); }
        }
        .wave-hand {
          transform-origin: 70% 80%;
          animation: wave-hand 2.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .wave-hand { animation: none; }
        }
      `}</style>
      {/* Area tengah */}
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center">
        {/* Sapaan */}
        <div className="pointer-events-auto flex items-center gap-2.5 text-sm sm:text-base">
          <WaveHandIcon className="wave-hand h-6 w-6 -rotate-12 text-[#a3e635]" />
          <span>{settings?.hero_greeting || "Hi there, Bima Here"}</span>
        </div>

        {/* Headline */}
        <h1
          className={`${headingFont.className} pointer-events-auto mt-6 text-[clamp(2.25rem,5.8vw,5.5rem)] font-semibold leading-[1.08] tracking-tight lg:mt-8`}
        >
          {settings?.hero_title ||
            "Building scalable digital solutions that empower & connect."}
        </h1>

        {/* Sub-headline + garis */}
        <div className="mt-10 flex items-center gap-6 lg:mt-16 lg:gap-8">
          <div className="hidden h-px flex-1 bg-white/10 md:block" />
          <p className="pointer-events-auto w-full text-sm leading-relaxed text-gray-400 sm:text-base md:w-[47%] md:shrink-0">
            {settings?.hero_description ||
              "I partner with forward-thinking companies to design and develop intuitive, high-performance web applications that turn complex problems into elegant user experiences."}
          </p>
        </div>
      </div>
      {/* Footer hero */}
      <div className="pointer-events-none relative z-10 mx-auto mt-16 flex w-full max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <ul className="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-3 lg:gap-x-10">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-xs font-normal uppercase tracking-wide text-gray-300 transition-colors duration-200 hover:text-white sm:text-sm"
              >
                {s.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>

        <div className="pointer-events-auto inline-flex self-start rounded-full sm:self-auto">
          <PillNavAnimatedButton
            label="My Resume"
            href={settings?.cv_url ? "/api/cv" : "#"}
            openInNewTab
            baseColor="#a3e635"
            pillColor="#060010"
            ease="power1.easeOut"
            initialLoadAnimation={false}
            hoveredPillTextColor="#060010"
          />
        </div>
      </div>
    </section>
  );
}
