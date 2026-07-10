"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  name: string;
  description: string;
  file_url: string;
  image_url: string[];
};

type FormState = {
  id?: string;
  name: string;
  description: string;
  file_url: string;
  image_urls_text: string;
};

const initialForm: FormState = {
  name: "",
  description: "",
  file_url: "",
  image_urls_text: "",
};

function parseImageUrls(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState<string>("");

  const isEditMode = useMemo(() => Boolean(form.id), [form.id]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch projects");
      setProjects(data);
    } catch (error: any) {
      setMessage(error.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = {
      id: form.id,
      name: form.name.trim(),
      description: form.description.trim(),
      file_url: form.file_url.trim(),
      image_url: parseImageUrls(form.image_urls_text),
    };

    try {
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      await loadProjects();
      resetForm();
      setMessage(
        isEditMode ? "Project berhasil diupdate" : "Project berhasil dibuat",
      );
    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (project: Project) => {
    setForm({
      id: project.id,
      name: project.name,
      description: project.description,
      file_url: project.file_url,
      image_urls_text: project.image_url.join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm("Yakin ingin menghapus project ini?");
    if (!ok) return;

    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      await loadProjects();
      setMessage("Project berhasil dihapus");
    } catch (error: any) {
      setMessage(error.message || "Gagal menghapus project");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
        <h1 className="text-2xl font-bold text-white">Project Management</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Create, update, dan delete project untuk halaman home dan project.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">Nama Project</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
              placeholder="Contoh: Portfolio Website"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="min-h-28 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
              placeholder="Tuliskan deskripsi project"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">URL Demo / File</label>
            <input
              type="url"
              value={form.file_url}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, file_url: e.target.value }))
              }
              className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
              placeholder="https://..."
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">
              Image URLs (1 baris 1 URL)
            </label>
            <textarea
              value={form.image_urls_text}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image_urls_text: e.target.value,
                }))
              }
              className="min-h-28 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
              placeholder={"https://image-1...\nhttps://image-2..."}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-lime-400 px-5 py-2.5 font-semibold text-black hover:bg-lime-300 disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Update Project"
                : "Create Project"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/20 px-5 py-2.5 font-medium text-white hover:bg-white/10"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-zinc-300">{message}</p>}
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
        <h2 className="text-xl font-semibold text-white">Daftar Project</h2>

        {loading ? (
          <p className="mt-4 text-zinc-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="mt-4 text-zinc-400">Belum ada data project.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                      {project.description}
                    </p>
                    <a
                      href={project.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-lime-400 hover:text-lime-300"
                    >
                      Open demo
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(project)}
                      className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(project.id)}
                      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
