import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../lib/db";

/** The "stop receiving these alerts" link in every message. One click, no login. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const rows = /^[a-f0-9]{48}$/.test(token)
    ? await sql`UPDATE property_alerts SET status = 'unsubscribed' WHERE token = ${token} RETURNING lang` as { lang: string }[]
    : [];
  const status = rows[0] ? "unsubscribed" : "invalid";
  return NextResponse.redirect(new URL(`/alertas?status=${status}&lang=${rows[0]?.lang ?? "es"}`, request.nextUrl.origin));
}
