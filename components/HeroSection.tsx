"use client";
import Lanyard from "./reactbits/Lanyard/Lanyard";
import RotatingText from "./reactbits/RotatingText/RotatingText";
import SplitText from "./reactbits/SplitText/SplitText";
import BlurText from "./reactbits/BlurText/BlurText";
import dynamic from "next/dynamic";
import TextType from "./reactbits/TextType/TextType";
import PillNavAnimatedButton from "./reactbits/AnimatedButton/AnimatedButton";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="absolute inset-0 z-0">
        <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
      </div>

      <div className="z-10 flex flex-col items-center gap-4 lg:gap-4 max-w-2xl mx-auto">
        <SplitText
          text="Hey there, Bima here."
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          delay={100}
          duration={0.6}
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
            Looking for a
          </h1>
          <RotatingText
            texts={["Web Designer", "Web Developer", "Front-End Dev"]}
            mainClassName="px-2 sm:px-3 bg-[#C6F10E] text-black rounded-lg text-lg sm:text-xl lg:text-2xl font-bold inline-flex"
            rotationInterval={2500}
          />
        </div>
        <TextType
          text={[
            "I'm a coffee lover with a passion for",
            "Creating beautiful and functional web experiences",
            "Let's build something great together",
          ]}
          className="text-sm sm:text-base lg:text-xl text-gray-400 mt-4"
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="_"
        />

        <div className="mt-8 px-8 py-3 font-semibold">
          <PillNavAnimatedButton
            label="My Resume"
            href="/dashboard"
            baseColor="#C6F10E"
            pillColor="#060010"
            ease="power1.easeOut"
            initialLoadAnimation={false}
            hoveredPillTextColor="#060010"
          />
        </div>
      </div>
    </section>
  );
}
