import { z } from "zod";

export type Project = {
  id: string;
  name: string;
  description: string;
  file_url: string;
  image_url: string[];
  admin_id: string;
  created_at: Date;
  updated_at: Date;
  admin?: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

export type ProjectFormData = {
  id?: string;
  name: string;
  description: string;
  file_url: string;
  image_urls_text: string; // Untuk textarea input
};

// 👇 Zod Schema untuk validasi
export const ProjectSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Nama project wajib diisi")
    .max(100, "Nama terlalu panjang"),
  description: z
    .string()
    .min(1, "Deskripsi wajib diisi")
    .max(1000, "Deskripsi terlalu panjang"),
  file_url: z.string().url("URL demo tidak valid"),
  image_url: z.array(z.string().url("URL gambar tidak valid")).default([]),
});

export const ProjectFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama project wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  file_url: z.string().url("URL demo tidak valid"),
  image_urls_text: z.string().optional(),
});

// Type inference dari schema
export type ProjectInput = z.infer<typeof ProjectSchema>;
export type ProjectFormInput = z.infer<typeof ProjectFormSchema>;
