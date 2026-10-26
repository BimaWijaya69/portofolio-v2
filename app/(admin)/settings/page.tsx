"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings, type SiteSettings } from "@/hooks/useSiteSettings";

export default function SettingsPage() {
  const { data, isLoading } = useSiteSettings();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Memuat settings...</p>;

  const update = (key: keyof SiteSettings, value: string) =>
    setForm((current) => current && { ...current, [key]: value });

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "id" && key !== "cv_url" && key !== "updated_at") body.append(key, String(value ?? ""));
      });
      body.append("existing_cv_url", form.cv_url || "");
      if (cv) body.append("cv", cv);
      const response = await fetch("/api/settings", { method: "PUT", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan settings");
      setForm(result);
      setCv(null);
      toast.success("Settings berhasil disimpan");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <div><h1 className="text-3xl font-bold">Site Settings</h1><p className="text-muted-foreground">Kelola link, CV, dan teks portfolio dari sini.</p></div>
      <Card><CardHeader><CardTitle>Kontak & Resume</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
        <Input placeholder="LinkedIn URL" value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} />
        <Input placeholder="GitHub URL" value={form.github_url} onChange={(e) => update("github_url", e.target.value)} />
        <Input className="md:col-span-2" type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium">CV (PDF)</label><Input type="file" accept="application/pdf,.pdf" onChange={(e) => setCv(e.target.files?.[0] || null)} />{form.cv_url && <a className="mt-2 inline-block text-sm text-blue-500 underline" href={form.cv_url} target="_blank" rel="noreferrer">Preview CV saat ini</a>}</div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Konten Hero & About</CardTitle></CardHeader><CardContent className="space-y-4">
        <Input placeholder="Sapaan Hero" value={form.hero_greeting} onChange={(e) => update("hero_greeting", e.target.value)} />
        <Textarea placeholder="Judul Hero" rows={3} value={form.hero_title} onChange={(e) => update("hero_title", e.target.value)} />
        <Textarea placeholder="Deskripsi Hero" rows={4} value={form.hero_description} onChange={(e) => update("hero_description", e.target.value)} />
        <Textarea placeholder="Teks About Me" rows={6} value={form.about_text} onChange={(e) => update("about_text", e.target.value)} />
      </CardContent></Card>
      <div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Settings"}</Button></div>
    </form>
  );
}
