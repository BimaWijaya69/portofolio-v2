// types/projects.ts

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  stack: string[];
  role: ProjectRole;
  client: string | null;
  project_url: string | null;
  image_url: string[];
  banner_url: string | null;
  features: string[];
  start_date: Date | null;
  end_date: Date | null;
  isPublished: boolean;
  isFeatured: boolean;
  admin_id: string;
  created_at: Date;
  updated_at: Date;
  admin?: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

export type ProjectFormData = {
  id?: string;
  title: string;
  description: string;
  stack: string[];
  role: ProjectRole;
  client: string | null;
  project_url: string | null;
  image_url: string[];
  banner_url: string | null;
  features: string[];
  start_date: string | null;
  end_date: string | null;
  isPublished: boolean;
  isFeatured: boolean;
};

export type ProjectListResponse = {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProjectDetailResponse = { data: Project };

export type ProjectErrorResponse = {
  error: string;
  details?: { field: string; message: string }[];
};

export type ProjectRole = "FRONTEND" | "BACKEND" | "FULLSTACK";

export const ROLE_OPTIONS = [
  { value: "FRONTEND", label: "Frontend Developer" },
  { value: "BACKEND", label: "Backend Developer" },
  { value: "FULLSTACK", label: "Fullstack Developer" },
] as const;

export const ROLE_LABELS: Record<ProjectRole, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Fullstack",
};

export const ROLE_COLORS: Record<ProjectRole, string> = {
  FRONTEND: "bg-blue-500/20 text-blue-400",
  BACKEND: "bg-green-500/20 text-green-400",
  FULLSTACK: "bg-purple-500/20 text-purple-400",
};

export const DEFAULT_PROJECT_FORM: ProjectFormData = {
  title: "",
  description: "",
  stack: [],
  role: "FULLSTACK",
  client: null,
  project_url: null,
  image_url: [],
  banner_url: null,
  features: [],
  start_date: null,
  end_date: null,
  isPublished: false,
  isFeatured: false,
};
