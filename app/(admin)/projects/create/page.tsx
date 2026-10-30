// app/(admin)/projects/create/page.tsx
"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectForm } from "../components/ProjectForm";
import Link from "next/link";
import { useState } from "react";

export default function CreateProjectPage() {
  const { form, setForm, submitting, handleSubmitWithFiles, resetForm } =
    useProjects();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmitWithFiles(e, selectedFiles, bannerFile);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          href="/projects"
          className="hover:text-foreground transition-colors"
        >
          Projects
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {form.title || "Edit"}
        </span>
      </div>

      <ProjectForm
        form={form}
        setForm={setForm}
        onSubmit={handleFormSubmit}
        isEditMode={false}
        submitting={submitting}
        resetForm={resetForm}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        bannerFile={bannerFile}
        setBannerFile={setBannerFile}
        bannerPreview={bannerPreview}
        setBannerPreview={setBannerPreview}
      />
    </div>
  );
}
