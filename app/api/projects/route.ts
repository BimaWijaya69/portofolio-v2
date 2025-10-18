import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const fileUrl = formData.get("file_url") as string;
    const adminId = formData.get("admin_id") as string;

    // ✅ cek admin
    const { data: admin } = await supabase
      .from("users")
      .select("*")
      .eq("id", adminId)
      .eq("role", "admin")
      .single();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
    }

    const imageFiles = formData.getAll("images") as File[];
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
        return NextResponse.json({ error: `Invalid file type: ${file.name}` }, { status: 400 });
      }

      const fileName = `${Date.now()}-${file.name}`;

      // ✅ convert File menjadi buffer agar bisa diupload server-side
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("projects")
        .upload(fileName, buffer, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }

      const { data: { publicUrl } } = supabase.storage.from("projects").getPublicUrl(fileName);
      uploadedUrls.push(publicUrl);
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([{ name, description, image_url: uploadedUrls, file_url: fileUrl }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const fileUrl = formData.get("file_url") as string;
    const adminId = formData.get("admin_id") as string;

    const { data: admin } = await supabase
      .from("users")
      .select("*")
      .eq("id", adminId)
      .eq("role", "admin")
      .single();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
    }

    const imageFiles = formData.getAll("images") as File[];
    let uploadedUrls: string[] = [];

    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
          return NextResponse.json({ error: `Invalid file type: ${file.name}` }, { status: 400 });
        }

        const fileName = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const { error: uploadError } = await supabase.storage
          .from("projects")
          .upload(fileName, buffer, { cacheControl: "3600", upsert: false });

        if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

        const { data: { publicUrl } } = supabase.storage.from("projects").getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }
    }

    const updateData: any = { name, description, file_url: fileUrl };
    if (uploadedUrls.length > 0) updateData.image_url = uploadedUrls;

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id, admin_id } = body;

  const { data: admin } = await supabase
    .from("users")
    .select("*")
    .eq("id", admin_id)
    .eq("role", "admin")
    .single();

  if (!admin) return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Project deleted successfully" });
}
