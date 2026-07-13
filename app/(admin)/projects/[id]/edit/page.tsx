// app/(admin)/projects/[id]/edit/page.tsx
"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectForm } from "../../components/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    projects,
    form,
    setForm,
    submitting,
    handleSubmitWithFiles,
    resetForm,
    loading,
  } = useProjects();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setForm({
        id: project.id,
        name: project.name,
        description: project.description,
        file_url: project.file_url,
        image_urls_text: project.image_url.join("\n"),
      });

      setImagePreviews(project.image_url);

      setIsLoading(false);
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [id, projects, loading, setForm]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmitWithFiles(e, selectedFiles, imagePreviews);
  };

  if (isLoading || loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading project...</p>
        </CardContent>
      </Card>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
          <p className="text-muted-foreground">
            Update project:{" "}
            <span className="text-foreground">{form.name || "..."}</span>
          </p>
        </div>
      </div>

      <ProjectForm
        form={form}
        setForm={setForm}
        onSubmit={handleFormSubmit}
        isEditMode={true}
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
