import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const data = await prisma.project.findUnique({
      where: { id },
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

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Pastikan image_url selalu array
    const project = {
      ...data,
      image_url: data.image_url || [],
    };

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin only" },
        { status: 403 },
      );
    }

    const { id } = params;

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
