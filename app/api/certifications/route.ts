import { sql } from "../../lib/db";

export async function GET() {
  const rows = await sql`
    SELECT id, image_url, content, created_at FROM certifications
    WHERE published = true ORDER BY created_at ASC
  `;
  return Response.json({ certifications: rows });
}
