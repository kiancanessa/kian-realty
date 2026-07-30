import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionUser } from "../../../../lib/auth";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"];

export async function POST(request: Request): Promise<Response> {
  const user = await getSessionUser();
  if (!user?.is_developer) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        addRandomSuffix: true,
      }),
      // Vercel calls this back over the public internet once the upload finishes,
      // so it only fires on a deployed URL — not on localhost during `next dev`.
      onUploadCompleted: async () => {},
    });

    return Response.json(jsonResponse);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
