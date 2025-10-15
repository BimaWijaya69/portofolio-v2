import ContactCTASection from "@/components/ContactSection";

export default function ProjectPage() {
  return (
    <div className="pt-32 px-8">
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Our Projects
          </h2>
          <p className="text-xl text-white/70">Amazing projects showcase</p>
        </div>
      </section>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContactCTASection />
      </section>
    </div>
  );
}
