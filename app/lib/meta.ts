// Server-only: publishes to the Meta Graph API (Facebook Page + linked
// Instagram Business account). Never import this from a "use client"
// component — META_PAGE_ACCESS_TOKEN must stay off the client bundle.
const GRAPH_BASE = "https://graph.facebook.com/v21.0";
const IG_CONTAINER_POLL_ATTEMPTS = 10;
const IG_CONTAINER_POLL_DELAY_MS = 2000;

export type MetaPublishResult = { ok: true; remoteId: string } | { ok: false; error: string };

function accessToken(): string {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) throw new Error("META_PAGE_ACCESS_TOKEN is not configured");
  return token;
}

async function graphPost(path: string, body: Record<string, string>): Promise<{ id?: string; error?: { message: string } }> {
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...body, access_token: accessToken() }),
  });
  return res.json();
}

async function graphGet(path: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const query = new URLSearchParams({ ...params, access_token: accessToken() });
  const res = await fetch(`${GRAPH_BASE}${path}?${query}`);
  return res.json();
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function publishFacebookFeedPhoto(imageUrl: string, caption: string): Promise<MetaPublishResult> {
  const pageId = process.env.META_PAGE_ID;
  if (!pageId) return { ok: false, error: "META_PAGE_ID is not configured" };

  const result = await graphPost(`/${pageId}/photos`, { url: imageUrl, caption, published: "true" });
  if (result.error) return { ok: false, error: result.error.message };
  if (!result.id) return { ok: false, error: "unexpected_response" };
  return { ok: true, remoteId: result.id };
}

async function waitForContainerReady(containerId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  for (let attempt = 0; attempt < IG_CONTAINER_POLL_ATTEMPTS; attempt++) {
    const status = await graphGet(`/${containerId}`, { fields: "status_code" });
    if (status.status_code === "FINISHED") return { ok: true };
    if (status.status_code === "ERROR") return { ok: false, error: "instagram_container_error" };
    await sleep(IG_CONTAINER_POLL_DELAY_MS);
  }
  return { ok: false, error: "instagram_container_timeout" };
}

async function publishInstagramContainer(mediaField: "image_url" | "video_url", mediaUrl: string, extra: Record<string, string>): Promise<MetaPublishResult> {
  const igUserId = process.env.META_IG_BUSINESS_ACCOUNT_ID;
  if (!igUserId) return { ok: false, error: "META_IG_BUSINESS_ACCOUNT_ID is not configured" };

  const create = await graphPost(`/${igUserId}/media`, { [mediaField]: mediaUrl, ...extra });
  if (create.error) return { ok: false, error: create.error.message };
  if (!create.id) return { ok: false, error: "unexpected_response" };

  const ready = await waitForContainerReady(create.id);
  if (!ready.ok) return { ok: false, error: ready.error };

  const publish = await graphPost(`/${igUserId}/media_publish`, { creation_id: create.id });
  if (publish.error) return { ok: false, error: publish.error.message };
  if (!publish.id) return { ok: false, error: "unexpected_response" };
  return { ok: true, remoteId: publish.id };
}

export async function publishInstagramFeedImage(imageUrl: string, caption: string): Promise<MetaPublishResult> {
  return publishInstagramContainer("image_url", imageUrl, { caption });
}

export async function publishInstagramStory(mediaUrl: string, mediaType: "image" | "video"): Promise<MetaPublishResult> {
  // Instagram does not support captions on Stories.
  const field = mediaType === "video" ? "video_url" : "image_url";
  return publishInstagramContainer(field, mediaUrl, { media_type: "STORIES" });
}
