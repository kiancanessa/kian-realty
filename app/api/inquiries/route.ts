import { sql } from "../../lib/db";
import { getSessionUser } from "../../lib/auth";

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();
  const body = await request.json();
  const { source, name, email, phone, interest, propertyId, propertyTitle, message } = body ?? {};

  if (
    (source !== "contact" && source !== "property") ||
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  await sql`
    INSERT INTO inquiries (source, user_id, name, email, phone, interest, property_id, property_title, message)
    VALUES (${source}, ${sessionUser?.id ?? null}, ${name.trim()}, ${email.trim()}, ${phone || null}, ${interest || null}, ${propertyId || null}, ${propertyTitle || null}, ${message || null})
  `;

  return Response.json({ ok: true });
}
