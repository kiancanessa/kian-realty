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
  const { status } = await request.json();

  if (status !== "approved" && status !== "rejected" && status !== "pending") {
    return Response.json({ error: "invalid_status" }, { status: 400 });
  }

  await sql`UPDATE reviews SET status = ${status} WHERE id = ${id}`;

  return Response.json({ ok: true });
}
