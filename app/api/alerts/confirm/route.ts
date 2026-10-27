import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { snapshot, watching, type AlertRow } from "../../../lib/alerts";

/** The link in the confirmation email. From now on the subscriber gets what is
 *  new after this moment, not what the page already lists. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const done = (status: string, lang = "es") => NextResponse.redirect(new URL(`/alertas?status=${status}&lang=${lang}`, request.nextUrl.origin));

  const rows = /^[a-f0-9]{48}$/.test(token)
    ? await sql`SELECT id, lang, page_key, status FROM property_alerts WHERE token = ${token}` as Pick<AlertRow, "id" | "lang" | "page_key" | "status">[]
    : [];
  const alert = rows[0];
  if (!alert || alert.status === "unsubscribed") return done("invalid");
  if (alert.status === "active") return done("confirmed", alert.lang);

  const seen = JSON.stringify(snapshot(await watching(alert.page_key)));
  await sql`UPDATE property_alerts SET status = 'active', confirmed_at = now(), seen = ${seen}::jsonb WHERE id = ${alert.id}`;
  return done("confirmed", alert.lang);
}
