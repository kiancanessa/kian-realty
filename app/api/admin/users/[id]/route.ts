import { sql } from "../../../../lib/db";
import { getSessionUser } from "../../../../lib/auth";

const VALID_ROLES = ["client", "admin", "vendedor"];

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

  const { role } = await request.json();
  if (typeof role !== "string" || !VALID_ROLES.includes(role)) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
  return Response.json({ ok: true });
}
