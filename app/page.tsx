import Image from "next/image";
import Lanyard from "./components/Lanyard/Lanyard";
import RotatingText from "./components/RotatingText/RotatingText";
import SplitText from "./components/SplitText/SplitText";
import BlurText from "./components/BlurText/BlurText";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-blend-lighten">
      <div className="container mx-auto h-screen">
        <div className="grid grid-cols-12">
          <div className="col-span-6">
            <div className="flex items-center h-full">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl text-white font-bold">
                    Looking For Me?
                  </h1>
                  <RotatingText
                    texts={[
                      "Web Design",
                      "Web Developer",
                      "Mobile Developer",
                      "Front-End Development",
                    ]}
                    mainClassName="px-2 sm:px-2 md:px-3 bg-[#C6F10E] text-black overflow-hidden py-0.5 sm:py-1 justify-center rounded-lg text-2xl font-bold inline-flex transition-all"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <SplitText
                    text="Hey there, Bima here."
                    className="text-5xl font-semibold text-start"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                  <SplitText
                    text="Front-end Developer"
                    className="text-6xl font-semibold text-start text-[#C6F10E]"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                </div>

                <BlurText
                  text="Coffee lover, and lowkey perfectionist when it comes to design. I like building things that look good and work even better. Coding’s my craft, but creativity’s what really keeps me going."
                  delay={50}
                  animateBy="words"
                  direction="top"
                  className="text-xl mb-8"
                />
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <Lanyard position={[0, 0, 12]} gravity={[0, -40, 0]} />
          </div>
        </div>
      </div>
    </div>
  );
}
