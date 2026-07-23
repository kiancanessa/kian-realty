export type PostLocaleContent = {
  title: string;
  body: string;
};

export type PostContent = {
  en: PostLocaleContent;
  es: PostLocaleContent;
};

export type Post = {
  id: number;
  published: boolean;
  image_url: string | null;
  content: PostContent;
  created_at: string;
  updated_at: string;
};

export const EMPTY_POST_CONTENT: PostContent = {
  en: { title: "", body: "" },
  es: { title: "", body: "" },
};
