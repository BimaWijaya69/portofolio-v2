export type Experience = {
  id: string;
  title: string;
  description: string;
  images: string[];
  isPublished: boolean;
  admin_id: string;
  created_at: string | Date;
  updated_at: string | Date;
};

export type ExperienceFormData = {
  id?: string;
  title: string;
  description: string;
  images: string[];
  isPublished: boolean;
};

export const DEFAULT_EXPERIENCE_FORM: ExperienceFormData = {
  title: "",
  description: "",
  images: [],
  isPublished: true,
};
