import { NextRequest } from "next/server";
import { sql } from "../../lib/db";
import { sendLeadAlert } from "../../lib/whatsapp";
import { emailConfigured, sendEmail } from "../../lib/email";
import { SITE, confirmEmail, isAlertKey, isEmail, labelFor, newToken } from "../../lib/alerts";

/** Subscribes an email to a search page's alerts.
 *
 *  With the email service configured: a confirmation message goes out and the
 *  subscription stays pending until it is clicked. Without it (or if it
 *  fails), nothing can be sent to the visitor, so the request is handed to the
 *  team as a lead instead, and the answer says so. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const lang = body?.lang === "en" ? "en" : "es";
  const pageKey = body?.pageKey;
  if (!isEmail(email) || !isAlertKey(pageKey)) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const existing = await sql`
    SELECT status, created_at > now() - interval '10 minutes' AS recent, last_sent_at IS NOT NULL AS mailed
    FROM property_alerts WHERE email = ${email} AND page_key = ${pageKey}
  ` as { status: string; recent: boolean; mailed: boolean }[];
  // Already subscribed, or asked a moment ago: same answer as a new request and
  // nothing more is sent, so the form cannot be used to find out who is
  // subscribed nor to fill someone's inbox. A pending request older than that
  // gets a fresh confirmation (the first one may have been lost).
  if (existing[0] && (existing[0].status === "active" || (existing[0].status === "pending" && existing[0].recent))) {
    // Say what really happened the first time: a confirmation went out, or the team has the request.
    return Response.json({ ok: true, mode: existing[0].status === "active" || existing[0].mailed ? "email" : "team" });
  }

  const token = newToken();
  if (existing[0]) {
    await sql`
      UPDATE property_alerts SET status = 'pending', token = ${token}, lang = ${lang}, seen = '{}'::jsonb,
        created_at = now(), confirmed_at = NULL, last_sent_at = NULL
      WHERE email = ${email} AND page_key = ${pageKey}
    `;
  } else {
    await sql`INSERT INTO property_alerts (email, lang, page_key, token) VALUES (${email}, ${lang}, ${pageKey}, ${token})`;
  }

  const label = labelFor(pageKey, lang);
  if (emailConfigured()) {
    const mail = confirmEmail(lang, label, `${SITE}/api/alerts/confirm?token=${token}`);
    if (await sendEmail({ to: email, ...mail })) {
      // Remembered, so a repeated request is answered truthfully (see above).
      await sql`UPDATE property_alerts SET last_sent_at = now() WHERE email = ${email} AND page_key = ${pageKey}`;
      return Response.json({ ok: true, mode: "email" });
    }
  }

  // Nothing could be sent to the visitor: the team follows up by hand.
  await sql`
    INSERT INTO inquiries (source, name, email, interest, message)
    VALUES ('alert', 'Aviso de propiedades', ${email}, ${label}, ${`Quiere recibir avisos de: ${label} (${lang}).`})
  `;
  sendLeadAlert({ name: "Aviso de propiedades", contact: email, interest: label, message: `Quiere recibir avisos de: ${label} (${lang}).` }).catch(() => {});
  return Response.json({ ok: true, mode: "team" });
}
