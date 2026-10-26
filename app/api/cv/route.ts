import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
      select: { cv_url: true },
    });

    if (!settings?.cv_url) {
      return NextResponse.json({ error: "CV belum tersedia" }, { status: 404 });
    }

    const response = await fetch(settings.cv_url, { cache: "no-store" });
    if (!response.ok || !response.body) {
      console.error("GET /api/cv upstream error:", response.status);
      return NextResponse.json({ error: "CV tidak dapat dimuat" }, { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="cv.pdf"',
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("GET /api/cv error:", error);
    return NextResponse.json({ error: "Gagal memuat CV" }, { status: 500 });
  }
}
