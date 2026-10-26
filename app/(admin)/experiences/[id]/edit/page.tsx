"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useExperiences } from "@/hooks/useExperiences";
import { ExperienceForm } from "../../components/ExperienceForm";

export default function EditExperiencePage() {
  const params = useParams<{ id: string }>();
  const { experiences, loading, form, setForm, submit, submitting } = useExperiences();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  useEffect(() => {
    const experience = experiences.find((item) => item.id === params.id);
    if (experience) {
      setForm({ id: experience.id, title: experience.title, description: experience.description, images: experience.images, isPublished: experience.isPublished });
      setImagePreviews(experience.images);
    }
  }, [experiences, params.id, setForm]);

  if (loading) return <p className="text-sm text-muted-foreground">Memuat experience...</p>;
  if (!form.id) return <div className="space-y-4"><p>Experience tidak ditemukan.</p><Link href="/experiences" className="text-sm underline">Kembali</Link></div>;
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    await submit(event, selectedFiles);
  };
  return <div className="space-y-4"><Link href="/experiences" className="text-sm text-muted-foreground hover:text-foreground">← Experience</Link><ExperienceForm form={form} setForm={setForm} onSubmit={handleSubmit} submitting={submitting} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} imagePreviews={imagePreviews} setImagePreviews={setImagePreviews} /></div>;
}
