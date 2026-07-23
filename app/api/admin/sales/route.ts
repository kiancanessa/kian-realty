import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`SELECT * FROM sales ORDER BY created_at DESC`;
  return Response.json({ sales: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { content, image_url } = await request.json();
  if (!content?.en?.title || !content?.es?.title) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO sales (published, image_url, content, created_by)
    VALUES (false, ${image_url || null}, ${JSON.stringify(content)}, ${user.id})
    RETURNING *
  `;

  return Response.json({ sale: rows[0] });
}
