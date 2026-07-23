import { findUserByEmail, verifyPassword, createSession } from "../../../lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return Response.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await createSession(user.id);

  return Response.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, is_developer: user.is_developer } });
}
