import { sql } from "../../lib/db";
import { sendLeadAlert } from "../../lib/whatsapp";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export async function POST(request: Request) {
  const body = await request.json();
  const { email, propertyId, propertyTitle } = body ?? {};

  if (
    typeof email !== "string" || !email.trim() ||
    typeof propertyId !== "string" || !propertyId.trim()
  ) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const trimmedEmail = email.trim();

  // ON CONFLICT DO NOTHING mirrors the existing favorites table: a repeat
  // heart from the same lead on the same property is a no-op, not a fresh
  // signal — RETURNING id is empty when nothing was actually inserted, which
  // is exactly what gates the notification below from firing on every click.
  const inserted = await sql`
    INSERT INTO property_interest (lead_email, property_id, property_title)
    VALUES (${trimmedEmail}, ${propertyId}, ${propertyTitle || null})
    ON CONFLICT (lead_email, property_id) DO NOTHING
    RETURNING id
  `;

  if (inserted.length === 0) {
    return Response.json({ ok: true, isNew: false });
  }

  const label = propertyTitle || propertyId;

  await sql`
    INSERT INTO inquiries (source, name, email, interest, property_id, property_title, message)
    VALUES ('interest', ${trimmedEmail}, ${trimmedEmail}, ${label}, ${propertyId}, ${propertyTitle || null}, ${`Guardó "${label}" como propiedad de interés (sin llenar formulario).`})
  `;

  // Best-effort, same pattern as /api/inquiries: neither notification should
  // block the interest signal from being recorded.
  sendLeadAlert({
    name: trimmedEmail,
    contact: trimmedEmail,
    interest: label,
    message: "Mostró interés en esta propiedad con el botón de favoritos (sin cuenta).",
  }).catch(() => {});

  if (WEB3FORMS_ACCESS_KEY) {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Nuevo interés en propiedad — ${label}`,
        from_name: "El Casa Rosarito Website",
        replyto: trimmedEmail,
        email: trimmedEmail,
        property: label,
        message: `Un visitante (${trimmedEmail}) marcó "${label}" como propiedad de interés, sin llenar el formulario de contacto.`,
      }),
    }).catch(() => {});
  }

  return Response.json({ ok: true, isNew: true });
}
