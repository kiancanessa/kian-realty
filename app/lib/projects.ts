export type ProjectLocaleContent = {
  title: string;
  description: string;
  results: string;
};

export type ProjectContent = {
  en: ProjectLocaleContent;
  es: ProjectLocaleContent;
};

export type Project = {
  id: number;
  published: boolean;
  image_url: string | null;
  images: string[];
  content: ProjectContent;
  created_at: string;
  updated_at: string;
};

export const EMPTY_PROJECT_CONTENT: ProjectContent = {
  en: { title: "", description: "", results: "" },
  es: { title: "", description: "", results: "" },
};
