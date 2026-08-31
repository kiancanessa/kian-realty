import { sql } from "../../../../lib/db";
import { getSessionUser } from "../../../../lib/auth";
import { parsePropertyInput, canManageProperties } from "../../../../lib/ownProperties";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!canManageProperties(user)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Publish/unpublish arrives on its own from the list view; a full edit
  // arrives from the editor. Handled separately so toggling doesn't require
  // round-tripping every field.
  if (typeof body.published === "boolean" && body.title === undefined) {
    await sql`UPDATE properties SET published = ${body.published}, updated_at = now() WHERE id = ${id}`;
    return Response.json({ ok: true });
  }

  const input = parsePropertyInput(body);
  if (!input) return Response.json({ error: "invalid_payload" }, { status: 400 });

  await sql`
    UPDATE properties SET
      title = ${input.title},
      description = ${input.description},
      location = ${input.location},
      operation = ${input.operation},
      property_type = ${input.property_type},
      price = ${input.price},
      currency = ${input.currency},
      bedrooms = ${input.bedrooms},
      bathrooms = ${input.bathrooms},
      parking_spaces = ${input.parking_spaces},
      lot_size = ${input.lot_size},
      construction_size = ${input.construction_size},
      images = ${JSON.stringify(input.images)},
      latitude = ${input.latitude},
      longitude = ${input.longitude},
      updated_at = now()
    WHERE id = ${id}
  `;

  return Response.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!canManageProperties(user)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM properties WHERE id = ${id}`;
  return Response.json({ ok: true });
}
