"use client";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import GithubContributions from "./GithubContributions";
import DecryptedText from "./ui/DecryptedText";
import type { Experience } from "@/types/experiences";

export function TimelineDemo({ experiences = [] }: { experiences?: Experience[] }) {
  const data = [
    ...experiences.map((experience) => ({
      title: experience.title,
      content: (
        <div>
          <p className="mb-8 whitespace-pre-line text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            {experience.description}
          </p>
          {experience.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {experience.images.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={experience.title}
                  width={500}
                  height={500}
                  className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(34,_42,_53,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                />
              ))}
            </div>
          )}
        </div>
      ),
    })),
    {
      title: "Changelog",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            <DecryptedText text="Changelog on Github" />
          </p>
          <div className="mb-8">
            <GithubContributions />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
