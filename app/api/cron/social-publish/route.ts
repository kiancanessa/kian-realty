import { NextRequest } from "next/server";
import { sql } from "../../../lib/db";
import { publishFacebookFeedPhoto, publishInstagramFeedImage, publishInstagramStory, type MetaPublishResult } from "../../../lib/meta";
import type { SocialMediaType, SocialNetwork, SocialPostType } from "../../../lib/social-posts";

type DueTarget = {
  target_id: number;
  post_id: number;
  network: SocialNetwork;
  post_type: SocialPostType;
  media_type: SocialMediaType;
  media_urls: string[];
  caption: string;
  publish_as_news: boolean;
};

async function publishTarget(target: DueTarget): Promise<MetaPublishResult> {
  const mediaUrl = target.media_urls[0];
  if (!mediaUrl) return { ok: false, error: "missing_media" };

  if (target.post_type === "feed") {
    return target.network === "facebook"
      ? publishFacebookFeedPhoto(mediaUrl, target.caption)
      : publishInstagramFeedImage(mediaUrl, target.caption);
  }

  // Stories
  if (target.network === "instagram") return publishInstagramStory(mediaUrl, target.media_type);
  return {
    ok: false,
    error: "Facebook Stories aún no está automatizado — publícala manualmente siguiendo el tutorial de Meta Business Suite.",
  };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  // 'publishing' posts are included so a run that died mid-batch (or left a
  // target behind) gets picked up again instead of being stranded forever.
  const due = await sql`
    SELECT spt.id AS target_id, sp.id AS post_id, spt.network, sp.post_type, sp.media_type,
           sp.media_urls, sp.caption, sp.publish_as_news
    FROM social_post_targets spt
    JOIN social_posts sp ON sp.id = spt.post_id
    WHERE spt.status = 'pending' AND sp.status IN ('pending', 'publishing') AND sp.scheduled_at <= now()
  ` as DueTarget[];

  if (due.length === 0) {
    return Response.json({ ok: true, processed: 0 });
  }

  // Claim at the target level before publishing anything: an overlapping cron
  // run then sees them as 'publishing', not 'pending', so nothing goes out twice.
  const targetIds = due.map(d => d.target_id);
  await sql`UPDATE social_post_targets SET status = 'publishing' WHERE id = ANY(${targetIds})`;

  const postIds = [...new Set(due.map(d => d.post_id))];
  for (const postId of postIds) {
    await sql`UPDATE social_posts SET status = 'publishing', updated_at = now() WHERE id = ${postId}`;
  }

  let okCount = 0;
  let failCount = 0;

  for (const target of due) {
    const result = await publishTarget(target);
    if (result.ok) {
      okCount++;
      await sql`
        UPDATE social_post_targets
        SET status = 'done', remote_id = ${result.remoteId}, published_at = now(), attempts = attempts + 1
        WHERE id = ${target.target_id}
      `;
    } else {
      failCount++;
      await sql`
        UPDATE social_post_targets
        SET status = 'failed', error_message = ${result.error}, attempts = attempts + 1
        WHERE id = ${target.target_id}
      `;
    }
  }

  for (const postId of postIds) {
    const targets = await sql`SELECT status FROM social_post_targets WHERE post_id = ${postId}`;
    const allDone = targets.every(t => t.status === "done");
    const anyFailed = targets.some(t => t.status === "failed");
    const finalStatus = allDone ? "done" : anyFailed ? "failed" : "publishing";

    await sql`UPDATE social_posts SET status = ${finalStatus}, updated_at = now() WHERE id = ${postId}`;

    if (finalStatus === "done") {
      const [post] = await sql`SELECT caption, media_urls, publish_as_news, created_by FROM social_posts WHERE id = ${postId}`;
      if (post?.publish_as_news) {
        const title = String(post.caption || "").slice(0, 120) || "Nueva publicación";
        const imageUrl = Array.isArray(post.media_urls) ? post.media_urls[0] ?? null : null;
        await sql`
          INSERT INTO posts (published, image_url, template, content, created_by)
          VALUES (true, ${imageUrl}, 'image', ${JSON.stringify({
            en: { title, body: post.caption || "" },
            es: { title, body: post.caption || "" },
          })}, ${post.created_by ?? null})
        `;
      }
    }
  }

  return Response.json({ ok: true, processed: due.length, done: okCount, failed: failCount });
}
