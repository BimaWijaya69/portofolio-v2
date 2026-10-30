"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  Layers3,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ShinyText from "@/components/ShinyText";
import { usePublicProject } from "@/hooks/usePublicProjects";
import { ROLE_LABELS } from "@/types/projects";
import { getTechStackOption } from "@/lib/tech-stack";

function formatDate(value: Date | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ProjectDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-4 py-24 sm:px-6 lg:px-8">
      <div className="h-4 w-28 rounded bg-zinc-800" />
      <div className="h-12 max-w-2xl rounded bg-zinc-800" />
      <div className="aspect-[16/7] rounded-3xl bg-zinc-900" />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className="h-5 rounded bg-zinc-800" />
          <div className="h-24 rounded bg-zinc-900" />
        </div>
        <div className="h-48 rounded-2xl bg-zinc-900" />
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = usePublicProject(params.id);

  if (isLoading) return <ProjectDetailSkeleton />;
  if (isError || !project) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#C6F10E]">
          Project unavailable
        </p>
        <h1 className="text-3xl font-bold">Project tidak ditemukan</h1>
        <p className="mt-3 text-zinc-400">
          Project ini mungkin sudah dihapus atau belum dipublikasikan.
        </p>
        <Button
          asChild
          className="mt-8 rounded-full bg-[#C6F10E] text-black hover:bg-[#d7ff32]"
        >
          <Link href="/project">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke project
          </Link>
        </Button>
      </div>
    );
  }

  const heroImage = project.banner_url || project.image_url[0];
  const period = [formatDate(project.start_date), formatDate(project.end_date)]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Link
          href="/project"
          className="group inline-flex items-center text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
          All projects
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 w-full"
        >
          <ShinyText
            text="CASE STUDY"
            disabled={false}
            speed={20}
            className="text-sm tracking-[0.3em]"
          />
          <div className="mt-4 flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                {project.title}
              </h1>
            </div>
            {project.project_url && (
              <Button
                asChild
                className="self-end rounded-full bg-[#C6F10E] font-semibold text-black hover:bg-[#d7ff32] sm:self-auto sm:shrink-0"
              >
                <a href={project.project_url} target="_blank" rel="noreferrer">
                  Visit live site <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </motion.header>

        {heroImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative mt-10 h-[180px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-[#C6F10E]/5 sm:h-[260px] sm:rounded-3xl lg:h-[340px]"
          >
            <img
              src={heroImage}
              alt={`${project.title} banner`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            <div className="flex items-center gap-3">
              <Layers3 className="h-5 w-5 text-[#C6F10E]" />
              <h2 className="text-xl font-bold">Project overview</h2>
            </div>
            <p className="mt-5 whitespace-pre-line text-base leading-8 text-zinc-400">
              {project.description}
            </p>

            {project.features.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold">Key features</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300"
                    >
                      <span className="mr-2 text-[#C6F10E]">✦</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside>
            <Card className="border-white/10 bg-white/[0.04] text-white backdrop-blur">
              <CardContent className="space-y-6 p-5 sm:p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Role
                  </p>
                  <p className="mt-2 font-semibold">
                    {ROLE_LABELS[project.role]}
                  </p>
                </div>
                {project.client && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Client
                    </p>
                    <p className="mt-2 font-semibold">{project.client}</p>
                  </div>
                )}
                {period && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Timeline
                    </p>
                    <p className="mt-2 flex items-center gap-2 font-semibold">
                      <CalendarDays className="h-4 w-4 text-[#C6F10E]" />
                      {period}
                    </p>
                  </div>
                )}
                <Separator className="bg-white/10" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Built with
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((item) => {
                      const option = getTechStackOption(item);
                      const Icon = option?.icon;
                      return (
                        <Badge
                          key={item}
                          variant="outline"
                          className="gap-1.5"
                        >
                          {Icon ? (
                            <Icon
                              aria-hidden="true"
                              size={18}
                              style={{ color: option.color }}
                            />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C6F10E]" />
                          )}
                          {item}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {project.image_url.length > 1 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#C6F10E]">
                  Visuals
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  More from the project
                </h2>
              </div>
              <ArrowUpRight className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.image_url.slice(1).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
                >
                  <img
                    src={image}
                    alt={`${project.title} preview ${index + 2}`}
                    className="aspect-video h-full w-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
