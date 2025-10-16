"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";

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
  className,
}: ProjectCardProps) {
  return (
    <motion.article
      layout
      transition={spring}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 shadow-xl ring-1 ring-inset ring-white/5 backdrop-blur",
        "hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-2xl",
        "focus-within:ring-2 focus-within:ring-violet-500",
        className
      )}
    >
      {/* Preview */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-95"
          loading="lazy"
        />

        {/* Floating action buttons */}
        <div
          className={
            "pointer-events-none absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          }
        >
          {hrefCode && (
            <a
              href={hrefCode}
              target="_blank"
              rel="noreferrer noopener"
              className="pointer-events-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900/80 p-2 backdrop-blur transition hover:border-white/20 hover:bg-zinc-800/80"
              aria-label={`Open source code of ${title}`}
            >
              <Code2 className="h-4 w-4" />
            </a>
          )}
          {hrefDemo && (
            <a
              href={hrefDemo}
              target="_blank"
              rel="noreferrer noopener"
              className="pointer-events-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900/80 p-2 backdrop-blur transition hover:border-white/20 hover:bg-zinc-800/80"
              aria-label={`Open live demo of ${title}`}
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {title}
          </h3>
          {status && (
            <p className="mt-0.5 text-xs font-medium text-zinc-400">{status}</p>
          )}
        </div>
      </div>

      {/* Focus ring for keyboard users */}
      <span className="absolute inset-0 rounded-2xl ring-inset focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" />
    </motion.article>
  );
}
