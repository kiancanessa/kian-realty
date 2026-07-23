export type PostLocaleContent = {
  title: string;
  body: string;
};

export type PostContent = {
  en: PostLocaleContent;
  es: PostLocaleContent;
};

export type PostTemplateKey = "image" | "text";

export const POST_TEMPLATES: { key: PostTemplateKey; label: string }[] = [
  { key: "image", label: "Con imagen" },
  { key: "text", label: "Solo texto" },
];

export type Post = {
  id: number;
  published: boolean;
  template: PostTemplateKey;
  image_url: string | null;
  content: PostContent;
  created_at: string;
  updated_at: string;
};

export const EMPTY_POST_CONTENT: PostContent = {
  en: { title: "", body: "" },
  es: { title: "", body: "" },
};
