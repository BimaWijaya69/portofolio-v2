import BlurText from "./reactbits/BlurText/BlurText";
import ScrollVelocity from "./reactbits/ScrollVelocity/ScrollVelocity";
import TiltedCard from "./reactbits/TiltedCard/TiltedCard";
import profileImage from "@/public/assets/images/profile_image.jpg";

export default function AboutMeSection() {
  return (
    <section id="about" className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex justify-center lg:justify-end">
          <TiltedCard
            imageSrc={profileImage.src}
            altText="Kendrick Lamar - GNX Album Cover"
            captionText="Kendrick Lamar - GNX"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={false}
            overlayContent={
              <p className="tilted-card-demo-text">Kendrick Lamar - GNX</p>
            }
          />
        </div>
        <div>
          <BlurText
            text="As a front-end developer, I'm a lowkey perfectionist when it comes to design. I like building things that look good and work even better. Coding's my craft, but creativity's what really keeps me going."
            className="text-lg mb-6"
            animateBy="words"
            delay={50}
            direction="top"
          />
        </div>
      </div>
    </section>
  );
}
