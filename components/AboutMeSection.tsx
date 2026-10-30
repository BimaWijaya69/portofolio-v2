"use client";

import BlurText from "./reactbits/BlurText/BlurText";
import TiltedCard from "./reactbits/TiltedCard/TiltedCard";
import profileImage from "@/public/assets/images/profile_image.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function AboutMeSection() {
  const { data: settings } = useSiteSettings();
  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 pb-8 sm:py-20 sm:pb-10 lg:pt-28 lg:pb-10"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex min-h-[300px] items-center justify-center lg:order-1 lg:h-[min(34rem,70vh)] lg:min-h-[26rem]">
          <div className="lg:hidden">
            <TiltedCard
              imageSrc={profileImage.src}
              altText="Bima profile"
              captionText="Bima"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.08}
              showMobileWarning={false}
              showTooltip={false}
            />
          </div>
        </div>

        <div className="max-w-xl lg:order-2 lg:max-w-none">
          <BlurText
            text={
              settings?.about_text ||
              "As a front-end developer, I'm a lowkey perfectionist when it comes to design. I like building things that look good and work even better. Coding's my craft, but creativity's what really keeps me going."
            }
            className="text-base leading-relaxed text-zinc-300 sm:text-lg"
            animateBy="words"
            delay={50}
            direction="top"
          />
        </div>
      </div>
    </section>
  );
}
