"use client";

import { Project, ROLE_LABELS, ROLE_COLORS } from "@/types/projects";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, ExternalLink, Eye, Star, FolderOpen } from "lucide-react";
import Link from "next/link";
import { ProjectDeleteDialog } from "./ProjectDeleteDialog";

interface ProjectTableProps {
  projects: Project[];
  loading: boolean;
  onDelete: (id: string) => void;
}

// ── Helpers (di luar komponen, tidak perlu re-create tiap render) ─────────────
function getRoleBadge(role: string) {
  const color = ROLE_COLORS[role as keyof typeof ROLE_COLORS] || "";
  const label = ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role;
  return (
    <Badge variant="secondary" className={color}>
      {label}
    </Badge>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32px]">No</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Stack</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
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

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Belum ada project
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Mulai tambahkan project pertamamu
            </p>
          </div>
          <Link href="/projects/create">
            <Button size="sm">Buat Project Pertama</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProjectTable({
  projects,
  loading,
  onDelete,
}: ProjectTableProps) {
  if (loading) return <TableSkeleton />;
  if (projects.length === 0) return <EmptyState />;

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32px]">No</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Stack</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={project.id}>
                {/* Nomor */}
                <TableCell className="text-muted-foreground text-sm">
                  {index + 1}
                </TableCell>

                {/* Nama + Deskripsi */}
                <TableCell>
                  <p className="font-medium text-foreground leading-tight">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[200px]">
                    {project.description}
                  </p>
                </TableCell>

                {/* Role */}
                <TableCell className="hidden md:table-cell">
                  {getRoleBadge(project.role)}
                </TableCell>

                {/* Stack */}
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {project.stack.slice(0, 2).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.stack.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.stack.length - 2}
                      </Badge>
                    )}
                    {project.stack.length === 0 && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.isPublished ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/15 text-green-600 dark:text-green-400"
                      >
                        <Eye className="h-3 w-3 mr-1" /> Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                      >
                        Draft
                      </Badge>
                    )}
                    {project.isFeatured && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/15 text-purple-600 dark:text-purple-400"
                      >
                        <Star className="h-3 w-3 mr-1" /> Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Aksi */}
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-1">
                    {project.project_url && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          window.open(project.project_url || "", "_blank")
                        }
                        title="Buka demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Link href={`/projects/${project.id}/edit`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <ProjectDeleteDialog
                      projectName={project.title}
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
