import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`SELECT id, email, name, role, is_developer, requested_role, created_at FROM users ORDER BY (requested_role = 'team') DESC, created_at DESC`;
  return Response.json({ users: rows });
}
