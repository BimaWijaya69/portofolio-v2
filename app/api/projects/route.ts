import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile, unlink, readdir } from "node:fs/promises";
import path from "node:path";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// ============ HELPERS ============

async function normalizePayload(req: Request) {
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
      // Untuk PUT: apakah mau replace images atau append?
      replaceImages: body.replace_images ?? false, // default: false (append)
    };
  }

  const formData = await req.formData();
  const name = (formData.get("name") as string) || "";
  const description = (formData.get("description") as string) || "";
  const fileUrl = (formData.get("file_url") as string) || "";
  const id = (formData.get("id") as string) || undefined;
  const replaceImages = formData.get("replace_images") === "true"; // checkbox

  const imageFiles = formData.getAll("images") as File[];
  const uploadedUrls: string[] = [];

  // Upload images
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
    replaceImages,
  };
}

// Hapus file fisik
async function deleteProjectFiles(imageUrls: string[]) {
  for (const url of imageUrls) {
    try {
      // URL format: /uploads/projects/filename.jpg
      const fileName = url.split("/").pop();
      if (!fileName) continue;

      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "projects",
        fileName,
      );
      await unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${url}`, error);
      // Jangan throw error, lanjutkan ke file berikutnya
    }
  }
}

// ============ API HANDLERS ============

export async function GET() {
  try {
    const data = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 },
    );
  }
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

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 },
    );
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

    const { id, name, description, fileUrl, uploadedUrls, replaceImages } =
      await normalizePayload(req);

    if (!id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }

    // Cek apakah project ada
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Build update data (hanya field yang diisi)
    const updateData: any = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (fileUrl) updateData.file_url = fileUrl;

    // Handle image update
    if (uploadedUrls.length > 0) {
      if (replaceImages) {
        // Replace semua gambar: hapus file lama + pakai yang baru
        await deleteProjectFiles(existingProject.image_url || []);
        updateData.image_url = uploadedUrls;
      } else {
        // Append gambar baru ke yang lama
        updateData.image_url = [
          ...(existingProject.image_url || []),
          ...uploadedUrls,
        ];
      }
    }

    const data = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 },
    );
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

    if (!id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }

    // Cek project dulu
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Hapus file gambar fisik
    if (project.image_url && project.image_url.length > 0) {
      await deleteProjectFiles(project.image_url);
    }

    // Hapus dari database
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: 500 },
    );
  }
}
