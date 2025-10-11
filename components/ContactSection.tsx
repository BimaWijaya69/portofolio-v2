export default function ContactSection() {
  return (
    <section id="contact" className="py-20">
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
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 bg-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
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
  );
}
