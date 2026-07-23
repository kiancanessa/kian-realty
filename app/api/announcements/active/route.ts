import { sql } from "../../../lib/db";

export async function GET() {
  const rows = await sql`SELECT id, template, video_url, image_url, content FROM announcements WHERE active = true LIMIT 1`;
  return Response.json({ announcement: rows[0] ?? null });
}
