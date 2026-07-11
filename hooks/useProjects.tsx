// hooks/useProjects.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project, ProjectFormData } from "@/types/project";
import { useRouter } from "next/navigation";

const initialForm: ProjectFormData = {
  name: "",
  description: "",
  file_url: "",
  image_urls_text: "",
};

export function useProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ProjectFormData>(initialForm);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isEditMode = Boolean(form.id);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch");
      setProjects(data);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const resetForm = () => {
    setForm(initialForm);
    setMessage(null);
  };

  // 🔥 Fungsi submit dengan FormData (support file upload)
  const handleSubmitWithFiles = async (
    e: React.FormEvent<HTMLFormElement>,
    selectedFiles: File[],
    imagePreviews: string[],
  ) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();

      // Tambahkan file gambar
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Tambahkan data dari state
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("file_url", form.file_url.trim());

      if (form.id) {
        formData.append("id", form.id);
      }

      // 🔥 Kirim ke API (tanpa Content-Type, biar browser set boundary otomatis)
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch("/api/projects", {
        method,
        body: formData, // ✅ FormData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      await loadProjects();
      resetForm();
      setMessage({
        type: "success",
        text: isEditMode ? "✅ Project updated!" : "✅ Project created!",
      });

      // Redirect ke list projects
      router.push("/projects");
      router.refresh();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "❌ Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 Delete (sama)
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus project ini?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Delete failed");
      }

      await loadProjects();
      setMessage({ type: "success", text: "🗑️ Project deleted!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  };

  // 🔥 Edit (isi form dengan data)
  const handleEdit = (project: Project) => {
    setForm({
      id: project.id,
      name: project.name,
      description: project.description,
      file_url: project.file_url,
      image_urls_text: project.image_url.join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    projects,
    loading,
    submitting,
    form,
    setForm,
    message,
    isEditMode,
    handleSubmitWithFiles, // 🔥 Export fungsi baru
    handleEdit,
    handleDelete,
    resetForm,
  };
}
