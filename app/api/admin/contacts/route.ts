import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (user?.role !== "vendedor" && !user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    SELECT id, source, name, email, phone, interest, property_id, property_title, message, created_at
    FROM inquiries ORDER BY created_at DESC
  `;
  return Response.json({ inquiries: rows });
}
