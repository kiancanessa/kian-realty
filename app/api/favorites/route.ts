import { sql } from "../../lib/db";
import { getSessionUser } from "../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ favorites: [] });

  const rows = await sql`
    SELECT property_id, property_title, property_image, created_at
    FROM favorites WHERE user_id = ${user.id} ORDER BY created_at DESC
  `;
  return Response.json({ favorites: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { propertyId, propertyTitle, propertyImage } = await request.json();
  if (typeof propertyId !== "string" || !propertyId.trim()) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  await sql`
    INSERT INTO favorites (user_id, property_id, property_title, property_image)
    VALUES (${user.id}, ${propertyId}, ${propertyTitle || null}, ${propertyImage || null})
    ON CONFLICT (user_id, property_id) DO NOTHING
  `;

  return Response.json({ ok: true });
}
