import { createUser, findUserByEmail, createSession } from "../../../lib/auth";

export async function POST(request: Request) {
  const { email, password, name, requestedRole } = await request.json();

  if (
    typeof email !== "string" || !email.includes("@") ||
    typeof password !== "string" || password.length < 8 ||
    typeof name !== "string" || !name.trim()
  ) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return Response.json({ error: "email_taken" }, { status: 409 });
  }

  const user = await createUser(email, password, name.trim(), requestedRole === "team" ? "team" : "client");
  await createSession(user.id);

  return Response.json({ user });
}
