"use client";

import React from "react";
import BlurText from "@/components/reactbits/BlurText/BlurText";
import PillNavAnimatedButton from "@/components/reactbits/AnimatedButton/AnimatedButton";
import FadeContent from "./reactbits/FadeContent/FadeContent";

export interface ContactCTASectionProps {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  availableText?: string;
  className?: string;
}

const ContactCTASection: React.FC<ContactCTASectionProps> = ({
  title = "Let's create your next big idea.",
  ctaLabel = "Contact Me",
  ctaHref = "#contact",
  availableText = "Available for work",
  className = "",
}) => {
  return (
    <section
      className={`w-full flex justify-center text-center  my-16 ${className}`}
    >
      <div
        className="
          w-full         
          rounded-[28px] bg-[#0F0F12]
          ring-1 ring-white/5
          shadow-[0_8px_40px_rgba(0,0,0,0.35)]
          py-12 sm:py-14 md:py-16
          flex flex-col items-center justify-center text-center
        "
      >
        {/* Badge */}
        <div className="mb-5 flex items-center justify-center">
          <FadeContent
            duration={1000}
            easing="ease-out"
            blur={false}
            initialOpacity={0}
          >
            <span
              className="
              inline-flex items-center gap-2
              rounded-full bg-[#273d2a] text-gray-200/90
              px-3.5 py-1.5 text-[12px] sm:text-[13px] font-medium
              ring-1 ring-white/10
            "
            >
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#C6F10E]"></span>
                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#C6F10E] animate-ping"></span>
              </span>
              {availableText}
            </span>
          </FadeContent>
        </div>

        {/* Title */}
        <div className="mb-7 w-full max-w-[720px] px-4">
          <FadeContent
            duration={1000}
            easing="ease-out"
            blur={false}
            initialOpacity={0}
          >
            <BlurText
              text={title}
              className="
              text-[22px] sm:text-[30px] md:text-[36px] lg:text-[40px] /* ✅ lebih kecil dan proporsional */
              leading-[1.15] font-semibold tracking-[-0.02em]
              text-white whitespace-pre-line text-center justify-center
            "
              delay={0.1}
            />
          </FadeContent>
        </div>

        {/* CTA (pakai PillNavAnimatedButton langsung, tanpa Link) */}
        <div className="flex justify-center mt-2">
          <FadeContent
            duration={1000}
            easing="ease-out"
            blur={false}
            initialOpacity={0}
          >
            <PillNavAnimatedButton
              label={ctaLabel}
              href={ctaHref}
              baseColor="#fff"
              pillColor="#0A0A0D"
              hoveredPillTextColor="#0A0A0D"
              initialLoadAnimation={false}
            />
          </FadeContent>
        </div>
      </div>
    </section>
  );
};

export default ContactCTASection;
