"use client";

import BlurText from "./reactbits/BlurText/BlurText";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import dynamic from "next/dynamic";

const Lanyard = dynamic(
  () => import("@/components/reactbits/Lanyard/Lanyard"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function AboutMeSection() {
  const { data: settings } = useSiteSettings();
  return (
    <section
      id="about"
      className="relative -mt-6 overflow-hidden py-4 pb-4 sm:-mt-4 sm:py-8 sm:pb-6 lg:mt-0 lg:pt-28 lg:pb-10"
    >
      <div className="grid items-center gap-0 sm:gap-4 lg:grid-cols-2 lg:gap-16">
        <div className="flex min-h-[260px] items-center justify-center lg:order-1 lg:h-[min(34rem,70vh)] lg:min-h-[26rem]">
          <div className="h-[330px] w-full translate-y-6 sm:h-[370px] sm:translate-y-8 lg:hidden">
            <Lanyard
              position={[0, 0, 16]}
              gravity={[0, -30, 0]}
              fov={25}
              verticalOffset={0.5}
            />
          </div>
        </div>

        <div className="w-full max-w-xl px-2 -translate-y-4 sm:translate-y-0 sm:px-0 lg:order-2 lg:max-w-none">
          <BlurText
            text={
              settings?.about_text ||
              "As a front-end developer, I'm a lowkey perfectionist when it comes to design. I like building things that look good and work even better. Coding's my craft, but creativity's what really keeps me going."
            }
            className="w-full justify-center text-center text-base leading-relaxed text-zinc-300 sm:justify-start sm:text-left sm:text-lg"
            animateBy="words"
            delay={50}
            direction="top"
          />
        </div>
      </div>
    </section>
  );
}
