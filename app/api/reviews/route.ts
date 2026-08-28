import { NextRequest } from "next/server";
import { sql } from "../../lib/db";
import { getSessionUser } from "../../lib/auth";
import { translateText, detectLanguage } from "../../lib/translateText";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const propertyId = request.nextUrl.searchParams.get("property_id");

  if (type !== "testimonial" && type !== "property") {
    return Response.json({ error: "invalid_type" }, { status: 400 });
  }

  const rows = type === "property"
    ? await sql`
        SELECT id, name, rating, comment_en, comment_es, language, created_at FROM reviews
        WHERE type = 'property' AND property_id = ${propertyId} AND status = 'approved'
        ORDER BY created_at DESC
      `
    : await sql`
        SELECT id, name, rating, comment_en, comment_es, language, created_at FROM reviews
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

  const trimmedComment = comment.trim();
  // The site's EN/ES toggle at submission time isn't the reviewer's actual
  // language — someone can leave it on English and still write in Spanish.
  // Detect from the text itself, falling back to the toggle only when the
  // text gives no real signal either way.
  const detectedLanguage = detectLanguage(trimmedComment, reviewLanguage);
  const otherLanguage = detectedLanguage === "es" ? "en" : "es";
  const translated = await translateText(trimmedComment, detectedLanguage, otherLanguage);
  const commentEn = detectedLanguage === "en" ? trimmedComment : translated;
  const commentEs = detectedLanguage === "es" ? trimmedComment : translated;

  await sql`
    INSERT INTO reviews (type, property_id, property_title, name, email, rating, comment, comment_en, comment_es, language, status, user_id)
    VALUES (${type}, ${type === "property" ? propertyId : null}, ${type === "property" ? propertyTitle : null}, ${name.trim()}, ${email.trim()}, ${rating}, ${trimmedComment}, ${commentEn}, ${commentEs}, ${detectedLanguage}, 'pending', ${sessionUser?.id ?? null})
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
