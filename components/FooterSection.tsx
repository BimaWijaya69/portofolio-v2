"use client";

import Link from "next/link";
import React from "react";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiVercel,
  SiGithub,
  SiLinkedin,
  SiMinutemailer,
} from "react-icons/si";

type Social = { label: string; href: string; icon?: React.ReactNode };

export interface FooterProps {
  socials?: Social[];
  likes?: number;
  builtWith?: string;
  styledWith?: string;
  deployedOn?: string;
  spotifyEmbedUrl?: string;
  spotifyHeightMobile?: number;
  spotifyHeightDesktop?: number;
  ownerName?: string;
  className?: string;
}

function withTheme(url: string | undefined, theme: "0" | "1" = "1") {
  const safe = url || "";
  try {
    const u = new URL(safe);
    u.searchParams.set("theme", theme);
    return u.toString();
  } catch {
    const hasQuery = safe.includes("?");
    if (safe.includes("theme="))
      return safe.replace(/theme=\d/, `theme=${theme}`);
    return `${safe}${hasQuery ? "&" : "?"}theme=${theme}`;
  }
}

const Footer: React.FC<FooterProps> = ({
  socials = [
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
  ],
  likes = 2299,
  builtWith = "Next.js",
  styledWith = "TailwindCSS",
  deployedOn = "Vercel",
  spotifyEmbedUrl = "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
  spotifyHeightMobile = 152,
  spotifyHeightDesktop = 232,
  ownerName = "Bima Wijaya",
  className,
}) => {
  const year = new Date().getFullYear();
  const embedUrl = withTheme(spotifyEmbedUrl, "1");
  const badgeRowBase =
    "flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors text-sm";
  const badgeIconClass = "h-5 w-5 text-neutral-200";

  return (
    <footer
      className={`w-full border-t border-white/10 text-neutral-300 ${
        className || ""
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-12 items-start">
          {/* LEFT */}
          <div className="lg:col-span-4 flex flex-col gap-6 items-center lg:items-start">
            {/* socials */}
            <div className="flex items-center justify-center gap-4">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition"
                  aria-label={s.label}
                >
                  {s.icon}
                </Link>
              ))}
            </div>

            {/* likes */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-neutral-200/90 hover:bg-white/5 active:scale-[.99] transition w-full sm:w-64 lg:w-auto"
              aria-label={`${likes} likes`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              <span className="tabular-nums">{likes} Likes</span>
            </button>
          </div>

          {/* CENTER */}
          <div className="lg:col-span-4 flex justify-center">
            {/* 🔸 Mobile: horizontal 🔸 */}
            <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-2 lg:hidden">
              <div className={badgeRowBase}>
                <SiNextdotjs className={badgeIconClass} />
                <span>
                  Built with{" "}
                  <span className="text-neutral-200">{builtWith}</span>
                </span>
              </div>
              <div className={badgeRowBase}>
                <SiTailwindcss className={badgeIconClass} />
                <span>
                  Styled with{" "}
                  <span className="text-neutral-200">{styledWith}</span>
                </span>
              </div>
              <div className={badgeRowBase}>
                <SiVercel className={badgeIconClass} />
                <span>
                  Deployed on{" "}
                  <span className="text-neutral-200">{deployedOn}</span>
                </span>
              </div>
            </div>

            {/* 🔸 Desktop: vertical 🔸 */}
            <div className="hidden lg:flex flex-col gap-3 text-center lg:text-left">
              <div className={badgeRowBase}>
                <SiNextdotjs className={badgeIconClass} />
                <span>
                  Built with{" "}
                  <span className="text-neutral-200">{builtWith}</span>
                </span>
              </div>
              <div className={badgeRowBase}>
                <SiTailwindcss className={badgeIconClass} />
                <span>
                  Styled with{" "}
                  <span className="text-neutral-200">{styledWith}</span>
                </span>
              </div>
              <div className={badgeRowBase}>
                <SiVercel className={badgeIconClass} />
                <span>
                  Deployed on{" "}
                  <span className="text-neutral-200">{deployedOn}</span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT (Spotify) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-[280px] sm:max-w-[320px]">
              <div className="rounded-xl ring-1 ring-white/10 overflow-visible">
                <iframe
                  title="Spotify"
                  src={embedUrl}
                  width="100%"
                  height={spotifyHeightMobile}
                  style={{ border: 0, borderRadius: 12 }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="bg-black/40 block lg:hidden"
                />
                <iframe
                  title="Spotify"
                  src={embedUrl}
                  width="100%"
                  height={spotifyHeightDesktop}
                  style={{ border: 0, borderRadius: 12 }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="bg-black/40 hidden lg:block"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10" />
        <div className="py-6 text-center text-neutral-500">
          © {year} {ownerName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
