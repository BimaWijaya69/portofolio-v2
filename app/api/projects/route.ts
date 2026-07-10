import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

async function normalizePayload(req: Request): Promise<{
  id?: string;
  name: string;
  description: string;
  fileUrl: string;
  uploadedUrls: string[];
}> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    return {
      id: body.id,
      name: (body.name || "").trim(),
      description: (body.description || "").trim(),
      fileUrl: (body.file_url || "").trim(),
      uploadedUrls: Array.isArray(body.image_url)
        ? body.image_url.filter(Boolean)
        : [],
    };
  }

  const formData = await req.formData();
  const name = (formData.get("name") as string) || "";
  const description = (formData.get("description") as string) || "";
  const fileUrl = (formData.get("file_url") as string) || "";
  const id = (formData.get("id") as string) || undefined;

  const imageFiles = formData.getAll("images") as File[];
  const uploadedUrls: string[] = [];

  for (const file of imageFiles) {
    if (!file || !file.name) continue;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
      throw new Error(`Invalid file type: ${file.name}`);
    }

    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const fileName = `${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    uploadedUrls.push(`/uploads/projects/${fileName}`);
  }

  return {
    id,
    name: name.trim(),
    description: description.trim(),
    fileUrl: fileUrl.trim(),
    uploadedUrls,
  };
}

export async function GET() {
  const data = await prisma.project.findMany({
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin only" },
        { status: 403 },
      );
    }

    const { name, description, fileUrl, uploadedUrls } = await normalizePayload(
      req,
    );

    if (!name || !description || !fileUrl) {
      return NextResponse.json(
        { error: "name, description, dan file_url wajib diisi" },
        { status: 400 },
      );
    }

    const data = await prisma.project.create({
      data: {
        name,
        description,
        image_url: uploadedUrls,
        file_url: fileUrl,
        admin_id: session.user.id,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin only" },
        { status: 403 },
      );
    }

    const { id, name, description, fileUrl, uploadedUrls } =
      await normalizePayload(req);

    if (!id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }

    const updateData: any = { name, description, file_url: fileUrl };
    if (uploadedUrls.length > 0) updateData.image_url = uploadedUrls;

    const data = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin only" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { id } = body;

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
