// Google Maps helpers shared by the property page and the admin editor.
// No server imports, so client components can use them.

export type LatLng = { lat: number; lng: number };

/** Map inside the property page.
 *
 *  With NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY set this uses the official Maps
 *  Embed API (free, no usage cap). Without it, it falls back to the key-less
 *  `output=embed` URL: it works today, but Google does not document it, so it
 *  could stop rendering without notice — adding the key is the fix, with no
 *  code change. */
export function googleMapEmbedUrl({ lat, lng }: LatLng, locale: string, zoom = 15): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const q = `${lat},${lng}`;
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${q}&zoom=${zoom}&language=${locale}`;
  }
  return `https://maps.google.com/maps?q=${q}&z=${zoom}&hl=${locale}&output=embed`;
}

/** Opens the spot in Google Maps (the app, on a phone). Official Maps URLs. */
export function googleMapsUrl({ lat, lng }: LatLng): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Route from wherever the visitor is to the property. */
export function googleDirectionsUrl({ lat, lng }: LatLng): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function valid(lat: number, lng: number): LatLng | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  if (lat === 0 && lng === 0) return null;
  return { lat, lng };
}

const NUM = String.raw`-?\d{1,3}(?:\.\d+)?`;

/** Coordinates from whatever an agent pastes: a Google Maps link copied from
 *  the browser or the app, or the "32.33, -117.03" pair Google shows on
 *  right-click. Short links (maps.app.goo.gl) carry no coordinates and have
 *  to be resolved on the server first — see /api/admin/maps/resolve. */
export function parseCoordinates(input: string): LatLng | null {
  let text = input.trim();
  try { text = decodeURIComponent(text); } catch { /* a stray "%" — parse it as is */ }

  // A dropped pin: !3d<lat>!4d<lng>. Checked before "@", because "@" is the
  // centre of the visible map, not necessarily where the pin is.
  let m = text.match(new RegExp(`!3d(${NUM})!4d(${NUM})`));
  if (m) return valid(Number(m[1]), Number(m[2]));

  // ?q= / query= / destination= / ll= / center=
  m = text.match(new RegExp(`[?&](?:q|query|destination|ll|center|daddr)=(${NUM})\\s*,\\s*(${NUM})`));
  if (m) return valid(Number(m[1]), Number(m[2]));

  // /@lat,lng,15z
  m = text.match(new RegExp(`@(${NUM}),(${NUM})`));
  if (m) return valid(Number(m[1]), Number(m[2]));

  // /place/32.33,-117.03 or /search/32.33,+-117.03
  m = text.match(new RegExp(`/(?:place|search|dir)/(${NUM})\\s*,\\s*\\+?(${NUM})`));
  if (m) return valid(Number(m[1]), Number(m[2]));

  // A bare pair
  m = text.match(new RegExp(`^(${NUM})\\s*,\\s*(${NUM})$`));
  if (m) return valid(Number(m[1]), Number(m[2]));

  return null;
}

export function isGoogleShortLink(input: string): boolean {
  try {
    const host = new URL(input.trim()).hostname;
    return host === "maps.app.goo.gl" || host === "goo.gl";
  } catch {
    return false;
  }
}
