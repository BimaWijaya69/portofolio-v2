import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

async function uploadToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "portfolio/experiences",
  });
  return result.secure_url;
}

async function parseRequest(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return await req.json();

  const formData = await req.formData();
  const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  const uploadedImages: string[] = [];
  for (const file of files) {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      throw new Error(`Invalid file type: ${file.name}`);
    }
    uploadedImages.push(await uploadToCloudinary(file));
  }
  const existingImages = formData.get("existing_images");
  return {
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    description: formData.get("description"),
    images: [
      ...(typeof existingImages === "string" ? JSON.parse(existingImages) : []),
      ...uploadedImages,
    ],
    isPublished: formData.get("isPublished") === "true",
  };
}

function parsePayload(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const images = Array.isArray(body.images)
    ? body.images.filter((image): image is string => typeof image === "string" && image.trim().length > 0)
    : [];
  if (!title || !description) {
    return null;
  }

  return {
    title,
    description,
    images,
    isPublished: body.isPublished !== false,
  };
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "admin" ? session : null;
}

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const all = params.get("all") === "true";
    if (all && !(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
    }
    const publishedOnly = !all;
    const data = await prisma.experience.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/experiences error:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });

    const payload = parsePayload(await parseRequest(req));
    if (!payload) return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    if (payload.images.length === 0) {
      return NextResponse.json({ error: "Minimal 1 gambar experience wajib diupload" }, { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: { ...payload, admin_id: session.user.id },
    });
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("POST /api/experiences error:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });

    const body = await parseRequest(req);
    const id = typeof body.id === "string" ? body.id : "";
    const payload = parsePayload(body);
    if (!id || !payload) return NextResponse.json({ error: "Invalid experience data" }, { status: 400 });

    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Experience not found" }, { status: 404 });

    const experience = await prisma.experience.update({ where: { id }, data: payload });
    return NextResponse.json(experience);
  } catch (error) {
    console.error("PUT /api/experiences error:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}
