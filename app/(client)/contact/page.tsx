"use client";

import { FormEvent, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function ContactPage() {
  const { data: settings } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings?.email) {
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const senderEmail = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = `Portfolio contact from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${senderEmail}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const gmailUrl = new URL("https://mail.google.com/mail/");
    gmailUrl.searchParams.set("view", "cm");
    gmailUrl.searchParams.set("fs", "1");
    gmailUrl.searchParams.set("to", settings.email);
    gmailUrl.searchParams.set("su", subject);
    gmailUrl.searchParams.set("body", body);

    window.location.assign(gmailUrl.toString());
  }

  return (
    <main className="min-h-screen px-6 pb-20 pt-32 sm:px-10 lg:px-14">
      <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] lg:gap-20">
        <form onSubmit={handleSubmit} className="order-2 space-y-3 lg:order-1">
          <label className="sr-only" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Name"
            required
            className="h-14 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-sm text-white outline-none transition placeholder:text-[#9b9ba8] focus:border-[#C6F10E]/60 focus:ring-1 focus:ring-[#C6F10E]/30"
          />

          <label className="sr-only" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="Email"
            required
            className="h-14 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-sm text-white outline-none transition placeholder:text-[#9b9ba8] focus:border-[#C6F10E]/60 focus:ring-1 focus:ring-[#C6F10E]/30"
          />

          <label className="sr-only" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Message"
            required
            rows={7}
            className="min-h-40 w-full resize-y rounded-md border border-white/10 bg-[#111111] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#9b9ba8] focus:border-[#C6F10E]/60 focus:ring-1 focus:ring-[#C6F10E]/30"
          />

          <button
            type="submit"
            disabled={!settings?.email || isSubmitting}
            className="h-14 w-full rounded-md border border-white/10 bg-[#171717] text-sm text-[#a8a8b2] transition hover:border-[#C6F10E]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Opening Gmail..." : "Submit"}
          </button>
        </form>

        <div className="order-1 lg:order-2">
          <p className="mb-3 text-sm text-[#a3e635]">Let&apos;s talk</p>
          <h1 className="mb-7 text-5xl font-light tracking-tight text-white sm:text-6xl">
            Contact
          </h1>
          <p className="max-w-md text-sm leading-7 text-[#b5b5c0] sm:text-base">
            Have a question or a project in mind? Feel free to reach out.
          </p>
          {settings?.email && (
            <p className="mt-5 text-sm text-[#b5b5c0]">
              Email: <span className="text-white">{settings.email}</span>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
