export type SaleLocaleContent = {
  title: string;
  description: string;
  results: string;
};

export type SaleContent = {
  en: SaleLocaleContent;
  es: SaleLocaleContent;
};

export type Sale = {
  id: number;
  published: boolean;
  image_url: string | null;
  content: SaleContent;
  created_at: string;
  updated_at: string;
};

export const EMPTY_SALE_CONTENT: SaleContent = {
  en: { title: "", description: "", results: "" },
  es: { title: "", description: "", results: "" },
};
