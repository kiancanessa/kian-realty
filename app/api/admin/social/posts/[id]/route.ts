import { sql } from "../../../../../lib/db";
import { getSessionUser } from "../../../../../lib/auth";
import type { SocialNetwork, SocialPostType, SocialMediaType } from "../../../../../lib/social-posts";

const VALID_NETWORKS: SocialNetwork[] = ["facebook", "instagram"];
const VALID_POST_TYPES: SocialPostType[] = ["feed", "story"];
const VALID_MEDIA_TYPES: SocialMediaType[] = ["image", "video"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Retry: reset one failed network target so the cron picks it up again.
  // Scoped to status = 'failed' so retrying can never re-publish a target that
  // already went out — that would duplicate a live post on Facebook/Instagram.
  if (typeof body.retryNetwork === "string" && VALID_NETWORKS.includes(body.retryNetwork)) {
    await sql`
      UPDATE social_post_targets SET status = 'pending', error_message = null
      WHERE post_id = ${id} AND network = ${body.retryNetwork} AND status = 'failed'
    `;
    await sql`UPDATE social_posts SET status = 'pending', updated_at = now() WHERE id = ${id} AND status = 'failed'`;
    return Response.json({ ok: true });
  }

  const existing = await sql`SELECT status FROM social_posts WHERE id = ${id}`;
  if (existing.length === 0) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  if (!["draft", "pending"].includes(existing[0].status)) {
    return Response.json({ error: "post_not_editable" }, { status: 409 });
  }

  const { post_type, caption, media_type, scheduled_at, publish_as_news } = body;
  const media_urls: string[] = Array.isArray(body.media_urls)
    ? body.media_urls.filter((s: unknown): s is string => typeof s === "string" && s.trim() !== "")
    : [];
  const networks: SocialNetwork[] = Array.isArray(body.networks)
    ? body.networks.filter((n: unknown): n is SocialNetwork => VALID_NETWORKS.includes(n as SocialNetwork))
    : [];
  const status: "draft" | "pending" = body.status === "pending" ? "pending" : "draft";

  if (!VALID_POST_TYPES.includes(post_type) || !scheduled_at || media_urls.length === 0 || networks.length === 0) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  await sql`
    UPDATE social_posts SET
      post_type = ${post_type}, caption = ${caption || ""}, media_urls = ${JSON.stringify(media_urls)},
      media_type = ${VALID_MEDIA_TYPES.includes(media_type) ? media_type : "image"},
      scheduled_at = ${scheduled_at}, status = ${status}, publish_as_news = ${Boolean(publish_as_news)}, updated_at = now()
    WHERE id = ${id}
  `;

  const currentTargets = await sql`SELECT network FROM social_post_targets WHERE post_id = ${id}`;
  const currentNetworks = new Set(currentTargets.map(t => t.network as SocialNetwork));
  for (const network of networks) {
    if (!currentNetworks.has(network)) {
      await sql`INSERT INTO social_post_targets (post_id, network) VALUES (${id}, ${network})`;
    }
  }
  for (const network of currentNetworks) {
    if (!networks.includes(network)) {
      await sql`DELETE FROM social_post_targets WHERE post_id = ${id} AND network = ${network}`;
    }
  }

  return Response.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await sql`SELECT status FROM social_posts WHERE id = ${id}`;
  if (existing.length > 0 && existing[0].status === "done") {
    return Response.json({ error: "cannot_delete_published" }, { status: 409 });
  }

  await sql`DELETE FROM social_posts WHERE id = ${id}`;
  return Response.json({ ok: true });
}
