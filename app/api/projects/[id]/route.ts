import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

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

// Optional: DELETE via [id] juga bisa
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

    // Cek project dulu
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Hapus file fisik
    if (project.image_url && project.image_url.length > 0) {
      for (const url of project.image_url) {
        try {
          const fileName = url.split("/").pop();
          if (fileName) {
            const filePath = path.join(
              process.cwd(),
              "public",
              "uploads",
              "projects",
              fileName,
            );
            await unlink(filePath);
          }
        } catch (error) {
          console.error(`Failed to delete file: ${url}`, error);
        }
      }
    }

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
