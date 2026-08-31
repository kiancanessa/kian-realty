import { sql } from "../../lib/db";
import { getSessionUser } from "../../lib/auth";
import { sendLeadAlert } from "../../lib/whatsapp";

const VALID_SOURCES = ["contact", "property", "quiz", "interest"];

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();
  const body = await request.json();
  const { source, name, email, phone, interest, propertyId, propertyTitle, message, meta } = body ?? {};

  if (
    !VALID_SOURCES.includes(source) ||
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  await sql`
    INSERT INTO inquiries (source, user_id, name, email, phone, interest, property_id, property_title, message, meta)
    VALUES (${source}, ${sessionUser?.id ?? null}, ${name.trim()}, ${email.trim()}, ${phone || null}, ${interest || null}, ${propertyId || null}, ${propertyTitle || null}, ${message || null}, ${meta ? JSON.stringify(meta) : null})
  `;

  // Best-effort: a WhatsApp outage should never block the inquiry from saving.
  sendLeadAlert({
    name: name.trim(),
    contact: [email.trim(), phone].filter(Boolean).join(" / "),
    interest: propertyTitle || interest || "Contacto general",
    message: message || "",
  }).catch(() => {});

  return Response.json({ ok: true });
}
