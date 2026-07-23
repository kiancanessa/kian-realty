import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user?.is_admin && !user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`SELECT * FROM announcements ORDER BY created_at DESC`;
  return Response.json({ announcements: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.is_admin && !user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { content, video_url } = await request.json();
  if (!content?.en?.title || !content?.es?.title) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO announcements (active, video_url, content, created_by)
    VALUES (false, ${video_url || null}, ${JSON.stringify(content)}, ${user.id})
    RETURNING *
  `;

  return Response.json({ announcement: rows[0] });
}
