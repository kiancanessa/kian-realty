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

  if (typeof body.active === "boolean") {
    if (body.active) await sql`UPDATE announcements SET active = false WHERE id != ${id}`;
    await sql`UPDATE announcements SET active = ${body.active}, updated_at = now() WHERE id = ${id}`;
  }

  if (body.content) {
    await sql`
      UPDATE announcements
      SET content = ${JSON.stringify(body.content)}, video_url = ${body.video_url || null}, image_url = ${body.image_url || null}, template = ${body.template || "classic"}, updated_at = now()
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
  await sql`DELETE FROM announcements WHERE id = ${id}`;
  return Response.json({ ok: true });
}
