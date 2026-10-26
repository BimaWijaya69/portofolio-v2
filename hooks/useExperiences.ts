"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DEFAULT_EXPERIENCE_FORM,
  type Experience,
  type ExperienceFormData,
} from "@/types/experiences";

export function useExperiences() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ExperienceFormData>(DEFAULT_EXPERIENCE_FORM);

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/experiences?all=true");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal memuat experience");
      setExperiences(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat experience");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExperiences();
  }, [loadExperiences]);

  const resetForm = () => setForm(DEFAULT_EXPERIENCE_FORM);

  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
    selectedFiles: File[] = [],
  ) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const body = new FormData();
      selectedFiles.forEach((file) => body.append("images", file));
      body.append("title", form.title);
      body.append("description", form.description);
      body.append("existing_images", JSON.stringify(form.images));
      body.append("isPublished", String(form.isPublished));
      if (form.id) body.append("id", form.id);

      const response = await fetch("/api/experiences", {
        method: form.id ? "PUT" : "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan experience");
      toast.success(form.id ? "Experience diperbarui" : "Experience dibuat");
      router.push("/experiences");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan experience");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    const response = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Gagal menghapus experience");
    }
    await loadExperiences();
    toast.success("Experience dihapus");
  };

  return { experiences, loading, submitting, form, setForm, resetForm, submit, remove };
}
