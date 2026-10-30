"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project, ProjectFormData } from "@/types/projects";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const initialForm: ProjectFormData = {
  title: "",
  description: "",
  stack: [],
  role: "FULLSTACK",
  client: null,
  project_url: null,
  image_url: [],
  banner_url: null,
  features: [],
  start_date: null,
  end_date: null,
  isPublished: false,
  isFeatured: false,
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

  const handleSubmitWithFiles = async (
    e: React.FormEvent<HTMLFormElement>,
    selectedFiles: File[],
    bannerFile?: File | null,
  ) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
      if (bannerFile) formData.append("banner", bannerFile);

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("role", form.role);
      formData.append("stack", JSON.stringify(form.stack));
      formData.append("features", JSON.stringify(form.features));

      if (form.client) formData.append("client", form.client);
      if (form.project_url) formData.append("project_url", form.project_url);
      if (form.banner_url) formData.append("existing_banner_url", form.banner_url);
      if (form.start_date) formData.append("start_date", form.start_date);
      if (form.end_date) formData.append("end_date", form.end_date);
      if (form.image_url.length > 0) {
        formData.append("image_url", JSON.stringify(form.image_url));
      }

      formData.append("isPublished", String(form.isPublished));
      formData.append("isFeatured", String(form.isFeatured));

      if (form.id) {
        formData.append("id", form.id);
      }

      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch("/api/projects", {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const errorMessages = data.details
            .map(
              (err: { field: string; message: string }) =>
                `${err.field}: ${err.message}`,
            )
            .join("\n");
          throw new Error(errorMessages);
        }
        throw new Error(data?.error || "Request failed");
      }

      await loadProjects();
      resetForm();
      toast.success(isEditMode ? "Project updated!" : "Project created!");

      router.push("/projects");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Delete failed");
      }

      await loadProjects();
      toast.success("Project deleted!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleEdit = (project: Project) => {
    setForm({
      id: project.id,
      title: project.title,
      description: project.description,
      stack: project.stack,
      role: project.role,
      client: project.client,
      project_url: project.project_url,
      image_url: project.image_url,
      banner_url: project.banner_url,
      features: project.features,
      start_date: project.start_date
        ? new Date(project.start_date).toISOString().split("T")[0]
        : null,
      end_date: project.end_date
        ? new Date(project.end_date).toISOString().split("T")[0]
        : null,
      isPublished: project.isPublished,
      isFeatured: project.isFeatured,
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
    handleSubmitWithFiles,
    handleEdit,
    handleDelete,
    resetForm,
  };
}
