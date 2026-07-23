import { sql } from "../../lib/db";

export async function GET() {
  const rows = await sql`
    SELECT id, image_url, content, created_at FROM posts
    WHERE published = true ORDER BY created_at DESC LIMIT 6
  `;
  return Response.json({ posts: rows });
}
