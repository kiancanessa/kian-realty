export type AnnouncementLocaleContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  dates: string;
  venue: string;
  activitiesTitle: string;
  activities: string[];
  priceLabel: string;
  price: string;
  priceNote: string;
  cta: string;
};

export type AnnouncementContent = {
  en: AnnouncementLocaleContent;
  es: AnnouncementLocaleContent;
  ctaUrl: string;
};

export type Announcement = {
  id: number;
  active: boolean;
  video_url: string | null;
  content: AnnouncementContent;
  created_at: string;
  updated_at: string;
};

export const EMPTY_LOCALE_CONTENT: AnnouncementLocaleContent = {
  eyebrow: "", title: "", subtitle: "", dates: "", venue: "",
  activitiesTitle: "", activities: [], priceLabel: "", price: "", priceNote: "", cta: "",
};

export const EMPTY_CONTENT: AnnouncementContent = {
  en: { ...EMPTY_LOCALE_CONTENT },
  es: { ...EMPTY_LOCALE_CONTENT },
  ctaUrl: "",
};
