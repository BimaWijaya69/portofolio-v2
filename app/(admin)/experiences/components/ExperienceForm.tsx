"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperienceFormData } from "@/types/experiences";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export function ExperienceForm({
  form,
  setForm,
  onSubmit,
  submitting,
  setSelectedFiles,
  imagePreviews,
  setImagePreviews,
}: {
  form: ExperienceFormData;
  setForm: React.Dispatch<React.SetStateAction<ExperienceFormData>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  submitting: boolean;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreviews: string[];
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const valid = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
    );
    if (valid.length !== files.length) {
      setImageError("Hanya JPG, PNG, WEBP, dan GIF yang diizinkan");
    } else {
      setImageError("");
    }
    setSelectedFiles((current) => [...current, ...valid]);
    setImagePreviews((current) => [
      ...current,
      ...valid.map((file) => URL.createObjectURL(file)),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const preview = imagePreviews[index];
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    if (index >= form.images.length) {
      const selectedFileIndex = index - form.images.length;
      setSelectedFiles((current) =>
        current.filter((_, itemIndex) => itemIndex !== selectedFileIndex),
      );
    }
    setImagePreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
    if (index < form.images.length) {
      setForm((current) => ({
        ...current,
        images: current.images.filter((_, itemIndex) => itemIndex !== index),
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!form.id && imagePreviews.length === 0) {
      event.preventDefault();
      setImageError("Upload minimal 1 gambar experience");
      return;
    }
    await onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader><CardTitle>{form.id ? "Edit Experience" : "Create Experience"}</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2"><label htmlFor="title" className="text-sm font-medium">Tahun / Judul</label><Input id="title" required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="2024" /></div>
          <div className="grid gap-2"><label htmlFor="description" className="text-sm font-medium">Deskripsi</label><Textarea id="description" required rows={6} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></div>
          <div className="grid gap-2">
            <label htmlFor="images" className="text-sm font-medium">Gambar experience</label>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 cursor-pointer hover:border-ring/50 hover:bg-ring/5" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Klik untuk upload gambar</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF</p>
              <input ref={fileInputRef} id="images" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={handleFileChange} />
            </div>
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {imagePreviews.map((src, index) => (
                  <div key={`${src}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
                    <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} /> Tampilkan di client</label>
          <div className="flex justify-end gap-2"><Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan Experience"}</Button></div>
        </CardContent>
      </Card>
    </form>
  );
}
