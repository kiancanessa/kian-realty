import { sql } from "../../lib/db";

export async function GET() {
  const rows = await sql`
    SELECT id, image_url, content, created_at FROM projects
    WHERE published = true ORDER BY created_at DESC
  `;
  return Response.json({ projects: rows });
}
