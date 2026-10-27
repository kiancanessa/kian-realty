import { NextRequest } from "next/server";
import { sql } from "../../../lib/db";
import { emailConfigured, sendEmail } from "../../../lib/email";
import {
  SITE, changes, digestEmail, labelFor, pageUrlFor, snapshot, watching, type AlertRow,
} from "../../../lib/alerts";
import type { LandingKey } from "../../../lib/landingPages";

// Weekly. For every confirmed subscription: what is new on its page, or lower
// in price, since the last message. Nothing to report, nothing sent.
// `?dry=1` does everything except send and save, and says what it would do.
export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const dry = request.nextUrl.searchParams.get("dry") === "1";
  if (!dry && !emailConfigured()) return Response.json({ ok: true, skipped: "email not configured" });

  const subs = await sql`SELECT * FROM property_alerts WHERE status = 'active' ORDER BY page_key` as AlertRow[];
  // Each page's properties are read once, however many people watch it.
  const current = new Map<LandingKey, Awaited<ReturnType<typeof watching>>>();

  const report = { subscribers: subs.length, sent: 0, nothingNew: 0, failed: 0, would: [] as { to: string; page: string; fresh: number; dropped: number }[] };
  for (const sub of subs) {
    if (!current.has(sub.page_key)) current.set(sub.page_key, await watching(sub.page_key));
    const now = current.get(sub.page_key)!;
    const { fresh, dropped } = changes(sub.seen ?? {}, now);
    if (fresh.length === 0 && dropped.length === 0) { report.nothingNew++; continue; }

    if (dry) { report.would.push({ to: sub.email.replace(/^(.).*(@.*)$/, "$1***$2"), page: sub.page_key, fresh: fresh.length, dropped: dropped.length }); continue; }

    const unsubscribeUrl = `${SITE}/api/alerts/unsubscribe?token=${sub.token}`;
    const mail = digestEmail(sub.lang, labelFor(sub.page_key, sub.lang), pageUrlFor(sub.page_key, sub.lang), unsubscribeUrl, fresh, dropped);
    if (await sendEmail({ to: sub.email, ...mail, unsubscribeUrl })) {
      await sql`UPDATE property_alerts SET seen = ${JSON.stringify(snapshot(now))}::jsonb, last_sent_at = now() WHERE id = ${sub.id}`;
      report.sent++;
    } else {
      report.failed++;
    }
  }
  return Response.json({ ok: true, dry, ...report });
}
