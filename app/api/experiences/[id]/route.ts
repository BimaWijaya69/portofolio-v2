import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const existing = await prisma.experience.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    await prisma.experience.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/experiences error:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
