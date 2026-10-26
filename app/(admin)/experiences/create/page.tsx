"use client";

import Link from "next/link";
import { useExperiences } from "@/hooks/useExperiences";
import { ExperienceForm } from "../components/ExperienceForm";
import { useState } from "react";

export default function CreateExperiencePage() {
  const { form, setForm, submit, submitting } = useExperiences();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    await submit(event, selectedFiles);
  };
  return <div className="space-y-4"><Link href="/experiences" className="text-sm text-muted-foreground hover:text-foreground">← Experience</Link><ExperienceForm form={form} setForm={setForm} onSubmit={handleSubmit} submitting={submitting} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} imagePreviews={imagePreviews} setImagePreviews={setImagePreviews} /></div>;
}
