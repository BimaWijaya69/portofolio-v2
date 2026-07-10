// app/api/projects/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const data = await prisma.project.findUnique({
      where: { id },
    });

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = {
      ...data,
      image_url: data?.image_url || [],
    };

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
