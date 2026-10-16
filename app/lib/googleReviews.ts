// Google Maps reviews of El Casa Rosarito, shown on the site next to the ones
// written here.
//
// They live in the same `reviews` table as the site's own testimonials (with
// source = 'google'), so the cards, the EN/ES toggle and the admin panel work
// on them exactly the same. Each one is stored in both languages, translated
// once when it arrives rather than on every visit.
//
// They come from the official Places API (Place Details). It returns at most
// the five most relevant reviews, which is plenty while the profile has four;
// past five, the newest simply stop appearing until Google ranks them in. With
// no GOOGLE_PLACES_API_KEY nothing is fetched and the rows already stored are
// shown as they are.
import "server-only";
import { sql } from "./db";
import { detectLanguage, translateText } from "./translateText";
import { GOOGLE_PLACE_ID } from "./googleLinks";

const REFRESH_AFTER_MS = 12 * 60 * 60 * 1000;
/** After a failed attempt (bad key, quota, outage) wait before trying again. */
const RETRY_AFTER_MS = 60 * 60 * 1000;
const TIMEOUT_MS = 8000;

export type GoogleSummary = { rating: number; total: number };

export async function getGoogleSummary(): Promise<GoogleSummary | null> {
  try {
    const rows = await sql`SELECT rating, total FROM google_place WHERE place_id = ${GOOGLE_PLACE_ID}` as
      { rating: string; total: number }[];
    const row = rows[0];
    return row && row.total > 0 ? { rating: Number(row.rating), total: row.total } : null;
  } catch {
    return null;
  }
}

type PlacesText = { text?: string; languageCode?: string };
type PlacesReview = {
  name?: string;
  rating?: number;
  publishTime?: string;
  text?: PlacesText;
  originalText?: PlacesText;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};
type PlacesResponse = { rating?: number; userRatingCount?: number; reviews?: PlacesReview[] };

const tidy = (s: string) => s.replace(/\s+/g, " ").trim();
/** Enough of the start of a text to tell two copies of the same review apart from two different ones. */
const fingerprint = (s: string) => tidy(s).toLowerCase().slice(0, 60);

async function fetchPlace(key: string): Promise<PlacesResponse | null> {
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}?languageCode=es`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    return res.ok ? ((await res.json()) as PlacesResponse) : null;
  } catch {
    return null;
  }
}

/** The review in both languages. Google already translates into the language
 *  requested (Spanish), which beats a free translation API, so use it when
 *  it is there. */
async function bothLanguages(r: PlacesReview): Promise<{ language: "en" | "es"; original: string; en: string; es: string } | null> {
  const source = r.originalText?.text ? r.originalText : r.text;
  const original = tidy(source?.text ?? "");
  if (!original) return null;

  const code = (source?.languageCode ?? "").toLowerCase().split("-")[0];
  const language: "en" | "es" = code === "es" || code === "en" ? code : detectLanguage(original, "es");

  const googleEs = r.text?.languageCode?.toLowerCase().startsWith("es") ? tidy(r.text.text ?? "") : "";
  const es = language === "es" ? original : googleEs || await translateText(original, language, "es");
  const en = language === "en" ? original : await translateText(es, "es", "en");
  return { language, original, en, es };
}

async function storeReview(r: PlacesReview): Promise<void> {
  const externalId = r.name;
  const author = tidy(r.authorAttribution?.displayName ?? "");
  const rating = Math.round(r.rating ?? 0);
  if (!externalId || !author || rating < 1 || rating > 5) return;

  const published = r.publishTime ? new Date(r.publishTime) : null;
  const when = published && !Number.isNaN(published.getTime()) ? published.toISOString() : null;
  const authorUrl = r.authorAttribution?.uri ?? null;
  const photoUrl = r.authorAttribution?.photoUri ?? null;

  const known = await sql`SELECT id, comment FROM reviews WHERE source = 'google' AND external_id = ${externalId}` as
    { id: number; comment: string }[];
  const incoming = tidy(r.originalText?.text ?? r.text?.text ?? "");

  if (known[0]) {
    // Already stored: refresh the details, and only redo the translation if
    // the author edited the text. The admin's approve/reject choice is kept.
    if (incoming && fingerprint(known[0].comment) !== fingerprint(incoming)) {
      const t = await bothLanguages(r);
      if (t) {
        await sql`
          UPDATE reviews SET rating = ${rating}, comment = ${t.original}, comment_en = ${t.en}, comment_es = ${t.es},
            language = ${t.language}, author_url = ${authorUrl}, photo_url = ${photoUrl}
          WHERE id = ${known[0].id}
        `;
        return;
      }
    }
    await sql`UPDATE reviews SET rating = ${rating}, author_url = ${authorUrl}, photo_url = ${photoUrl} WHERE id = ${known[0].id}`;
    return;
  }

  // Not seen through the API before. It may be one that was entered by hand
  // earlier (same author, same text): adopt that row instead of duplicating it.
  const sameAuthor = await sql`
    SELECT id, comment, comment_en, comment_es FROM reviews
    WHERE type = 'testimonial' AND external_id IS NULL AND lower(name) = lower(${author})
  ` as { id: number; comment: string; comment_en: string | null; comment_es: string | null }[];
  const mark = fingerprint(incoming);
  const adopted = mark
    ? sameAuthor.find(row => [row.comment, row.comment_en, row.comment_es].some(c => c && fingerprint(c) === mark))
    : undefined;
  if (adopted) {
    await sql`
      UPDATE reviews SET source = 'google', external_id = ${externalId}, rating = ${rating},
        author_url = ${authorUrl}, photo_url = ${photoUrl}, created_at = COALESCE(${when}::timestamptz, created_at)
      WHERE id = ${adopted.id}
    `;
    return;
  }

  const t = await bothLanguages(r);
  if (!t) return;
  await sql`
    INSERT INTO reviews (type, name, email, rating, comment, comment_en, comment_es, language, status, source, external_id, author_url, photo_url, created_at)
    VALUES ('testimonial', ${author}, '', ${rating}, ${t.original}, ${t.en}, ${t.es}, ${t.language}, 'approved', 'google', ${externalId}, ${authorUrl}, ${photoUrl}, COALESCE(${when}::timestamptz, now()))
  `;
}

/** Pulls the latest reviews and rating from Google. Safe to call often: it
 *  does nothing without a key, and at most one request goes out per 12 hours
 *  (per hour after a failure). */
export async function syncGoogleReviews(): Promise<void> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return;

  try {
    const rows = await sql`SELECT synced_at, attempted_at FROM google_place WHERE place_id = ${GOOGLE_PLACE_ID}` as
      { synced_at: string | null; attempted_at: string | null }[];
    const now = Date.now();
    const last = rows[0];
    if (last?.synced_at && now - new Date(last.synced_at).getTime() < REFRESH_AFTER_MS) return;
    if (last?.attempted_at && now - new Date(last.attempted_at).getTime() < RETRY_AFTER_MS) return;

    await sql`
      INSERT INTO google_place (place_id, rating, total, attempted_at) VALUES (${GOOGLE_PLACE_ID}, 0, 0, now())
      ON CONFLICT (place_id) DO UPDATE SET attempted_at = now()
    `;

    const place = await fetchPlace(key);
    if (!place) return;

    for (const review of place.reviews ?? []) await storeReview(review);

    if (typeof place.rating === "number" && (place.userRatingCount ?? 0) > 0) {
      await sql`
        UPDATE google_place SET rating = ${place.rating}, total = ${place.userRatingCount}, synced_at = now()
        WHERE place_id = ${GOOGLE_PLACE_ID}
      `;
    }
  } catch {
    // A failed refresh must never reach a visitor; the stored reviews stay.
  }
}
