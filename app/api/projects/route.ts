import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// ============ HELPERS ============

async function uploadToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "portfolio/projects",
  });

  return result.secure_url;
}

async function deleteFromCloudinary(urls: string[]) {
  for (const url of urls) {
    try {
      // Extract public_id dari URL cloudinary
      const parts = url.split("/");
      const fileName = parts[parts.length - 1].split(".")[0];
      const folder = "portfolio/projects";
      await cloudinary.uploader.destroy(`${folder}/${fileName}`);
    } catch (error) {
      console.error(`Failed to delete from Cloudinary: ${url}`, error);
    }
  }
}

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
      replaceImages: body.replace_images ?? false,
    };
  }

  const formData = await req.formData();
  const name = (formData.get("name") as string) || "";
  const description = (formData.get("description") as string) || "";
  const fileUrl = (formData.get("file_url") as string) || "";
  const id = (formData.get("id") as string) || undefined;
  const replaceImages = formData.get("replace_images") === "true";

  const imageFiles = formData.getAll("images") as File[];
  const uploadedUrls: string[] = [];

  // Upload ke Cloudinary
  for (const file of imageFiles) {
    if (!file || !file.name) continue;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
      throw new Error(`Invalid file type: ${file.name}`);
    }

    const url = await uploadToCloudinary(file);
    uploadedUrls.push(url);
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

// ============ API HANDLERS ============

export async function GET() {
  try {
    const data = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
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

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (fileUrl) updateData.file_url = fileUrl;

    if (uploadedUrls.length > 0) {
      if (replaceImages) {
        await deleteFromCloudinary(existingProject.image_url || []);
        updateData.image_url = uploadedUrls;
      } else {
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

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Hapus dari Cloudinary
    if (project.image_url && project.image_url.length > 0) {
      await deleteFromCloudinary(project.image_url);
    }

    await prisma.project.delete({ where: { id } });

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
