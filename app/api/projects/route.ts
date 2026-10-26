import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { ProjectSchema, ProjectUpdateSchema } from "@/lib/validations/projects";

async function uploadToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "portfolio/projects",
  });

  return result.secure_url;
}

async function uploadBannerToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "portfolio/projects/banners",
  });
  return result.secure_url;
}

async function deleteFromCloudinary(urls: string[]) {
  for (const url of urls) {
    try {
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
      title: (body.title || "").trim(),
      description: (body.description || "").trim(),
      stack: body.stack || [],
      role: body.role,
      client: body.client || null,
      project_url: body.project_url || null,
      banner_url: body.banner_url || null,
      features: body.features || [],
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      isPublished: body.isPublished ?? false,
      isFeatured: body.isFeatured ?? false,
      uploadedUrls: Array.isArray(body.image_url)
        ? body.image_url.filter(Boolean)
        : [],
      replaceImages: body.replace_images ?? false,
    };
  }

  const formData = await req.formData();
  const id = (formData.get("id") as string) || undefined;
  const title = (formData.get("title") as string) || "";
  const description = (formData.get("description") as string) || "";
  const stack = JSON.parse((formData.get("stack") as string) || "[]");
  const role = (formData.get("role") as string) || "";
  const client = (formData.get("client") as string) || null;
  const project_url = (formData.get("project_url") as string) || null;
  const existingBannerUrl = (formData.get("existing_banner_url") as string) || null;
  const bannerFile = formData.get("banner");
  let banner_url = existingBannerUrl;
  if (bannerFile instanceof File && bannerFile.size > 0) {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(bannerFile.type)) {
      throw new Error(`Invalid banner file type: ${bannerFile.name}`);
    }
    banner_url = await uploadBannerToCloudinary(bannerFile);
  }
  const features = JSON.parse((formData.get("features") as string) || "[]");
  const start_date = (formData.get("start_date") as string) || null;
  const end_date = (formData.get("end_date") as string) || null;
  const isPublished = (formData.get("isPublished") as string) === "true";
  const isFeatured = (formData.get("isFeatured") as string) === "true";
  const replaceImages = (formData.get("replace_images") as string) === "true";

  const imageFiles = formData.getAll("images") as File[];
  const uploadedUrls: string[] = [];

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
    title: title.trim(),
    description: description.trim(),
    stack,
    role,
    client: client || null,
    project_url: project_url || null,
    banner_url: banner_url || null,
    features,
    start_date: start_date || null,
    end_date: end_date || null,
    isPublished,
    isFeatured,
    uploadedUrls,
    replaceImages,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const data = await prisma.project.findMany({
      where: session?.user.role === "admin" ? undefined : { isPublished: true },
      orderBy: { created_at: "desc" },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
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

    const payload = await normalizePayload(req);

    const validated = ProjectSchema.parse({
      title: payload.title,
      description: payload.description,
      stack: payload.stack,
      role: payload.role,
      client: payload.client,
      project_url: payload.project_url,
      banner_url: payload.banner_url,
      features: payload.features,
      start_date: payload.start_date,
      end_date: payload.end_date,
      isPublished: payload.isPublished,
      isFeatured: payload.isFeatured,
      image_url: payload.uploadedUrls,
    });

    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "Project dengan judul serupa sudah ada" },
        { status: 409 },
      );
    }

    const data = await prisma.project.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        stack: validated.stack,
        role: validated.role,
        client: validated.client,
        project_url: validated.project_url,
        banner_url: validated.banner_url,
        features: validated.features,
        start_date: validated.start_date
          ? new Date(validated.start_date)
          : null,
        end_date: validated.end_date ? new Date(validated.end_date) : null,
        isPublished: validated.isPublished,
        isFeatured: validated.isFeatured,
        image_url: validated.image_url,
        admin_id: session.user.id,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);

    if (error.name === "ZodError") {
      const errors = error.errors || [];
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errors.map((err: any) => ({
            field: err.path?.join(".") || "unknown",
            message: err.message || "Invalid value",
          })),
        },
        { status: 400 },
      );
    }

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

    const payload = await normalizePayload(req);

    if (!payload.id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: payload.id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const validated = ProjectUpdateSchema.parse({
      id: payload.id,
      title: payload.title || undefined,
      description: payload.description || undefined,
      stack: payload.stack.length > 0 ? payload.stack : undefined,
      role: payload.role || undefined,
      client: payload.client,
      project_url: payload.project_url,
      banner_url: payload.banner_url,
      features: payload.features.length > 0 ? payload.features : undefined,
      start_date: payload.start_date,
      end_date: payload.end_date,
      isPublished: payload.isPublished,
      isFeatured: payload.isFeatured,
    });

    const updateData: any = {};

    if (validated.title) {
      updateData.title = validated.title;
      updateData.slug = validated.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (validated.description) updateData.description = validated.description;
    if (validated.stack) updateData.stack = validated.stack;
    if (validated.role) updateData.role = validated.role;
    if (validated.client !== undefined) updateData.client = validated.client;
    if (validated.project_url !== undefined)
      updateData.project_url = validated.project_url;
    if (validated.banner_url !== undefined)
      updateData.banner_url = validated.banner_url;
    if (validated.features) updateData.features = validated.features;
    if (validated.start_date !== undefined) {
      updateData.start_date = validated.start_date
        ? new Date(validated.start_date)
        : null;
    }
    if (validated.end_date !== undefined) {
      updateData.end_date = validated.end_date
        ? new Date(validated.end_date)
        : null;
    }
    updateData.isPublished = validated.isPublished ?? false;
    updateData.isFeatured = validated.isFeatured ?? false;

    if (payload.uploadedUrls.length > 0) {
      if (payload.replaceImages) {
        await deleteFromCloudinary(existingProject.image_url || []);
        updateData.image_url = payload.uploadedUrls;
      } else {
        updateData.image_url = [
          ...(existingProject.image_url || []),
          ...payload.uploadedUrls,
        ];
      }
    }

    const data = await prisma.project.update({
      where: { id: validated.id },
      data: updateData,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating project:", error);

    if (error.name === "ZodError") {
      const errors = error.errors || [];
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errors.map((err: any) => ({
            field: err.path?.join(".") || "unknown",
            message: err.message || "Invalid value",
          })),
        },
        { status: 400 },
      );
    }

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

    if (project.image_url && project.image_url.length > 0) {
      await deleteFromCloudinary(project.image_url);
    }

    if (project.banner_url) {
      await deleteFromCloudinary([project.banner_url]);
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
