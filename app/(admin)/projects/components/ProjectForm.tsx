"use client";

import { ProjectFormData, ROLE_OPTIONS } from "@/types/projects";
import { ProjectSchema } from "@/lib/validations/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImagePlus,
  X,
  Calendar,
  Link2,
  Star,
  Eye,
  ChevronLeft,
  Building2,
  Save,
  RotateCcw,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { TECH_STACK_OPTIONS } from "@/lib/tech-stack";
import { z, ZodError } from "zod";

interface ProjectFormProps {
  form: ProjectFormData;
  setForm: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isEditMode: boolean;
  submitting: boolean;
  resetForm: () => void;
  selectedFiles?: File[];
  setSelectedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreviews?: string[];
  setImagePreviews?: React.Dispatch<React.SetStateAction<string[]>>;
  bannerFile?: File | null;
  setBannerFile?: React.Dispatch<React.SetStateAction<File | null>>;
  bannerPreview?: string | null;
  setBannerPreview?: React.Dispatch<React.SetStateAction<string | null>>;
}

type FormErrors = Partial<
  Record<keyof ProjectFormData | "image_upload", string>
>;

// ── Field error ───────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function FormSection({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-6 px-6 py-6 border-b border-border last:border-0">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ── Tag input ─────────────────────────────────────────────────────────────────
function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
  variant = "default",
  error,
}: {
  tags: string[];
  onAdd: (val: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
  variant?: "default" | "purple";
  error?: string;
}) {
  const [input, setInput] = useState("");

  const tagStyle =
    variant === "purple"
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-primary/10 text-primary border-primary/20";

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex flex-wrap gap-1.5 min-h-10 px-3 py-2 border rounded-md bg-background focus-within:border-ring transition-colors cursor-text",
          error ? "border-destructive" : "border-border",
        )}
      >
        {tags.map((tag, i) => (
          <Badge
            key={i}
            className={cn("gap-1 border text-xs font-medium", tagStyle)}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="hover:opacity-70"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input.trim()) {
                onAdd(input.trim());
                setInput("");
              }
            }
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({
  id,
  checked,
  onCheckedChange,
  icon,
  label,
  description,
  accent,
  error,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  icon: React.ReactNode;
  label: string;
  description: string;
  accent: "primary" | "purple";
  error?: string;
}) {
  const borderActive =
    accent === "primary"
      ? "border-ring/30 bg-ring/5"
      : "border-purple-500/30 bg-purple-500/5";

  const iconBg =
    accent === "primary"
      ? "bg-primary/10 text-primary"
      : "bg-purple-500/10 text-purple-400";

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className={cn(
          "flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all",
          error ? "border-destructive bg-destructive/5" : "border-border",
          !error && checked && borderActive,
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
            iconBg,
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </label>
      <FieldError message={error} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProjectForm({
  form,
  setForm,
  onSubmit,
  isEditMode,
  submitting,
  resetForm,
  selectedFiles = [],
  setSelectedFiles = () => {},
  imagePreviews = [],
  setImagePreviews = () => {},
  bannerFile = null,
  setBannerFile = () => {},
  bannerPreview = null,
  setBannerPreview = () => {},
}: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ProjectFormData, boolean>>
  >({});

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (data: ProjectFormData): FormErrors => {
    const result = ProjectSchema.safeParse({
      ...data,
      image_url: [],
    });

    if (result.success) return {};

    const fieldErrors: FormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ProjectFormData;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return fieldErrors;
  };
  const markTouched = (field: keyof ProjectFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Re-validate field saat value berubah kalau sudah pernah disentuh
  const handleFieldChange = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K],
  ) => {
    setForm((p) => {
      const next = { ...p, [field]: value };
      if (touched[field]) {
        const newErrors = validate(next);
        setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
      }
      return next;
    });
  };

  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Tandai semua field sebagai touched
    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as typeof touched,
    );
    setTouched(allTouched);

    const newErrors = validate(form);

    // Validasi gambar — wajib minimal 1
    if (imagePreviews.length === 0) {
      newErrors.image_upload = "Upload minimal 1 gambar project";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll ke error pertama
      const firstErrorEl = document.querySelector("[data-error='true']");
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    await onSubmit(e);
  };

  // ── Image handlers ──────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type),
    );
    if (valid.length !== files.length)
      alert("Hanya JPG, PNG, WEBP, dan GIF yang diizinkan");
    setSelectedFiles((prev) => [...prev, ...valid]);
    setImagePreviews((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);
    // Clear error gambar kalau sudah ada yang diupload
    if (valid.length > 0) {
      setErrors((prev) => ({ ...prev, image_upload: undefined }));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (i: number) => {
    if (imagePreviews[i].startsWith("blob:"))
      URL.revokeObjectURL(imagePreviews[i]);
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length === 0) {
        setErrors((e) => ({
          ...e,
          image_upload: "Upload minimal 1 gambar project",
        }));
      }
      return next;
    });
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        banner_url: "Hanya JPG, PNG, WEBP, dan GIF yang diizinkan",
      }));
      return;
    }
    if (bannerPreview?.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, banner_url: undefined }));
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  // ── Stack & feature handlers ────────────────────────────────────────────────
  const addStack = (val: string) => {
    if (!form.stack.includes(val)) {
      handleFieldChange("stack", [...form.stack, val]);
    }
  };
  const removeStack = (i: number) =>
    handleFieldChange(
      "stack",
      form.stack.filter((_, idx) => idx !== i),
    );

  const addFeature = (val: string) => {
    if (!form.features.includes(val)) {
      handleFieldChange("features", [...form.features, val]);
    }
  };
  const removeFeature = (i: number) =>
    handleFieldChange(
      "features",
      form.features.filter((_, idx) => idx !== i),
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card overflow-hidden"
      noValidate
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kembali
          </Button>
          <div className="w-px h-4 bg-border" />
          <h1 className="text-sm font-semibold">
            {isEditMode ? "Edit Project" : "Buat Project Baru"}
          </h1>
        </div>
        {isEditMode && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              resetForm();
              setErrors({});
              setTouched({});
            }}
            className="text-muted-foreground h-8"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
        )}
      </div>

      {/* ── Section 1: Identitas ── */}
      <FormSection
        label="Identitas Project"
        description="Nama dan deskripsi utama yang tampil di halaman portfolio."
      >
        <div className="space-y-1.5" data-error={!!errors.title}>
          <Label className="text-xs font-medium text-muted-foreground">
            Nama project <span className="text-destructive">*</span>
          </Label>
          <Input
            value={form.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            onBlur={() => {
              markTouched("title");
              const errs = validate(form);
              setErrors((prev) => ({ ...prev, title: errs.title }));
            }}
            placeholder="Contoh: Dashboard Analytics"
            className={cn(
              "focus-visible:ring-0 focus-visible:border-ring",
              errors.title &&
                "border-destructive focus-visible:border-destructive",
            )}
            required
          />
          <FieldError message={errors.title} />
        </div>

        <div className="space-y-1.5" data-error={!!errors.description}>
          <Label className="text-xs font-medium text-muted-foreground">
            Deskripsi <span className="text-destructive">*</span>
          </Label>
          <Textarea
            value={form.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            onBlur={() => {
              markTouched("description");
              const errs = validate(form);
              setErrors((prev) => ({ ...prev, description: errs.description }));
            }}
            placeholder="Tuliskan deskripsi project secara lengkap..."
            className={cn(
              "min-h-[96px] resize-none focus-visible:ring-0 focus-visible:border-ring",
              errors.description &&
                "border-destructive focus-visible:border-destructive",
            )}
            required
          />
          <FieldError message={errors.description} />
        </div>
      </FormSection>

      {/* ── Section 2: Teknologi ── */}
      <FormSection
        label="Teknologi"
        description="Stack yang digunakan dan peranmu dalam project ini."
      >
        <div className="space-y-1.5" data-error={!!errors.stack}>
          <Label className="text-xs font-medium text-muted-foreground">
            Stack teknologi <span className="text-destructive">*</span>
          </Label>
          <Select
            value=""
            onValueChange={(value) => {
              markTouched("stack");
              addStack(value);
            }}
          >
            <SelectTrigger className={cn(errors.stack && "border-destructive")}>
              <SelectValue placeholder="Pilih teknologi..." />
            </SelectTrigger>
            <SelectContent>
              {TECH_STACK_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem
                    key={option.name}
                    value={option.name}
                    disabled={form.stack.includes(option.name)}
                  >
                    <span className="flex items-center gap-2">
                      <Icon style={{ color: option.color }} />
                      {option.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {form.stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.stack.map((stack, index) => {
                const option = TECH_STACK_OPTIONS.find((item) => item.name === stack);
                const Icon = option?.icon;
                return (
                  <Badge key={stack} variant="outline" className="gap-1.5">
                    {Icon && <Icon style={{ color: option.color }} />}
                    {stack}
                    <button type="button" onClick={() => removeStack(index)} className="ml-1 hover:text-destructive" aria-label={`Hapus ${stack}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Pilih teknologi dari daftar. Teknologi yang sama tidak dapat dipilih dua kali.
          </p>
        </div>

        <div className="space-y-1.5" data-error={!!errors.role}>
          <Label className="text-xs font-medium text-muted-foreground">
            Role <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.role}
            onValueChange={(v: any) => {
              markTouched("role");
              handleFieldChange("role", v);
            }}
          >
            <SelectTrigger
              className={cn(
                "focus:ring-0 focus:border-ring",
                errors.role && "border-destructive",
              )}
            >
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.role} />
        </div>

        <div className="space-y-1.5" data-error={!!errors.features}>
          <Label className="text-xs font-medium text-muted-foreground">
            Fitur aplikasi <span className="text-destructive">*</span>
          </Label>
          <TagInput
            tags={form.features}
            onAdd={(val) => {
              markTouched("features");
              addFeature(val);
            }}
            onRemove={(i) => {
              markTouched("features");
              removeFeature(i);
            }}
            placeholder="Tambah fitur, tekan Enter..."
            variant="purple"
            error={errors.features}
          />
        </div>
      </FormSection>

      {/* ── Section 3: Link & Waktu ── */}
      <FormSection
        label="Link & Waktu"
        description="URL demo, client, dan rentang waktu pengerjaan."
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Client / Perusahaan
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={form.client || ""}
                onChange={(e) =>
                  handleFieldChange("client", e.target.value || null)
                }
                placeholder="Nama client"
                className="pl-9 focus-visible:ring-0 focus-visible:border-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5" data-error={!!errors.project_url}>
            <Label className="text-xs font-medium text-muted-foreground">
              URL Demo / Live
            </Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="url"
                value={form.project_url || ""}
                onChange={(e) =>
                  handleFieldChange("project_url", e.target.value || null)
                }
                onBlur={() => {
                  markTouched("project_url");
                  const errs = validate(form);
                  setErrors((prev) => ({
                    ...prev,
                    project_url: errs.project_url,
                  }));
                }}
                placeholder="https://demo.com"
                className={cn(
                  "pl-9 focus-visible:ring-0 focus-visible:border-ring",
                  errors.project_url && "border-destructive",
                )}
              />
            </div>
            <FieldError message={errors.project_url} />
          </div>
        </div>

        <div className="space-y-1.5" data-error={!!errors.banner_url}>
          <Label className="text-xs font-medium text-muted-foreground">
            Banner Project
          </Label>
          <div
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 transition-colors hover:border-ring/50 hover:bg-ring/5"
            onClick={() => bannerInputRef.current?.click()}
          >
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Klik untuk upload banner
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF</p>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleBannerChange}
            />
          </div>
          <FieldError message={errors.banner_url} />
          {bannerPreview && (
            <div className="relative h-40 overflow-hidden rounded-lg border bg-muted">
              <Image
                src={bannerPreview}
                alt="Preview banner"
                fill
                className="object-cover"
              />
            </div>
          )}
          {!errors.banner_url && <p className="text-xs text-muted-foreground">Tampil sebagai hero di halaman detail project</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5" data-error={!!errors.start_date}>
            <Label className="text-xs font-medium text-muted-foreground">
              Tanggal mulai
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="date"
                value={form.start_date || ""}
                onChange={(e) =>
                  handleFieldChange("start_date", e.target.value || null)
                }
                onBlur={() => {
                  markTouched("start_date");
                  const errs = validate(form);
                  setErrors((prev) => ({
                    ...prev,
                    start_date: errs.start_date,
                  }));
                }}
                className={cn(
                  "pl-9 focus-visible:ring-0 focus-visible:border-ring",
                  errors.start_date && "border-destructive",
                )}
              />
            </div>
            <FieldError message={errors.start_date} />
          </div>

          <div className="space-y-1.5" data-error={!!errors.end_date}>
            <Label className="text-xs font-medium text-muted-foreground">
              Tanggal selesai
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="date"
                value={form.end_date || ""}
                onChange={(e) =>
                  handleFieldChange("end_date", e.target.value || null)
                }
                onBlur={() => {
                  markTouched("end_date");
                  const errs = validate(form);
                  setErrors((prev) => ({ ...prev, end_date: errs.end_date }));
                }}
                className={cn(
                  "pl-9 focus-visible:ring-0 focus-visible:border-ring",
                  errors.end_date && "border-destructive",
                )}
              />
            </div>
            <FieldError message={errors.end_date} />
            {!errors.end_date && (
              <p className="text-xs text-muted-foreground">
                Kosongkan jika masih berjalan
              </p>
            )}
          </div>
        </div>
      </FormSection>

      {/* ── Section 4: Media ── */}
      <FormSection
        label="Gambar Project"
        description="Upload screenshot atau mockup untuk ditampilkan di galeri."
      >
        <div data-error={!!errors.image_upload}>
          <div
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 cursor-pointer transition-all",
              errors.image_upload
                ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
                : "border-border hover:border-ring/50 hover:bg-ring/5",
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg border bg-muted flex items-center justify-center",
                errors.image_upload ? "border-destructive" : "border-border",
              )}
            >
              {errors.image_upload ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <ImagePlus className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p
              className={cn(
                "text-sm font-medium",
                errors.image_upload
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              Drag & drop atau klik untuk upload
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WEBP, GIF — maks. 5MB per file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <FieldError message={errors.image_upload} />
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
              >
                <Image
                  src={src}
                  alt={`Preview ${i + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 hover:bg-destructive transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </FormSection>

      {/* ── Section 5: Visibilitas ── */}
      <FormSection
        label="Visibilitas"
        description="Atur apakah project tampil publik dan masuk highlight."
      >
        <ToggleRow
          id="isPublished"
          checked={form.isPublished}
          onCheckedChange={(v) => {
            handleFieldChange("isPublished", v);
            // Kalau unpublish, otomatis unfeature juga
            if (!v && form.isFeatured) {
              handleFieldChange("isFeatured", false);
            }
          }}
          icon={<Eye className="h-4 w-4" />}
          label="Publikasikan"
          description="Project tampil di halaman portfolio"
          accent="primary"
          error={errors.isPublished}
        />
        <ToggleRow
          id="isFeatured"
          checked={form.isFeatured}
          onCheckedChange={(v) => handleFieldChange("isFeatured", v)}
          icon={<Star className="h-4 w-4" />}
          label="Jadikan Unggulan"
          description='Masuk section "Featured Projects"'
          accent="purple"
          error={errors.isFeatured}
        />
      </FormSection>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> wajib diisi
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              setErrors({});
              setTouched({});
            }}
          >
            Reset form
          </Button>
          <Button type="submit" size="sm" disabled={submitting}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {submitting
              ? "Menyimpan..."
              : isEditMode
              ? "Update Project"
              : "Buat Project"}
          </Button>
        </div>
      </div>
    </form>
  );
}
