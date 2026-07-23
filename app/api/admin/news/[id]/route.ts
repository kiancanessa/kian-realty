import { sql } from "../../../../lib/db";
import { getSessionUser } from "../../../../lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user?.is_admin && !user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (typeof body.published === "boolean") {
    await sql`UPDATE posts SET published = ${body.published}, updated_at = now() WHERE id = ${id}`;
  }

  if (body.content) {
    await sql`
      UPDATE posts
      SET content = ${JSON.stringify(body.content)}, image_url = ${body.image_url || null}, template = ${body.template || "image"}, updated_at = now()
      WHERE id = ${id}
    `;
  }

  return Response.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user?.is_admin && !user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM posts WHERE id = ${id}`;
  return Response.json({ ok: true });
}
