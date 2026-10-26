import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

const defaults = {
  id: "singleton",
  linkedin_url: "https://linkedin.com",
  github_url: "https://github.com",
  email: "hello@example.com",
  cv_url: null,
  hero_greeting: "Hi there, Bima Here",
  hero_title: "Building scalable digital solutions that empower & connect.",
  hero_description: "I partner with forward-thinking companies to design and develop intuitive, high-performance web applications that turn complex problems into elegant user experiences.",
  about_text: "As a front-end developer, I'm a lowkey perfectionist when it comes to design. I like building things that look good and work even better. Coding's my craft, but creativity's what really keeps me going.",
};

async function getSettings() {
  return prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: defaults,
    update: {},
  });
}

export async function GET() {
  try {
    return NextResponse.json(await getSettings());
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const values = {
      linkedin_url: String(formData.get("linkedin_url") || "").trim(),
      github_url: String(formData.get("github_url") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      hero_greeting: String(formData.get("hero_greeting") || "").trim(),
      hero_title: String(formData.get("hero_title") || "").trim(),
      hero_description: String(formData.get("hero_description") || "").trim(),
      about_text: String(formData.get("about_text") || "").trim(),
    };
    const cv = formData.get("cv");
    let cv_url = String(formData.get("existing_cv_url") || "").trim() || null;
    if (cv instanceof File && cv.size > 0) {
      if (cv.type !== "application/pdf") {
        return NextResponse.json({ error: "CV harus berupa file PDF" }, { status: 400 });
      }
      const buffer = Buffer.from(await cv.arrayBuffer());
      const result = await cloudinary.uploader.upload(
        `data:application/pdf;base64,${buffer.toString("base64")}`,
        { folder: "portfolio/documents", resource_type: "raw", public_id: "cv" },
      );
      cv_url = result.secure_url;
    }
    if (Object.values(values).some((value) => !value)) {
      return NextResponse.json({ error: "Semua field teks wajib diisi" }, { status: 400 });
    }
    return NextResponse.json(await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      create: { ...values, cv_url },
      update: { ...values, cv_url },
    }));
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
