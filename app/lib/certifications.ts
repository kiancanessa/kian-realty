export type CertificationLocaleContent = {
  name: string;
  description: string;
};

export type CertificationContent = {
  en: CertificationLocaleContent;
  es: CertificationLocaleContent;
};

export type Certification = {
  id: number;
  published: boolean;
  image_url: string | null;
  content: CertificationContent;
  created_at: string;
  updated_at: string;
};

export const EMPTY_CERTIFICATION_CONTENT: CertificationContent = {
  en: { name: "", description: "" },
  es: { name: "", description: "" },
};
