// app/(admin)/projects/create/page.tsx
"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectForm } from "../components/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const router = useRouter();
  const { form, setForm, submitting, handleSubmitWithFiles, resetForm } =
    useProjects();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmitWithFiles(e, selectedFiles, imagePreviews);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Project</h1>
          <p className="text-muted-foreground">
            Tambahkan project baru ke portfolio
          </p>
        </div>
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
      />
    </div>
  );
}
