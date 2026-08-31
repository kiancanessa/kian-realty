import { sql } from "../../../lib/db";
import { getSessionUser } from "../../../lib/auth";
import { parsePropertyInput, canManageProperties } from "../../../lib/ownProperties";

export async function GET() {
  const user = await getSessionUser();
  if (!canManageProperties(user)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await sql`SELECT * FROM properties ORDER BY sort_order NULLS LAST, created_at DESC`;
  return Response.json({ properties: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!canManageProperties(user)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const input = parsePropertyInput(await request.json());
  if (!input) return Response.json({ error: "invalid_payload" }, { status: 400 });

  // Created unpublished so a half-finished listing never appears live.
  const rows = await sql`
    INSERT INTO properties (
      published, title, description, location, operation, property_type,
      price, currency, bedrooms, bathrooms, parking_spaces,
      lot_size, construction_size, images, latitude, longitude, created_by
    ) VALUES (
      false, ${input.title}, ${input.description}, ${input.location}, ${input.operation}, ${input.property_type},
      ${input.price}, ${input.currency}, ${input.bedrooms}, ${input.bathrooms}, ${input.parking_spaces},
      ${input.lot_size}, ${input.construction_size}, ${JSON.stringify(input.images)}, ${input.latitude}, ${input.longitude}, ${user!.id}
    )
    RETURNING *
  `;

  return Response.json({ property: rows[0] });
}
