import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`SELECT id, email, name, is_admin, is_developer, created_at FROM users ORDER BY created_at DESC`;
  return Response.json({ users: rows });
}
