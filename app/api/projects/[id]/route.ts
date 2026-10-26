import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { ProjectUpdateSchema } from "@/lib/validations/projects";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    const data = await prisma.project.findUnique({
      where: { id },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!data || (!data.isPublished && session?.user.role !== "admin")) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    const validated = ProjectUpdateSchema.partial().parse({ id });

    const project = await prisma.project.findUnique({
      where: { id: validated.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id: validated.id } });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting project:", error);

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
      { error: error.message || "Failed to delete project" },
      { status: 500 },
    );
  }
}
