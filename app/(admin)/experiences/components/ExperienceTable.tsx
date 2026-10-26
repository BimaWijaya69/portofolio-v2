"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Experience } from "@/types/experiences";

export function ExperienceTable({
  experiences,
  loading,
  onDelete,
}: {
  experiences: Experience[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}) {
  if (loading) return <Card><CardContent className="space-y-4 p-6">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-12 w-full" />)}</CardContent></Card>;
  if (!experiences.length) return <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Belum ada experience. Tambahkan experience pertama.</CardContent></Card>;

  return (
    <Card>
      <CardContent className="divide-y p-0">
        {experiences.map((experience) => (
          <div key={experience.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground">{experience.title}</p>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{experience.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="secondary">{experience.isPublished ? "Published" : "Draft"}</Badge>
              <Link href={`/experiences/${experience.id}/edit`}><Button size="sm" variant="outline"><Pencil className="h-4 w-4" /></Button></Link>
              <Button size="sm" variant="outline" className="border-red-500/40 text-red-500" onClick={() => void onDelete(experience.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
