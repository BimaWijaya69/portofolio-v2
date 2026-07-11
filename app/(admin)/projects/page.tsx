// app/(admin)/projects/page.tsx
"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectTable } from "./components/ProjectTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const { projects, loading, handleDelete } = useProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Kelola semua project portfolio
          </p>
        </div>
        <Link href="/projects/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </Link>
      </div>

      <ProjectTable
        projects={projects}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}
