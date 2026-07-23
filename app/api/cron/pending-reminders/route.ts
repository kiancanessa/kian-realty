import { NextRequest } from "next/server";
import { sql } from "../../../lib/db";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const STALE_DAYS = 3;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const staleReviews = await sql`
    SELECT COUNT(*)::int AS count FROM reviews
    WHERE status = 'pending' AND created_at < now() - interval '3 days'
  `;
  const count = staleReviews[0]?.count ?? 0;

  if (count === 0) {
    return Response.json({ ok: true, notified: false, count: 0 });
  }

  // Only developers moderate reviews now, so only they need the reminder.
  const recipients = await sql`SELECT email FROM users WHERE is_developer = true`;

  if (WEB3FORMS_ACCESS_KEY && recipients.length > 0) {
    const adminUrl = `${request.nextUrl.origin}/admin/reviews`;
    for (const r of recipients as { email: string }[]) {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `${count} reseña${count === 1 ? "" : "s"} pendiente${count === 1 ? "" : "s"} desde hace más de ${STALE_DAYS} días — El Casa Rosarito`,
          from_name: "El Casa Rosarito Website",
          replyto: r.email,
          email: r.email,
          message: `Hay ${count} reseña(s) esperando aprobación desde hace más de ${STALE_DAYS} días.\n\nRevísalas en: ${adminUrl}`,
        }),
      }).catch(() => {});
    }
  }

  return Response.json({ ok: true, notified: true, count, recipients: recipients.length });
}
