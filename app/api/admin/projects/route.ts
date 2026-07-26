import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return Response.json({ projects: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { content, images } = await request.json();
  if (!content?.en?.title || !content?.es?.title) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const imageList: string[] = Array.isArray(images) ? images.filter((s): s is string => typeof s === "string" && s.trim() !== "") : [];

  const rows = await sql`
    INSERT INTO projects (published, image_url, images, content, created_by)
    VALUES (false, ${imageList[0] ?? null}, ${JSON.stringify(imageList)}, ${JSON.stringify(content)}, ${user.id})
    RETURNING *
  `;

  return Response.json({ project: rows[0] });
}
