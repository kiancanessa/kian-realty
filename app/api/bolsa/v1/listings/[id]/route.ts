// One shared listing, in full: description, every photo and the map point.
// Kept apart from the list so a partner only pays for the detail of what a
// visitor actually opens.
import { partnerFromRequest, unauthorized, NO_STORE } from "../../../../../lib/bolsa/auth";
import { buildDetail } from "../../../../../lib/bolsa/publish";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!partnerFromRequest(request)) return unauthorized();
  const { id } = await params;
  const detail = await buildDetail(id);
  if (!detail) return Response.json({ error: "not_found" }, { status: 404, headers: NO_STORE });
  return Response.json(detail, { headers: NO_STORE });
}
