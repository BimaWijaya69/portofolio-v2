import Image from "next/image";
import Lanyard from "./components/Lanyard/Lanyard";
import RotatingText from "./components/RotatingText/RotatingText";
import SplitText from "./components/SplitText/SplitText";
import BlurText from "./components/BlurText/BlurText";
import TextType from "./components/TextType/TextType";
import ScrollVelocity from "./components/ScrollVelocity/ScrollVelocity";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="absolute inset-0 z-0">
          <Lanyard position={[0, 0, 12]} gravity={[0, -40, 0]} />
        </div>
        <div className="z-10 flex flex-col items-center gap-4 lg:gap-6 max-w-2xl mx-auto">
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
              texts={["Web Designer", "Web Developer", "Front-End Developer"]}
              mainClassName="px-2 sm:px-3 bg-[#C6F10E] text-black rounded-lg text-lg sm:text-xl lg:text-2xl font-bold inline-flex"
              rotationInterval={2500}
            />
          </div>

          <TextType
            className="text-sm sm:text-base lg:text-xl"
            text={[
              "I'm a coffee lover with a passion for creating beautiful and functional web experiences.",
              "Let's build something great together.",
            ]}
            textColors={["#F7F7F7", "#F7F7F7"]}
            loop={true}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="_"
          />

          <button className="mt-8 px-8 py-3 bg-[#C6F10E] text-black font-semibold rounded-full hover:bg-opacity-80 transition-colors">
            View My Work
          </button>
        </div>
      </section>
      <ScrollVelocity
        texts={["About Me", "About Me"]}
        scrollerClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
        velocity={10}
        className="custom-scroll-text"
      />

      {/* About Me Section */}
      <section
        id="about"
        className="py-20 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Gambar Diri */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-64 h-64 bg-gray-700 rounded-full"></div>
          </div>
          {/* Konten Teks */}
          <div>
            <BlurText
              text="As a front-end developer, I'm a lowkey perfectionist when it comes to design. I like building things that look good and work even better. Coding's my craft, but creativity's what really keeps me going."
              className="text-lg mb-6"
              animateBy="words"
              delay={50}
              direction="top"
            />
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">My Skills</h3>
              <ul className="flex flex-wrap justify-center lg:justify-start gap-4">
                <li className="px-4 py-2 bg-gray-800 rounded-full">React</li>
                <li className="px-4 py-2 bg-gray-800 rounded-full">Next.js</li>
                <li className="px-4 py-2 bg-gray-800 rounded-full">
                  Tailwind CSS
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-20 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-10 text-center">
          My Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contoh Kartu Proyek */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="h-48 w-full bg-gray-700 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-bold mb-2">Project Title</h3>
            <p className="text-sm mb-4">Deskripsi singkat proyek.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2 py-1 bg-gray-600 rounded">
                React
              </span>
              <span className="text-xs px-2 py-1 bg-gray-600 rounded">
                Tailwind
              </span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="bg-[#C6F10E] text-black px-4 py-2 rounded">
                Live Demo
              </a>
              <a href="#" className="bg-gray-700 text-white px-4 py-2 rounded">
                GitHub
              </a>
            </div>
          </div>
          {/* Duplikasi Kartu Proyek untuk setiap proyek */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="h-48 w-full bg-gray-700 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-bold mb-2">Project Title 2</h3>
            <p className="text-sm mb-4">Deskripsi singkat proyek.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2 py-1 bg-gray-600 rounded">
                Next.js
              </span>
              <span className="text-xs px-2 py-1 bg-gray-600 rounded">
                Tailwind
              </span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="bg-[#C6F10E] text-black px-4 py-2 rounded">
                Live Demo
              </a>
              <a href="#" className="bg-gray-700 text-white px-4 py-2 rounded">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-10 text-center">
          Get In Touch
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Let's Connect</h3>
            <p className="text-lg mb-4">
              Saya terbuka untuk kolaborasi dan peluang baru.
            </p>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:your.email@example.com"
                className="flex items-center gap-2"
              >
                <span>your.email@example.com</span>
              </a>
              <a href="#" className="flex items-center gap-2">
                <span>LinkedIn</span>
              </a>
              <a href="#" className="flex items-center gap-2">
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <form className="bg-gray-800 p-8 rounded-lg">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 bg-gray-700 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-gray-700 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-semibold mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full p-3 bg-gray-700 rounded"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full mt-4 px-6 py-3 bg-[#C6F10E] text-black font-semibold rounded-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
