// app/(admin)/projects/components/ProjectForm.tsx
"use client";

import { ProjectFormData } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

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
}

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
}: ProjectFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      alert("Hanya file JPG, PNG, WEBP, dan GIF yang diizinkan");
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const itemToRemove = imagePreviews[index];

    if (itemToRemove.startsWith("blob:")) {
      URL.revokeObjectURL(itemToRemove);
    }

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nama Project */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Project</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Portfolio Website"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="min-h-28"
              placeholder="Tuliskan deskripsi project"
              required
            />
          </div>

          {/* URL Demo */}
          <div className="space-y-2">
            <Label htmlFor="file_url">URL Demo / File</Label>
            <Input
              id="file_url"
              type="url"
              value={form.file_url}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, file_url: e.target.value }))
              }
              placeholder="https://..."
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              Images{" "}
              <span className="text-muted-foreground text-xs">
                (JPG, PNG, WEBP)
              </span>
            </Label>

            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-6 transition hover:border-primary/50 hover:bg-muted/60"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Klik atau drag & drop untuk upload gambar
              </p>
              <p className="text-xs text-muted-foreground/70">
                Maksimal 5MB per gambar
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

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-foreground opacity-0 transition group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isEditMode && form.image_urls_text && (
              <input
                type="hidden"
                name="existing_images"
                value={form.image_urls_text}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Update Project"
                : "Create Project"}
            </Button>

            {isEditMode && (
              <Button type="button" onClick={resetForm} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
