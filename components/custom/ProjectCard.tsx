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
        "group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 shadow-xl ring-1 ring-inset ring-white/5 backdrop-blur",
        "hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-2xl",
        hrefDetail && "cursor-pointer",
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
              onClick={(event) => event.stopPropagation()}
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
              onClick={(event) => event.stopPropagation()}
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          {hrefDetail ? (
            <Link href={hrefDetail} onClick={(event) => event.stopPropagation()} className="text-lg font-semibold tracking-tight text-white hover:text-[#C6F10E]">
              {title}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
          )}
          {status && (
            <p className="mt-0.5 text-xs font-medium text-zinc-400">{status}</p>
          )}
        </div>

        {hrefDetail && (
          <Link
            href={hrefDetail}
            onClick={(event) => event.stopPropagation()}
            className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[#C6F10E] transition-colors hover:text-white"
          >
            View case study <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Focus ring for keyboard users */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-inset focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" />
    </motion.article>
  );
}
