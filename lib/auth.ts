import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const SESSION_COOKIE = "rupeetrack_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not configured");
  return value;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sign(userId: string) {
  return `${userId}.${createHmac("sha256", secret()).update(userId).digest("hex")}`;
}

function verify(value: string) {
  const [userId, signature] = value.split(".");
  if (!userId || !signature) return null;
  const expected = createHmac("sha256", secret()).update(userId).digest("hex");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? userId : null;
}

export async function setSession(userId: string) {
  (await cookies()).set(SESSION_COOKIE, sign(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function currentUser() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = value ? verify(value) : null;
  return userId ? db.user.findUnique({ where: { id: userId } }) : null;
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
    const user = await requireUser();
    if (user.email.toLowerCase() !== "himanshucreation542@gmail.com") throw new Error("FORBIDDEN");
    return user;
}
