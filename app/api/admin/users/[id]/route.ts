import { sql } from "../../../../lib/db";
import { getSessionUser } from "../../../../lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (Number(id) === user.id) {
    return Response.json({ error: "cannot_change_self" }, { status: 400 });
  }

  const { is_admin } = await request.json();
  if (typeof is_admin !== "boolean") {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  await sql`UPDATE users SET is_admin = ${is_admin} WHERE id = ${id}`;
  return Response.json({ ok: true });
}
