// The shared-listing feed other allied agencies read. Read-only.
import { partnerFromRequest, unauthorized, NO_STORE } from "../../../../lib/bolsa/auth";
import { buildFeed } from "../../../../lib/bolsa/publish";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!partnerFromRequest(request)) return unauthorized();
  const feed = await buildFeed();
  return Response.json(feed, { headers: NO_STORE });
}
