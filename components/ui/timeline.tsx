"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const update = () => {
      const rect = ref.current!.getBoundingClientRect();
      setHeight(rect.height);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 55%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Poros (sumbu) garis & titik, bisa kamu ubah kalau mau geser
  const AXIS = 32; // px dari tepi kiri area body (setara ~left-8)
  const DOT_BOX = 28; // px lebar kotak pembungkus dot (biar compact)

  return (
    <div ref={containerRef} className="w-full font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto py-10 px-4 md:px-6 lg:px-8">
        <h2 className="text-lg md:text-3xl mb-2 text-white/90">
          Changelog from my journey
        </h2>
        <p className="text-neutral-400 text-sm md:text-base max-w-md">
          I&apos;ve been working on Aceternity for the past 2 years. Here&apos;s
          a timeline of my journey.
        </p>
      </div>

      {/* Body */}
      <div
        ref={ref}
        className="relative max-w-6xl mx-auto pb-16 px-4 md:px-6 lg:px-8"
        style={{ ["--axis" as any]: `${AXIS}px` }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-24 md:gap-10"
          >
            {/* Left sticky title & dot */}
            <div className="sticky z-40 top-32 self-start max-w-xs lg:max-w-sm md:w-full flex flex-col md:flex-row items-center">
              {/* Kotak dot diposisikan sehingga pusatnya tepat di poros */}
              <div
                className="h-7 w-7 md:h-9 md:w-9 rounded-full bg-transparent absolute flex items-center justify-center"
                style={{
                  left: `calc(var(--axis) - ${DOT_BOX / 2}px)`,
                  width: `${DOT_BOX}px`,
                  height: `${DOT_BOX}px`,
                }}
              >
                {/* ring luar */}
                <div className="h-full w-full rounded-full bg-transparent ring-2 ring-white/10" />
                {/* inti dot */}
                <div className="absolute h-2.5 w-2.5 rounded-full bg-[#2A2A2A]" />
              </div>

              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-neutral-400">
                {item.title}
              </h3>
            </div>

            {/* Right content (semua teks putih) */}
            <div className="relative pr-2 md:pl-4 pl-[calc(var(--axis)+16px)] w-full">
              {/* judul mobile */}
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-400">
                {item.title}
              </h3>

              <div className="[&_p]:text-white [&_span]:text-white [&_li]:text-white [&_div]:text-white [&_h4]:text-white [&_h5]:text-white">
                {item.content}
              </div>
            </div>
          </div>
        ))}

        {/* Track vertikal & progress — keduanya tepat di poros */}
        <div
          style={{
            height: height + "px",
            left: `var(--axis)`,
          }}
          className="absolute top-0 w-[2px] overflow-hidden bg-white/10
                     [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px]
                       bg-gradient-to-t from-[#9BE936] via-[#C6F10E] to-transparent
                       from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
