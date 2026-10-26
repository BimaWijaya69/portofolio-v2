"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExperiences } from "@/hooks/useExperiences";
import { ExperienceTable } from "./components/ExperienceTable";

export default function ExperiencesPage() {
  const { experiences, loading, remove } = useExperiences();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Experience</h1>
          <p className="text-muted-foreground">Kelola timeline experience portfolio</p>
        </div>
        <Link href="/experiences/create">
          <Button><PlusCircle className="mr-2 h-4 w-4" />Create Experience</Button>
        </Link>
      </div>
      <ExperienceTable experiences={experiences} loading={loading} onDelete={remove} />
    </div>
  );
}
