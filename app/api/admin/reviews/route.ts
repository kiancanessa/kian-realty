import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user?.is_admin && !user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    SELECT id, type, property_id, property_title, name, email, rating, comment, status, created_at
    FROM reviews
    ORDER BY created_at DESC
  `;

  return Response.json({ reviews: rows });
}
