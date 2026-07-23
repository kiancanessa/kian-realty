import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sql } from "./db";

export const SESSION_COOKIE = "ecr_session";
const SESSION_DAYS = 30;

export type UserRole = "client" | "admin" | "vendedor";
export type SessionUser = { id: number; email: string; name: string; role: UserRole; is_developer: boolean };

function developerEmails(): string[] {
  return (process.env.DEVELOPER_EMAILS ?? "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, name: string, requestedRole: "client" | "team" = "client"): Promise<SessionUser> {
  // Only pre-approved developer emails self-promote on signup; everyone else
  // (team or clients) starts as a regular account until a developer grants
  // them a role from the Users panel. requestedRole is purely informational
  // — it tells the developer who asked for team access so they know who to
  // review, it does not grant any permission by itself.
  const isDeveloper = developerEmails().includes(email.toLowerCase());
  const passwordHash = await hashPassword(password);
  const rows = await sql`
    INSERT INTO users (email, password_hash, name, is_developer, requested_role)
    VALUES (${email.toLowerCase()}, ${passwordHash}, ${name}, ${isDeveloper}, ${requestedRole})
    RETURNING id, email, name, role, is_developer
  `;
  return rows[0] as SessionUser;
}

export async function findUserByEmail(email: string): Promise<(SessionUser & { password_hash: string }) | null> {
  const rows = await sql`
    SELECT id, email, name, role, is_developer, password_hash FROM users WHERE email = ${email.toLowerCase()}
  `;
  return (rows[0] as (SessionUser & { password_hash: string }) | undefined) ?? null;
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, ${expiresAt.toISOString()})`;

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await sql`
    SELECT u.id, u.email, u.name, u.role, u.is_developer
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > now()
  `;
  return (rows[0] as SessionUser | undefined) ?? null;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await sql`DELETE FROM sessions WHERE token = ${token}`;
  store.delete(SESSION_COOKIE);
}
