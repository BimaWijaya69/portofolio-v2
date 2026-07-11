// app/(admin)/projects/components/ProjectTable.tsx
"use client";

import { Project } from "@/types/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { ProjectDeleteDialog } from "./ProjectDeleteDialog";

interface ProjectTableProps {
  projects: Project[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function ProjectTable({
  projects,
  loading,
  onDelete,
}: ProjectTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-muted-foreground">Belum ada project.</p>
            <Link href="/projects/create">
              <Button>Buat Project Pertama</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Nama</TableHead>
              <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
              <TableHead className="hidden lg:table-cell">Images</TableHead>
              <TableHead className="hidden xl:table-cell">URL</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium text-foreground">
                  {project.name}
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell max-w-xs truncate">
                  {project.description}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline">
                    <ImageIcon className="mr-1 h-3 w-3" />
                    {project.image_url.length}
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <a
                    href={project.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <span className="truncate max-w-[150px]">
                      {project.file_url.replace(/^https?:\/\//, "")}
                    </span>
                    <ExternalLink size={14} />
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/projects/${project.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Pencil size={14} />
                      </Button>
                    </Link>
                    <ProjectDeleteDialog
                      projectName={project.name}
                      onConfirm={() => onDelete(project.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
