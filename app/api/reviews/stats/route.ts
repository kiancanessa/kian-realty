import { sql } from "../../../lib/db";

export async function GET() {
  const rows = await sql`
    SELECT property_id, AVG(rating)::float AS avg_rating, COUNT(*)::int AS count
    FROM reviews
    WHERE type = 'property' AND status = 'approved' AND property_id IS NOT NULL
    GROUP BY property_id
  `;
  return Response.json({ stats: rows });
}
