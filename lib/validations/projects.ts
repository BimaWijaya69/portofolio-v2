import { z } from "zod";

const roleEnum = z.enum(["FRONTEND", "BACKEND", "FULLSTACK"]);

const urlField = z
  .string()
  .url("URL tidak valid")
  .optional()
  .nullable()
  .or(z.literal(""));

// ── Base schema (tanpa refine) ────────────────────────────────────────────────
const ProjectBaseSchema = z.object({
  title: z
    .string()
    .min(3, "Minimal 3 karakter")
    .max(100, "Maksimal 100 karakter"),
  description: z.string().min(10, "Minimal 10 karakter"),
  stack: z.array(z.string()).min(1, "Pilih minimal 1 stack"),
  role: roleEnum,
  features: z.array(z.string()).min(1, "Tambahkan minimal 1 fitur"),
  client: z.string().optional().nullable(),
  project_url: urlField,
  banner_url: urlField,
  image_url: z.array(z.string().url()).default([]),
  start_date: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v || null),
  end_date: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v || null),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

// ── Schema dengan validasi cross-field ───────────────────────────────────────
export const ProjectSchema = ProjectBaseSchema.refine(
  (d) => !(d.end_date && !d.start_date),
  {
    message: "Tanggal mulai wajib diisi jika tanggal selesai diisi",
    path: ["start_date"],
  },
)
  .refine(
    (d) =>
      !(
        d.start_date &&
        d.end_date &&
        new Date(d.end_date) <= new Date(d.start_date)
      ),
    {
      message: "Tanggal selesai harus setelah tanggal mulai",
      path: ["end_date"],
    },
  )
  .refine((d) => !(d.isFeatured && !d.isPublished), {
    message: "Project unggulan harus dipublikasikan terlebih dahulu",
    path: ["isPublished"],
  });

export const ProjectUpdateSchema = ProjectBaseSchema.partial().extend({
  id: z.string().cuid("ID tidak valid"),
});

export const ProjectQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["published", "draft", "all"]).default("all"),
  sortBy: z.enum(["created_at", "title", "start_date"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;
export type ProjectQueryInput = z.infer<typeof ProjectQuerySchema>;
