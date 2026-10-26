"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectForm } from "../../components/ProjectForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderX } from "lucide-react";
import Link from "next/link";

// ── Loading skeleton ──────────────────────────────────────────────────────────
function EditPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-px" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Card>
        <CardContent className="p-0">
          {/* Header skeleton */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-7 w-16" />
          </div>
          {/* Section skeletons */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[200px_1fr] gap-6 px-6 py-6 border-b border-border"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-3 w-20 mt-4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Not found state ───────────────────────────────────────────────────────────
function NotFound() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <FolderX className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Project tidak ditemukan
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Project yang kamu cari tidak ada atau sudah dihapus
            </p>
          </div>
          <Link href="/projects">
            <Button size="sm" variant="outline">
              Kembali ke Projects
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EditProjectPage() {
  const params = useParams();
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
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    const project = projects.find((p) => p.id === id);
    if (project) {
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
      setImagePreviews(project.image_url);
      setBannerPreview(project.banner_url);
      setIsLoading(false);
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [id, projects, loading, setForm]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmitWithFiles(e, selectedFiles, imagePreviews, bannerFile);
  };

  if (isLoading || loading) return <EditPageSkeleton />;

  const projectExists = projects.some((p) => p.id === id);
  if (!projectExists) return <NotFound />;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
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
        isEditMode={true}
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
