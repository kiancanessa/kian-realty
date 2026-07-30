export type SocialNetwork = "facebook" | "instagram";
export type SocialPostType = "feed" | "story";
export type SocialMediaType = "image" | "video";
export type SocialPostStatus = "draft" | "pending" | "publishing" | "done" | "failed";
export type SocialTargetStatus = "pending" | "publishing" | "done" | "failed";

export type SocialPostTarget = {
  id: number;
  post_id: number;
  network: SocialNetwork;
  status: SocialTargetStatus;
  remote_id: string | null;
  error_message: string | null;
  attempts: number;
  published_at: string | null;
};

export type SocialPost = {
  id: number;
  post_type: SocialPostType;
  caption: string;
  media_urls: string[];
  media_type: SocialMediaType;
  scheduled_at: string;
  status: SocialPostStatus;
  publish_as_news: boolean;
  created_at: string;
  updated_at: string;
  targets: SocialPostTarget[];
};

export const NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
};

export const STATUS_LABELS: Record<SocialPostStatus, string> = {
  draft: "Borrador",
  pending: "Programada",
  publishing: "Publicando…",
  done: "Publicada",
  failed: "Falló",
};
