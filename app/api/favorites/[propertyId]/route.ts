import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { propertyId } = await params;
  await sql`DELETE FROM favorites WHERE user_id = ${user.id} AND property_id = ${propertyId}`;

  return Response.json({ ok: true });
}
