import { NextRequest } from "next/server";
import { sql } from "../../lib/db";
import { getSessionUser } from "../../lib/auth";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const propertyId = request.nextUrl.searchParams.get("property_id");

  if (type !== "testimonial" && type !== "property") {
    return Response.json({ error: "invalid_type" }, { status: 400 });
  }

  const rows = type === "property"
    ? await sql`
        SELECT id, name, rating, comment, language, created_at FROM reviews
        WHERE type = 'property' AND property_id = ${propertyId} AND status = 'approved'
        ORDER BY created_at DESC
      `
    : await sql`
        SELECT id, name, rating, comment, language, created_at FROM reviews
        WHERE type = 'testimonial' AND status = 'approved'
        ORDER BY created_at DESC
      `;

  return Response.json({ reviews: rows });
}

export async function POST(request: NextRequest) {
  const sessionUser = await getSessionUser();
  const body = await request.json();
  const { type, propertyId, propertyTitle, rating, comment, language } = body ?? {};

  // Logged-in users' reviews are tied to their real account name/email,
  // rather than trusting whatever the client sends, so a review can't be
  // spoofed under someone else's identity.
  const name = sessionUser ? sessionUser.name : body?.name;
  const email = sessionUser ? sessionUser.email : body?.email;
  const reviewLanguage = language === "en" ? "en" : "es";

  if (
    (type !== "testimonial" && type !== "property") ||
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof comment !== "string" || !comment.trim() ||
    typeof rating !== "number" || rating < 1 || rating > 5
  ) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  await sql`
    INSERT INTO reviews (type, property_id, property_title, name, email, rating, comment, language, status, user_id)
    VALUES (${type}, ${type === "property" ? propertyId : null}, ${type === "property" ? propertyTitle : null}, ${name.trim()}, ${email.trim()}, ${rating}, ${comment.trim()}, ${reviewLanguage}, 'pending', ${sessionUser?.id ?? null})
  `;

  if (WEB3FORMS_ACCESS_KEY) {
    const adminUrl = `${request.nextUrl.origin}/admin/reviews`;
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nueva reseña pendiente de ${name} — El Casa Rosarito`,
          from_name: "El Casa Rosarito Website",
          replyto: email,
          name,
          email,
          rating: `${rating}/5`,
          review: comment,
          ...(type === "property" ? { property: propertyTitle || propertyId } : {}),
          message: `Revisa y aprueba/rechaza esta reseña en: ${adminUrl}`,
        }),
      });
    } catch {
      // Notification email is best-effort; the review is already saved as pending.
    }
  }

  return Response.json({ ok: true });
}
