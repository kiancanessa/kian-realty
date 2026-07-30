import { sql } from "../../../../lib/db";
import { getSessionUser } from "../../../../lib/auth";
import type { SocialNetwork, SocialPostType, SocialMediaType } from "../../../../lib/social-posts";

const VALID_NETWORKS: SocialNetwork[] = ["facebook", "instagram"];
const VALID_POST_TYPES: SocialPostType[] = ["feed", "story"];
const VALID_MEDIA_TYPES: SocialMediaType[] = ["image", "video"];

export async function GET() {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    SELECT sp.*, COALESCE(
      json_agg(spt.*) FILTER (WHERE spt.id IS NOT NULL), '[]'
    ) AS targets
    FROM social_posts sp
    LEFT JOIN social_post_targets spt ON spt.post_id = sp.id
    GROUP BY sp.id
    ORDER BY sp.scheduled_at DESC
  `;
  return Response.json({ posts: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
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

  const rows = await sql`
    INSERT INTO social_posts (post_type, caption, media_urls, media_type, scheduled_at, status, publish_as_news, created_by)
    VALUES (
      ${post_type}, ${caption || ""}, ${JSON.stringify(media_urls)},
      ${VALID_MEDIA_TYPES.includes(media_type) ? media_type : "image"},
      ${scheduled_at}, ${status}, ${Boolean(publish_as_news)}, ${user.id}
    )
    RETURNING *
  `;
  const post = rows[0];

  for (const network of networks) {
    await sql`INSERT INTO social_post_targets (post_id, network) VALUES (${post.id}, ${network})`;
  }

  return Response.json({ post });
}
