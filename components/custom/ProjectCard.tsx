"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ----------------------------------------------------
// ProjectCard — portfolio project card with image, status,
// hover actions, smooth transitions, and accessible markup.
// TailwindCSS + Framer Motion + Lucide icons
// ----------------------------------------------------

export type Project = {
  title: string;
  status?: "Deployed" | "On Development" | string;
  imageUrl: string;
  hrefDemo?: string;
  hrefCode?: string;
  hrefDetail?: string;
};

interface ProjectCardProps extends Project {
  className?: string;
}

const spring = { type: "spring", stiffness: 400, damping: 30 } as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProjectCard({
  title,
  status = "",
  imageUrl,
  hrefDemo,
  hrefCode,
  hrefDetail,
  className,
}: ProjectCardProps) {
  const router = useRouter();

  const openDetail = () => {
    if (hrefDetail) router.push(hrefDetail);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!hrefDetail || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openDetail();
  };

  return (
    <motion.article
      layout
      transition={spring}
      role={hrefDetail ? "link" : undefined}
      tabIndex={hrefDetail ? 0 : undefined}
      onClick={hrefDetail ? openDetail : undefined}
      onKeyDown={hrefDetail ? handleKeyDown : undefined}
      className={cn(
        "group relative overflow-hidden rounded-[14px] bg-[#1e1e1e] p-6",
        hrefDetail && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F10E]/60",
        className
      )}
    >
      {/* Preview */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[7px] bg-[#0d1014]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Floating action buttons */}
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          {hrefDetail ? (
            <Link href={hrefDetail} onClick={(event) => event.stopPropagation()} className="text-xl font-semibold tracking-tight text-[#f0eafa]">
              {title}
            </Link>
          ) : (
            <h3 className="text-xl font-semibold tracking-tight text-[#f0eafa]">{title}</h3>
          )}
          {status && (
            <p className="mt-1 text-sm font-medium text-[#b8a9d8]">{status}</p>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          {hrefCode && (
            <a
              href={hrefCode}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition-transform hover:scale-105"
              aria-label={`Open source code of ${title}`}
              onClick={(event) => event.stopPropagation()}
            >
              <Code2 className="h-5 w-5" />
            </a>
          )}
          {hrefDemo && (
            <a
              href={hrefDemo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition-transform hover:scale-105"
              aria-label={`Open live demo of ${title}`}
              onClick={(event) => event.stopPropagation()}
            >
              <ArrowUpRight className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

    </motion.article>
  );
}
