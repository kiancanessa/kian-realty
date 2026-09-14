import { getSessionUser } from "../../../../lib/auth";
import { canManageProperties } from "../../../../lib/ownProperties";
import { parseCoordinates } from "../../../../lib/maps";

// "Share" in the Google Maps app produces maps.app.goo.gl links, which hold no
// coordinates until they are followed. The browser cannot follow them (CORS),
// so the editor asks this route to.
//
// Only Google hosts are fetched, and every redirect hop is checked again —
// otherwise this would be an open proxy into whatever a pasted URL points at.
// Explicit TLDs: a looser `google\.[a-z.]+` would also accept
// google.com.attacker.example.
const ALLOWED_HOST = /(^|\.)(goo\.gl|google\.com|google\.com\.mx)$/i;
const MAX_HOPS = 5;

export async function GET(request: Request): Promise<Response> {
  const user = await getSessionUser();
  if (!canManageProperties(user)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let url: URL;
  try {
    url = new URL(new URL(request.url).searchParams.get("url") ?? "");
  } catch {
    return Response.json({ error: "invalid url" }, { status: 400 });
  }

  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    if (url.protocol !== "https:" || !ALLOWED_HOST.test(url.hostname)) {
      return Response.json({ error: "not a google maps link" }, { status: 400 });
    }

    const coords = parseCoordinates(url.toString());
    if (coords) return Response.json(coords);

    const res = await fetch(url, { redirect: "manual", cache: "no-store" });
    const next = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && next) {
      url = new URL(next, url);
      continue;
    }
    // Some links land on a page rather than redirect; the pin is in the HTML.
    if (res.ok) {
      const html = (await res.text()).slice(0, 200_000);
      const fromPage = parseCoordinates(html.match(/https:\/\/www\.google\.[^"'\s]*maps[^"'\s]*/)?.[0] ?? "")
        ?? parseCoordinates(html.match(/!3d-?\d+\.\d+!4d-?\d+\.\d+/)?.[0] ?? "");
      if (fromPage) return Response.json(fromPage);
    }
    break;
  }

  return Response.json({ error: "no coordinates found" }, { status: 422 });
}
